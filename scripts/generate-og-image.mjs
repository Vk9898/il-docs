// Script to generate OG image from PDF
// Run this locally to create the OG image

import { convert } from 'pdf-to-img';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOGImage() {
  try {
    console.log('Fetching PDF from Vercel Blob...');
    
    // Fetch the PDF
    const response = await fetch('https://kirleckjvch4fn0m.public.blob.vercel-storage.com/kroll-lawsuit-ftx.pdf');
    const pdfBuffer = await response.arrayBuffer();
    
    console.log('Converting first page to image...');
    
    // Convert first page to image
    const conversion = await convert(Buffer.from(pdfBuffer), {
      width: 1200,
      height: 1200, // Square first to get full page
      page_numbers: [1]
    });
    
    for await (const page of conversion) {
      console.log('Processing image...');
      
      // Process with sharp - crop to show top portion with title
      await sharp(page.buffer)
        .resize(1200, 630, {
          fit: 'cover',
          position: 'top'
        })
        .composite([
          {
            input: Buffer.from(`
              <svg width="1200" height="630">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />
                    <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.3" />
                  </linearGradient>
                </defs>
                <rect width="1200" height="630" fill="url(#grad)" />
                <text x="60" y="560" font-family="Arial, sans-serif" font-size="28" fill="white" font-weight="bold">
                  FTXCLAIMS.COM - Legal Documents
                </text>
                <text x="60" y="590" font-family="Arial, sans-serif" font-size="20" fill="white">
                  Repko v. Kroll Restructuring Administration LLC
                </text>
              </svg>
            `),
            top: 0,
            left: 0
          }
        ])
        .png()
        .toFile(path.join(__dirname, '../public/og-image.png'));
      
      console.log('OG image created successfully at public/og-image.png');
      break; // Only process first page
    }
  } catch (error) {
    console.error('Error generating OG image:', error);
  }
}

generateOGImage();