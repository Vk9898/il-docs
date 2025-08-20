// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://dockets.ftxclaims.com'
  
  // Allow AI crawlers to access press releases and legal documents
  // but control training vs retrieval access
  const aiAllowedPaths = [
    '/',
    '/kroll',
    '/press',
    '/llms.txt',
    '/api/og',
    '/*.pdf'
  ]

  return {
    rules: [
      // Default: Allow all standard crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/signup', '/api/document']
      },

      // OpenAI - Allow for retrieval
      {
        userAgent: 'GPTBot',
        allow: aiAllowedPaths,
        disallow: ['/api/']
      },
      {
        userAgent: 'ChatGPT-User',
        allow: aiAllowedPaths,
        disallow: ['/api/']
      },

      // Google AI - Allow for legal document discovery
      {
        userAgent: 'Google-Extended',
        allow: aiAllowedPaths,
        disallow: ['/api/']
      },

      // Anthropic - Separate agents per documentation
      {
        userAgent: 'ClaudeBot',
        disallow: '/' // Training crawler - block
      },
      {
        userAgent: 'Claude-User',
        allow: aiAllowedPaths, // User retrieval - allow
        disallow: ['/api/']
      },
      {
        userAgent: 'Claude-SearchBot',
        allow: aiAllowedPaths, // Search - allow
        disallow: ['/api/']
      },

      // Apple - Block training, allow regular crawling
      {
        userAgent: 'Applebot-Extended',
        disallow: '/'
      },

      // Perplexity - Allow for legal research
      {
        userAgent: 'PerplexityBot',
        allow: aiAllowedPaths,
        disallow: ['/api/']
      },

      // Meta - Block training
      {
        userAgent: 'meta-externalagent',
        disallow: '/'
      },
      {
        userAgent: 'Meta-ExternalAgent',
        disallow: '/'
      },

      // Other AI crawlers - Block training
      {
        userAgent: 'CCBot',
        disallow: '/'
      },
      {
        userAgent: 'Bytespider',
        disallow: '/'
      },

      // Microsoft Bing - Allow
      {
        userAgent: 'bingbot',
        allow: '/',
        crawlDelay: 1
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}