export interface Category {
  title: string;
  slug: string;
  description: string;
  accentColor?: string;
}

export interface CategoryWithCount extends Category {
  count: number;
}