export interface BlogPost {
  slug: string;
  fileName: string;
  title: string;        // Title Tag (SEO)
  description: string;  // Meta Description
  schemaType: string;   // e.g. "Article", "Course"
  schemaName: string;   // Schema "name" property
  markdown: string;     // raw markdown body
  imageUrl: string;     // data URL or mock image path
  imageAlt: string;
  createdAt: number;
  updatedAt: number;
}

export interface SiteSettings {
  gaId: string;
}
