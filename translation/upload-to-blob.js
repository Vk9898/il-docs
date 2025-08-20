import { put, list } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load env files from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Check for token in environment or process arguments
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.argv[2] || '';

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('ERROR: BLOB_READ_WRITE_TOKEN is required');
  console.log('\nUsage:');
  console.log('  1. Add BLOB_READ_WRITE_TOKEN to your .env or .env.local file');
  console.log('  2. Or run with: BLOB_READ_WRITE_TOKEN=your_token node upload-to-blob.js');
  console.log('  3. Or run with: node upload-to-blob.js your_token');
  console.log('\nChecked for .env files in:', path.join(__dirname, '..'));
  process.exit(1);
}

async function uploadFile(filePath, folder) {
  try {
    const fileName = path.basename(filePath);
    const fileContent = await fs.readFile(filePath);
    
    // Create a blob path with folder structure
    const blobPath = `translations/${folder}/${fileName}`;
    
    console.log(`Uploading ${blobPath}...`);
    
    const blob = await put(blobPath, fileContent, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    });
    
    console.log(`✓ Uploaded: ${blob.url}`);
    return { path: blobPath, url: blob.url, success: true };
  } catch (error) {
    console.error(`✗ Failed to upload ${filePath}:`, error.message);
    return { path: filePath, error: error.message, success: false };
  }
}

async function main() {
  console.log('================================');
  console.log('Vercel Blob Upload Tool');
  console.log('================================\n');
  
  const translationsDir = path.join(__dirname, 'translations');
  const results = [];
  
  try {
    // Get all PDF files
    const pdfFiles = await fs.readdir(translationsDir);
    const pdfs = pdfFiles.filter(f => f.endsWith('.pdf'));
    const markdowns = pdfFiles.filter(f => f.endsWith('.md'));
    
    console.log(`Found ${pdfs.length} PDF files`);
    console.log(`Found ${markdowns.length} Markdown files\n`);
    
    // Upload PDFs
    console.log('Uploading PDFs...');
    console.log('--------------------------------');
    for (const pdf of pdfs) {
      const filePath = path.join(translationsDir, pdf);
      const result = await uploadFile(filePath, 'pdfs');
      results.push(result);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Upload Markdowns
    console.log('\nUploading Markdown files...');
    console.log('--------------------------------');
    for (const md of markdowns) {
      const filePath = path.join(translationsDir, md);
      const result = await uploadFile(filePath, 'markdown');
      results.push(result);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Summary
    console.log('\n================================');
    console.log('Upload Summary');
    console.log('================================');
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✓ Successful uploads: ${successful}`);
    console.log(`✗ Failed uploads: ${failed}`);
    
    if (failed > 0) {
      console.log('\nFailed uploads:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.path}: ${r.error}`);
      });
    }
    
    // Save upload results to a JSON file
    const manifestPath = path.join(__dirname, 'blob-upload-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      successful: successful,
      failed: failed,
      files: results.filter(r => r.success).map(r => ({
        path: r.path,
        url: r.url
      }))
    }, null, 2));
    
    console.log(`\n✅ Upload manifest saved to: ${manifestPath}`);
    
    // List all blobs to verify
    console.log('\nVerifying uploads in Vercel Blob...');
    const { blobs } = await list({
      token: BLOB_READ_WRITE_TOKEN,
      prefix: 'translations/',
    });
    
    console.log(`Found ${blobs.length} files in Vercel Blob storage`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the upload
main();