import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFDocument from 'pdfkit';
import fs from 'fs/promises';
import { createWriteStream, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gemini API configuration - USING GEMINI 2.5 PRO
const GEMINI_API_KEY = 'AIzaSyA3KqC56mYYncSli-7W9--oM7WD8-nrVk4';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// All 40 languages
const LANGUAGES = [
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'et', name: 'Estonian' },
  { code: 'fa', name: 'Farsi' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ko', name: 'Korean' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mr', name: 'Marathi' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'vi', name: 'Vietnamese' }
];

// Concise disclaimer that fits on one page
const getDisclaimer = (language) => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `IMPORTANT DISCLAIMER

This document was translated from English to ${language} by InstaLaw using Google Gemini 2.5 Pro AI.

• AI translations may contain errors or inaccuracies
• This is NOT legal advice and creates NO attorney-client relationship
• The original English document is the only authoritative version
• For legal matters, consult a qualified attorney

Translation Date: ${timestamp}
Model: Google Gemini 2.5 Pro
Prompt: "Translate the following legal document from English to ${language}, do not make omissions, do not fabricate falsehoods."`;
};

// Clean AI response artifacts
function cleanTranslation(text) {
  // Remove common AI prefixes
  const prefixes = [
    /^(Of course[.,]?\s+)?Here is the .* translation.*?:\s*/i,
    /^I'll translate.*?:\s*/i,
    /^The following is.*?:\s*/i,
    /^Certainly[.,]?\s+/i,
    /^Sure[.,]?\s+/i,
    /^\*\*\*.+?\*\*\*\s*/,
    /^Here's the translation.*?:\s*/i,
  ];
  
  let cleaned = text;
  for (const prefix of prefixes) {
    cleaned = cleaned.replace(prefix, '');
  }
  
  // Remove any trailing AI comments
  cleaned = cleaned.replace(/\n\n---\n\n.*?$/s, '');
  cleaned = cleaned.replace(/\n\nI hope this.*?$/is, '');
  cleaned = cleaned.replace(/\n\nPlease note.*?$/is, '');
  cleaned = cleaned.replace(/\n\nLet me know.*?$/is, '');
  
  return cleaned.trim();
}

// Create minimal PDF without headers
async function createMinimalPDF(translatedContent, language, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 60,
          right: 60
        },
        info: {
          Title: `Legal Document - ${language.name} Translation`,
          Author: 'InstaLaw Translation Services',
          Creator: 'InstaLaw powered by Gemini 2.5 Pro'
        }
      });

      const stream = createWriteStream(outputPath);
      doc.pipe(stream);

      // First page - Start with disclaimer at top
      doc.fontSize(10)
         .fillColor('#003366')
         .font('Helvetica-Bold')
         .text('INSTALAW', { align: 'center' });
      
      doc.fontSize(8)
         .fillColor('#666666')
         .font('Helvetica')
         .text(`${language.name} Translation`, { align: 'center' });
      
      doc.moveDown(2);
      
      // Disclaimer box
      doc.fontSize(10)
         .fillColor('#CC0000')
         .font('Helvetica-Bold')
         .text('⚠ IMPORTANT DISCLAIMER', { align: 'center' });
      
      doc.moveDown();
      
      // Disclaimer content
      doc.fontSize(8)
         .fillColor('#333333')
         .font('Helvetica')
         .text(getDisclaimer(language.name), {
           align: 'left',
           lineGap: 2
         });
      
      // Separator line
      doc.moveDown();
      doc.strokeColor('#CCCCCC')
         .lineWidth(0.5)
         .moveTo(60, doc.y)
         .lineTo(doc.page.width - 60, doc.y)
         .stroke();
      
      doc.moveDown(2);
      
      // Start translated content
      doc.fontSize(11)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('TRANSLATED DOCUMENT', { align: 'center' });
      
      doc.moveDown(2);
      
      // Process translated content
      const paragraphs = translatedContent.split(/\n\n+/);
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica');

      let pageNumber = 1;

      for (const paragraph of paragraphs) {
        // Check if we need a new page
        if (doc.y > doc.page.height - 80) {
          // Add page number at bottom
          doc.fontSize(8)
             .fillColor('#999999')
             .text(`${pageNumber}`, 60, doc.page.height - 40, {
               align: 'center',
               width: doc.page.width - 120
             });
          
          doc.addPage();
          pageNumber++;
          
          // NO HEADER ON CONTINUATION PAGES - just start with content
          doc.fontSize(10)
             .fillColor('#000000')
             .font('Helvetica');
        }

        const trimmed = paragraph.trim();
        if (trimmed) {
          // Check if it's a heading (all caps and short)
          if (trimmed === trimmed.toUpperCase() && trimmed.length < 100) {
            doc.fontSize(11)
               .font('Helvetica-Bold')
               .text(trimmed, {
                 align: 'center',
                 lineGap: 3
               })
               .font('Helvetica')
               .fontSize(10)
               .moveDown();
          } else if (/^\d+\./.test(trimmed)) {
            // Numbered paragraph
            doc.text(trimmed, {
              align: 'justify',
              indent: 20,
              lineGap: 2
            }).moveDown(0.5);
          } else {
            // Regular paragraph
            doc.text(trimmed, {
              align: 'justify',
              lineGap: 2
            }).moveDown(0.5);
          }
        }
      }

      // Final page number
      doc.fontSize(8)
         .fillColor('#999999')
         .text(`${pageNumber}`, 60, doc.page.height - 40, {
           align: 'center',
           width: doc.page.width - 120
         });

      doc.end();

      stream.on('finish', () => {
        console.log(`✓ PDF created for ${language.name}`);
        resolve();
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

// Translate document using GEMINI 2.5 PRO
async function translateDocument(originalText, language, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-pro',
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 50000,
        }
      });
      
      const prompt = `Translate the following legal document from English to ${language.name}. Do not make omissions, do not fabricate falsehoods. Just translate in its entirety the provided document as best you can given the context.

IMPORTANT: 
- Only provide the translation, no introductions or explanations
- Do not say "Here is the translation" or similar phrases
- Start directly with the translated content
- Maintain all formatting and structure
- Keep all names, dates, case numbers exactly as they appear

Document to translate:

${originalText}`;

      console.log(`[${language.code}] Translating to ${language.name} (attempt ${attempt})...`);
      const result = await model.generateContent(prompt);
      let translation = result.response.text();
      
      // Clean any AI artifacts
      translation = cleanTranslation(translation);
      
      if (translation && translation.length > 1000) {
        console.log(`[${language.code}] ✓ Translation successful`);
        return translation;
      } else {
        throw new Error('Translation too short or empty');
      }
    } catch (error) {
      console.error(`[${language.code}] Attempt ${attempt} failed:`, error.message);
      if (attempt === retries) throw error;
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
    }
  }
}

