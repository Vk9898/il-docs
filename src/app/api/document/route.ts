import { NextRequest, NextResponse } from 'next/server';

// The PDF URL from Vercel Blob storage
const BLOB_PDF_URL = 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/kroll-lawsuit-ftx.pdf';

export async function GET(request: NextRequest) {
  try {
    // Fetch from Vercel Blob storage
    const response = await fetch(BLOB_PDF_URL, {
      headers: {
        'User-Agent': 'FTXCLAIMS-Document-Viewer/1.0',
      },
    });
    
    if (!response.ok) {
      console.error(`Blob fetch failed with status: ${response.status}`);
      return NextResponse.json(
        { 
          error: 'Document not found',
          message: `Failed to fetch document from blob storage (${response.status})`
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
        'Content-Disposition': 'inline; filename="kroll-lawsuit-ftx.pdf"',
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