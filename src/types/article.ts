export interface ArticleFrontmatter {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  coverImage: string;
  excerpt: string;
  featured?: boolean;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

export interface Article extends ArticleFrontmatter {
  content: string;
  readingTime: string;
}

export interface ArticleCardData
  extends Pick<
    ArticleFrontmatter,
    | "title"
    | "slug"
    | "date"
    | "author"
    | "category"
    | "tags"
    | "coverImage"
    | "excerpt"
    | "featured"
  > {
  readingTime?: string;
}