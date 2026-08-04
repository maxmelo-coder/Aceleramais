export type LibraryRole = 'municipality' | 'admin';

export type BookStatus = 'processing' | 'published' | 'draft';

export interface LibraryProfile {
  id: string;
  role: LibraryRole;
  municipality_name: string | null;
  created_at: string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  accent_color: string | null;
  cover_image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Book {
  id: string;
  program_id: string;
  title: string;
  author: string | null;
  cover_image_url: string | null;
  total_pages: number;
  status: BookStatus;
  conversion_error: string | null;
  created_at: string;
  published_at: string | null;
  external_url: string | null;
}

export interface BookPage {
  id: string;
  book_id: string;
  page_number: number;
  image_path: string;
}

export interface BookAccessLog {
  id: string;
  book_id: string;
  municipality_id: string;
  opened_at: string;
  session_id: string;
}
