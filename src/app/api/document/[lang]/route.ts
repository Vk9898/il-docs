import { NextResponse } from 'next/server';
import { languages } from '@/lib/languages';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { lang } = await params;
    
    // Find the language configuration
    const language = languages.find(l => l.code === lang);
    
    if (!language) {
      return NextResponse.json(
        { error: 'Language not found' },
        { status: 404 }
      );
    }
    
    // For English, use the existing blob URL
    const pdfUrl = lang === 'en' 
      ? 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/kroll-lawsuit-ftx.pdf'
      : language.pdfUrl;
    
    // Fetch from Vercel Blob storage
    const response = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'FTXCLAIMS-Document-Viewer/1.0',
      },
    });
    
    if (!response.ok) {
      console.error(`Blob fetch failed for ${lang} with status: ${response.status}`);
      return NextResponse.json(
        { 
          error: 'Document not found',
          message: `Failed to fetch document for language ${lang} (${response.status})`
        },
        { status: 404 }
      );
    }

    const pdfBuffer = await response.arrayBuffer();
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Content-Disposition': `inline; filename="kroll-lawsuit-${lang}.pdf"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred while loading the document'
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}