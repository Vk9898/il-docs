// Script to generate OG image from PDF
// Run this locally to create the OG image

const { convert } = require('pdf-to-img');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

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
      height: 630,
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