import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFDocument from 'pdfkit';
import fs from 'fs/promises';
import { createWriteStream, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyDyLUz5XFZW_9FN2a-M2BvPUJZfkoiUbWw';
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
  { code: 'en', name: 'English' },
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

// Disclaimer text generator
const getDisclaimer = (language) => {
  const timestamp = new Date().toISOString();
  return `IMPORTANT DISCLAIMER / AVISO IMPORTANTE / 重要免责声明 / إخلاء مسؤولية مهم

This document has been translated from English to ${language} using InstaLaw's automated translation service powered by Google Gemini 2.5 Pro. This translation is provided for convenience only and should not be considered as legal advice or as establishing any attorney-client relationship or privilege.

AI TRANSLATION NOTICE:
• This translation was generated using artificial intelligence (Google Gemini 2.5 Pro)
• AI systems are prone to hallucinations and may produce inaccuracies or errors
• The information is presented "as-is" without any warranties of accuracy or completeness
• This translation may contain errors, omissions, or misinterpretations
• For legal matters, always consult with a qualified attorney and refer to the original English document
• This translation does not constitute legal advice, legal representation, or create any attorney-client privilege or relationship
• InstaLaw and its affiliates assume no liability for any errors or omissions in this translation

LEGAL DISCLAIMER:
The original English document should be considered the sole authoritative version. Any discrepancies, conflicts, or ambiguities between this translation and the original English document shall be resolved in favor of the original English version. This translation is not certified and should not be used for official legal proceedings without proper verification by a certified translator.

Translation Details:
• Performed on: ${timestamp}
• Language: English to ${language}
• Model: Google Gemini 2.5 Pro (AI)
• Prompt: "Please translate the following legal document from English to ${language}, do not make omissions, do not fabricate falsehoods. Just translate in its entirety the provided document as best you can given the context."

NO ATTORNEY-CLIENT RELATIONSHIP:
Accessing, reading, or using this translated document does not create an attorney-client relationship with InstaLaw, its affiliates, or any party associated with the translation or distribution of this document.

========================================================================================

`;
};

// Create PDF with proper formatting for long documents
async function createPDF(translatedContent, language, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 72,
          bottom: 72,
          left: 72,
          right: 72
        },
        autoFirstPage: false
      });

      const stream = createWriteStream(outputPath);
      doc.pipe(stream);

      // Function to add header to each page
      const addPageHeader = () => {
        doc.fontSize(12)
           .fillColor('#0066CC')
           .text('INSTALAW', 72, 40, { align: 'left' })
           .fontSize(8)
           .fillColor('#666666')
           .text('Document Generated by InstaLaw Translation Service', 72, 55)
           .moveDown(2);
      };

      // First page with full disclaimer
      doc.addPage();
      addPageHeader();
      
      // Add disclaimer
      doc.fontSize(7)
         .fillColor('#CC0000')
         .text(getDisclaimer(language.name), {
           align: 'justify',
           lineGap: 1.5
         });

      // Add separator
      doc.moveDown();
      doc.strokeColor('#CCCCCC')
         .lineWidth(1)
         .moveTo(72, doc.y)
         .lineTo(doc.page.width - 72, doc.y)
         .stroke();
      doc.moveDown(2);

      // Process translated content
      const paragraphs = translatedContent.split(/\n\n+/);
      doc.fontSize(10)
         .fillColor('#000000');

      let firstContentPage = true;

      for (const paragraph of paragraphs) {
        // Check if we need a new page
        if (doc.y > doc.page.height - 120) {
          doc.addPage();
          addPageHeader();
          
          // Add small disclaimer reminder on each new page
          if (firstContentPage) {
            doc.fontSize(7)
               .fillColor('#999999')
               .text('AI Translation - See disclaimer on first page', { align: 'center' })
               .moveDown();
            firstContentPage = false;
          }
          
          doc.fontSize(10)
             .fillColor('#000000');
        }

        // Handle different paragraph types
        const trimmed = paragraph.trim();
        if (trimmed) {
          // Check if it's a heading (all caps or starts with number)
          if (trimmed === trimmed.toUpperCase() && trimmed.length < 100) {
            doc.fontSize(11)
               .font('Helvetica-Bold')
               .text(trimmed, { align: 'center' })
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

      // Add page numbers
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8)
           .fillColor('#999999')
           .text(
             `Page ${i + 1} of ${range.count}`,
             72,
             doc.page.height - 50,
             { align: 'center' }
           );
      }

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

// Translate document using Gemini with retry logic
async function translateDocument(originalText, language, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-pro-exp-0111',
        generationConfig: {
          temperature: 0.3,  // Lower temperature for more consistent translations
          maxOutputTokens: 50000,
        }
      });
      
      const prompt = `Please translate the following legal document from English to ${language.name}, do not make omissions, do not fabricate falsehoods. Just translate in its entirety the provided document as best you can given the context.

IMPORTANT INSTRUCTIONS:
1. Maintain all formatting, paragraph breaks, and structure of the original document
2. Translate legal terms accurately while preserving their legal meaning
3. Keep all case numbers, dates, names, and monetary amounts exactly as they appear
4. Preserve all section headings and numbering
5. Do not add any commentary or notes - only provide the translation

Document to translate:

${originalText}`;

      console.log(`[${language.code}] Translating to ${language.name} (attempt ${attempt}/${retries})...`);
      const result = await model.generateContent(prompt);
      const translation = result.response.text();
      
      if (translation && translation.length > 1000) {  // Basic validation
        console.log(`[${language.code}] ✓ Translation successful (${translation.length} chars)`);
        return translation;
      } else {
        throw new Error('Translation too short or empty');
      }
    } catch (error) {
      console.error(`[${language.code}] Attempt ${attempt} failed:`, error.message);
      if (attempt === retries) {
        throw error;
      }
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
}

