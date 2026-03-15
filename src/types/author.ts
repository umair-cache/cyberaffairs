export interface AuthorSocials {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Author {
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  role: string;
  socials?: AuthorSocials;
}