import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ProgramBookGrid } from '@/components/library/ProgramBookGrid';

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: program } = await supabase
    .from('library_programs')
    .select('id, name, description, accent_color')
    .eq('slug', slug)
    .single();

  if (!program) notFound();

  const { data: books } = await supabase
    .from('library_books')
    .select('id, title, author, cover_image_url')
    .eq('program_id', program.id)
    .eq('status', 'published')
    .order('title', { ascending: true });

  const accent = program.accent_color || '#009CA4';

  return (
    <div>
      <Link
        href="/biblioteca"
        className="inline-flex items-center gap-1.5 text-sm text-bib-text-light-muted hover:text-bib-text-light-primary transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Voltar para a biblioteca
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <div className="w-3 h-10 rounded-full shrink-0" style={{ backgroundColor: accent }} aria-hidden="true" />
        <div>
          <h1
            className="text-2xl font-bold text-bib-text-light-primary"
            style={{ fontFamily: 'var(--font-bib-display)' }}
          >
            {program.name}
          </h1>
          {program.description && <p className="text-sm text-bib-text-light-muted">{program.description}</p>}
        </div>
      </div>

      <ProgramBookGrid books={books ?? []} accentColor={accent} />
    </div>
  );
}
