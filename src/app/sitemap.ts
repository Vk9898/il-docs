// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dockets.ftxclaims.com'
  const currentDate = new Date().toISOString()

  return [
    {
      url: baseUrl,
      lastModified: '2025-08-20',
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/kroll`,
      lastModified: '2025-08-20',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/press`,
      lastModified: '2025-08-20',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: '2025-08-19',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/Hall_Attorneys_Kroll_Class_Action_2025-08-20.pdf`,
      lastModified: '2025-08-20',
      changeFrequency: 'never',
      priority: 0.8,
    }
  ]
}