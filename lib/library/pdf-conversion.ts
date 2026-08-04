import 'server-only';
import { createCanvas } from '@napi-rs/canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createAdminClient } from '@/lib/supabase/admin';

const TARGET_WIDTH_PX = 1200;
const JPEG_QUALITY = 0.85;

// Roda em background (chamado via `after()` a partir da Server Action de upload)
// para não travar a requisição HTTP principal com PDFs grandes/lentos.
export async function convertBookPdf(bookId: string): Promise<void> {
  const admin = createAdminClient();

  try {
    const { data: book, error: bookError } = await admin
      .from('library_books')
      .select('id, original_pdf_path')
      .eq('id', bookId)
      .single();
    if (bookError || !book?.original_pdf_path) {
      throw new Error('Livro ou PDF original não encontrado.');
    }

    const { data: pdfBlob, error: downloadError } = await admin.storage
      .from('library-book-pdfs')
      .download(book.original_pdf_path);
    if (downloadError || !pdfBlob) {
      throw new Error(`Falha ao baixar PDF original: ${downloadError?.message}`);
    }

    const pdfBytes = new Uint8Array(await pdfBlob.arrayBuffer());
    const doc = await pdfjsLib.getDocument({
      data: pdfBytes,
      disableFontFace: true,
      useSystemFonts: true,
    }).promise;

    const pageRows: { book_id: string; page_number: number; image_path: string }[] = [];
    let coverPublicUrl: string | null = null;

    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = TARGET_WIDTH_PX / baseViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      await page.render({
        // @napi-rs/canvas's context type is a superset of what pdfjs needs at runtime,
        // but doesn't structurally match pdfjs' DOM-oriented CanvasRenderingContext2D type.
        canvasContext: context as unknown as CanvasRenderingContext2D,
        canvas: canvas as unknown as HTMLCanvasElement,
        viewport,
      }).promise;

      const jpegBuffer = canvas.toBuffer('image/jpeg', JPEG_QUALITY);
      const imagePath = `${bookId}/${pageNumber}.jpg`;

      const { error: uploadError } = await admin.storage
        .from('library-book-pages')
        .upload(imagePath, jpegBuffer, { contentType: 'image/jpeg', upsert: true });
      if (uploadError) {
        throw new Error(`Falha ao enviar página ${pageNumber}: ${uploadError.message}`);
      }
      pageRows.push({ book_id: bookId, page_number: pageNumber, image_path: imagePath });

      if (pageNumber === 1) {
        const { error: coverUploadError } = await admin.storage
          .from('library-covers')
          .upload(`${bookId}.jpg`, jpegBuffer, { contentType: 'image/jpeg', upsert: true });
        if (!coverUploadError) {
          coverPublicUrl = admin.storage.from('library-covers').getPublicUrl(`${bookId}.jpg`).data.publicUrl;
        }
      }
    }

    if (pageRows.length === 0) {
      throw new Error('O PDF não contém páginas.');
    }

    await admin.from('library_book_pages').delete().eq('book_id', bookId);
    const { error: pagesInsertError } = await admin.from('library_book_pages').insert(pageRows);
    if (pagesInsertError) {
      throw new Error(`Falha ao registrar páginas: ${pagesInsertError.message}`);
    }

    await admin
      .from('library_books')
      .update({
        total_pages: pageRows.length,
        status: 'draft',
        cover_image_url: coverPublicUrl,
        conversion_error: null,
      })
      .eq('id', bookId);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido na conversão.';
    await admin
      .from('library_books')
      .update({ status: 'draft', conversion_error: message })
      .eq('id', bookId);
  }
}
