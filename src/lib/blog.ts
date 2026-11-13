import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'post'>;

/** Published posts, newest first. Drafts stay out of every page and the sitemap. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('post', ({ data }) => !data.draft);
  return posts.sort((a, b) => (b.data.publishDate?.valueOf() ?? 0) - (a.data.publishDate?.valueOf() ?? 0));
}

export function postPath(post: Post): string {
  return `/blog/${post.id}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('nl-BE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    date
  );
}

/** Whole minutes at a calm reading pace, never less than one. */
export function readingMinutes(body = ''): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
}