// Process a single language
async function processLanguage(originalText, language) {
  const rawPath = path.join(__dirname, 'translations', `kroll_complaint_${language.code}_raw.md`);
  const pdfPath = path.join(__dirname, 'translations', `kroll_complaint_${language.code}.pdf`);
  
  try {
    // Skip if already processed
    if (existsSync(pdfPath) && existsSync(rawPath)) {
      console.log(`[${language.code}] Already processed, skipping...`);
      return { language: language.name, status: 'skipped' };
    }

    // Translate
    const translation = await translateDocument(originalText, language);
    
    // Save raw markdown
    await fs.writeFile(rawPath, translation, 'utf-8');
    console.log(`[${language.code}] ✓ Raw markdown saved`);
    
    // Create PDF
    await createPDF(translation, language, pdfPath);
    
    return { language: language.name, status: 'success' };
  } catch (error) {
    console.error(`[${language.code}] Failed:`, error.message);
    return { language: language.name, status: 'failed', error: error.message };
  }
}

// Main function with progress tracking
async function main() {
  try {
    // Read original document
    const originalPath = path.join(__dirname, 'original-document', 'Kroll_complaint.md');
    const originalText = await fs.readFile(originalPath, 'utf-8');
    
    console.log('================================');
    console.log('Legal Document Translation System');
    console.log('================================');
    console.log(`Original document: ${originalText.length} characters`);
    console.log(`Target languages: ${LANGUAGES.length}`);
    console.log(`Output directory: ${path.join(__dirname, 'translations')}`);
    console.log('================================\n');

    const results = [];
    const batchSize = 3; // Process 3 languages at a time to avoid rate limits
    
    for (let i = 0; i < LANGUAGES.length; i += batchSize) {
      const batch = LANGUAGES.slice(i, i + batchSize);
      console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(LANGUAGES.length/batchSize)}`);
      console.log(`Languages: ${batch.map(l => l.name).join(', ')}\n`);
      
      const batchResults = await Promise.all(
        batch.map(lang => processLanguage(originalText, lang))
      );
      results.push(...batchResults);
      
      // Rate limiting between batches
      if (i + batchSize < LANGUAGES.length) {
        console.log('\nWaiting 5 seconds before next batch...');
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
    
    console.log('\n✅ Translation process complete!');
    console.log(`Files saved in: ${path.join(__dirname, 'translations')}`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run
main();