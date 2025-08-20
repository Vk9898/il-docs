// app/sitemap.xml/route.ts
// This proxies the Next.js 15 sitemap to the legacy .xml URL
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const protocol = url.protocol
  const host = url.host
  
  // Fetch the sitemap from the Next.js 15 route
  const sitemapUrl = `${protocol}//${host}/sitemap`
  
  try {
    const response = await fetch(sitemapUrl)
    const xml = await response.text()
    
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    })
  } catch {
    // Fallback to a basic sitemap if fetch fails
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${protocol}//${host}/</loc>
    <lastmod>2025-08-20</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${protocol}//${host}/kroll</loc>
    <lastmod>2025-08-20</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${protocol}//${host}/press</loc>
    <lastmod>2025-08-20</lastmod>
    <priority>0.9</priority>
  </url>
</urlset>`
    
    return new NextResponse(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    })
  }
}