// Process a single language
async function processLanguage(originalText, language) {
  const pdfPath = path.join(__dirname, 'translations', `kroll_complaint_${language.code}.pdf`);
  const rawPath = path.join(__dirname, 'translations', `kroll_complaint_${language.code}_raw.md`);
  
  try {
    // Skip if already processed
    if (existsSync(pdfPath)) {
      console.log(`[${language.code}] Already processed, skipping...`);
      return { language: language.name, status: 'skipped' };
    }

    // Translate
    const translation = await translateDocument(originalText, language);
    
    // Save raw markdown
    await fs.writeFile(rawPath, translation, 'utf-8');
    
    // Create PDF
    await createMinimalPDF(translation, language, pdfPath);
    
    return { language: language.name, status: 'success' };
  } catch (error) {
    console.error(`[${language.code}] Failed:`, error.message);
    return { language: language.name, status: 'failed', error: error.message };
  }
}

// Main function for all languages
async function main() {
  try {
    // Read original document
    const originalPath = path.join(__dirname, 'original-document', 'Kroll_complaint.md');
    const originalText = await fs.readFile(originalPath, 'utf-8');
    
    console.log('================================');
    console.log('InstaLaw Translation System');
    console.log('Model: Gemini 2.5 Pro');
    console.log('================================');
    console.log(`Languages: ${LANGUAGES.length}`);
    console.log(`Document: ${originalText.length} characters`);
    console.log('================================\n');

    const results = [];
    
    // Process one at a time to avoid rate limits
    for (const language of LANGUAGES) {
      console.log(`\nProcessing ${language.name}...`);
      const result = await processLanguage(originalText, language);
      results.push(result);
      
      // Wait between languages
      if (result.status === 'success') {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Summary
    console.log('\n================================');
    console.log('Translation Summary');
    console.log('================================');
    const successful = results.filter(r => r.status === 'success').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const failed = results.filter(r => r.status === 'failed').length;
    
    console.log(`✓ Successful: ${successful}`);
    console.log(`⊖ Skipped: ${skipped}`);
    console.log(`✗ Failed: ${failed}`);
    
    if (failed > 0) {
      console.log('\nFailed languages:');
      results.filter(r => r.status === 'failed').forEach(r => {
        console.log(`  - ${r.language}: ${r.error}`);
      });
    }
    
    console.log('\n✅ Process complete!');
    console.log(`Files saved in: ${path.join(__dirname, 'translations')}`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run
main();