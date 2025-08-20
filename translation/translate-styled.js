import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFDocument from 'pdfkit';
import fs from 'fs/promises';
import { createWriteStream, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gemini API configuration - USING GEMINI 2.5 PRO
const GEMINI_API_KEY = 'AIzaSyDyLUz5XFZW_9FN2a-M2BvPUJZfkoiUbWw';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Test languages
const TEST_LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' }
];

// Get disclaimer in English (always included)
const getEnglishDisclaimer = () => {
  const timestamp = new Date().toISOString();
  return `IMPORTANT LEGAL DISCLAIMER

This document has been translated using InstaLaw's automated translation service powered by Google Gemini 2.5 Pro. This translation is provided for convenience only and should not be considered as legal advice or as establishing any attorney-client relationship or privilege.

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
• Model: Google Gemini 2.5 Pro
• Service: InstaLaw Translation Services

NO ATTORNEY-CLIENT RELATIONSHIP:
Accessing, reading, or using this translated document does not create an attorney-client relationship with InstaLaw, its affiliates, or any party associated with the translation or distribution of this document.`;
};

// Function to translate the disclaimer itself
async function translateDisclaimer(targetLanguage) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro', // Gemini 2.5 Pro
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8000,
      }
    });
    
    const englishDisclaimer = getEnglishDisclaimer();
    
    const prompt = `Please translate the following legal disclaimer from English to ${targetLanguage.name}. Maintain all formatting and structure:

${englishDisclaimer}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error(`Error translating disclaimer to ${targetLanguage.name}:`, error);
    return getEnglishDisclaimer(); // Fallback to English
  }
}

// Create professionally styled PDF
async function createStyledPDF(translatedContent, language, translatedDisclaimer, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 80,
          bottom: 60,
          left: 60,
          right: 60
        },
        info: {
          Title: `Legal Document - ${language.name} Translation`,
          Author: 'InstaLaw Translation Services',
          Subject: 'Kroll Restructuring Administration LLC Class Action Complaint',
          Creator: 'InstaLaw powered by Gemini 2.5 Pro'
        }
      });

      const stream = createWriteStream(outputPath);
      doc.pipe(stream);

      // Professional header function with gradient-like effect
      const addProfessionalHeader = (pageNum = 1) => {
        // Blue header background
        doc.rect(0, 0, doc.page.width, 100)
           .fill('#003366');
        
        // InstaLaw logo/text in white
        doc.fontSize(24)
           .fillColor('#FFFFFF')
           .font('Helvetica-Bold')
           .text('INSTALAW', 60, 35);
        
        // Tagline
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#87CEEB')
           .text('Professional Legal Document Translation Services', 60, 65);
        
        // Language indicator on the right
        doc.fontSize(12)
           .fillColor('#FFFFFF')
           .text(`${language.name} Translation`, 60, 35, {
             align: 'right',
             width: doc.page.width - 120
           });
        
        // Reset position
        doc.y = 120;
      };

      // First page with disclaimer
      addProfessionalHeader();
      
      // Disclaimer section with styled box
      doc.rect(40, 120, doc.page.width - 80, 20)
         .fill('#FFE5E5');
      
      doc.fontSize(11)
         .fillColor('#CC0000')
         .font('Helvetica-Bold')
         .text('⚠ IMPORTANT DISCLAIMER / AVISO IMPORTANTE', 60, 125, {
           align: 'center',
           width: doc.page.width - 120
         });
      
      doc.y = 150;
      
      // Translated disclaimer first (if not English)
      if (language.code !== 'en') {
        doc.fontSize(8)
           .fillColor('#333333')
           .font('Helvetica')
           .text(translatedDisclaimer, 60, doc.y, {
             align: 'justify',
             width: doc.page.width - 120,
             lineGap: 2
           });
        
        doc.moveDown(2);
        
        // Separator
        doc.strokeColor('#CCCCCC')
           .lineWidth(1)
           .moveTo(60, doc.y)
           .lineTo(doc.page.width - 60, doc.y)
           .stroke();
        
        doc.moveDown();
      }
      
      // English disclaimer (always included)
      doc.rect(50, doc.y - 5, doc.page.width - 100, 15)
         .fill('#F0F8FF');
      
      doc.fontSize(9)
         .fillColor('#003366')
         .font('Helvetica-Bold')
         .text('English Disclaimer (Original)', 60, doc.y, {
           align: 'center',
           width: doc.page.width - 120
         });
      
      doc.moveDown();
      
      doc.fontSize(7)
         .fillColor('#666666')
         .font('Helvetica')
         .text(getEnglishDisclaimer(), 60, doc.y, {
           align: 'justify',
           width: doc.page.width - 120,
           lineGap: 1.5
         });
      
      // Add new page for content
      doc.addPage();
      addProfessionalHeader(2);
      
      // Document title
      doc.rect(40, 120, doc.page.width - 80, 30)
         .fill('#E6F3FF');
      
      doc.fontSize(14)
         .fillColor('#003366')
         .font('Helvetica-Bold')
         .text('TRANSLATED LEGAL DOCUMENT', 60, 130, {
           align: 'center',
           width: doc.page.width - 120
         });
      
      doc.y = 170;
      
      // Process translated content with better formatting
      const paragraphs = translatedContent.split(/\n\n+/);
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica');

      let pageNumber = 2;

      for (const paragraph of paragraphs) {
        // Check if we need a new page
        if (doc.y > doc.page.height - 100) {
          // Add page footer before new page
          doc.fontSize(8)
             .fillColor('#999999')
             .text(`Page ${pageNumber} | InstaLaw Translation Services | Gemini 2.5 Pro`, 60, doc.page.height - 40, {
               align: 'center',
               width: doc.page.width - 120
             });
          
          doc.addPage();
          pageNumber++;
          
          // Simplified header for content pages
          doc.rect(0, 0, doc.page.width, 60)
             .fill('#F5F5F5');
          
          doc.fontSize(12)
             .fillColor('#003366')
             .font('Helvetica-Bold')
             .text('INSTALAW', 60, 25);
          
          doc.fontSize(9)
             .fillColor('#666666')
             .font('Helvetica')
             .text(`${language.name} Translation - Continued`, doc.page.width - 200, 25);
          
          doc.y = 80;
          doc.fillColor('#000000');
        }

        const trimmed = paragraph.trim();
        if (trimmed) {
          // Check if it's a heading
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

      // Final page footer
      doc.fontSize(8)
         .fillColor('#999999')
         .text(`Page ${pageNumber} | InstaLaw Translation Services | Gemini 2.5 Pro`, 60, doc.page.height - 40, {
           align: 'center',
           width: doc.page.width - 120
         });

      doc.end();

      stream.on('finish', () => {
        console.log(`✓ Styled PDF created for ${language.name}`);
        resolve();
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

// Translate document using GEMINI 2.5 PRO
async function translateDocument(originalText, language) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro', // Gemini 2.5 Pro
      generationConfig: {
        temperature: 0.3,
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

    console.log(`[${language.code}] Translating to ${language.name} using Gemini 2.5 Pro...`);
    const result = await model.generateContent(prompt);
    const translation = result.response.text();
    
    console.log(`[${language.code}] ✓ Translation successful (${translation.length} chars)`);
    return translation;
  } catch (error) {
    console.error(`[${language.code}] Translation failed:`, error.message);
    throw error;
  }
}

// Main function
async function main() {
  try {
    // Read original document
    const originalPath = path.join(__dirname, 'original-document', 'Kroll_complaint.md');
    const originalText = await fs.readFile(originalPath, 'utf-8');
    
    console.log('================================');
    console.log('InstaLaw Translation System');
    console.log('Using: Gemini 2.5 Pro (gemini-2.5-pro)');
    console.log('================================');
    console.log(`Original document: ${originalText.length} characters`);
    console.log(`Testing languages: ${TEST_LANGUAGES.map(l => l.name).join(', ')}`);
    console.log('================================\n');

    for (const language of TEST_LANGUAGES) {
      try {
        console.log(`\nProcessing ${language.name}...`);
        
        // Translate the main document
        const translation = await translateDocument(originalText, language);
        
        // Translate the disclaimer
        console.log(`Translating disclaimer to ${language.name}...`);
        const translatedDisclaimer = await translateDisclaimer(language);
        
        // Save raw markdown
        const rawPath = path.join(__dirname, 'translations', `kroll_complaint_${language.code}_raw.md`);
        await fs.writeFile(rawPath, translation, 'utf-8');
        console.log(`✓ Raw markdown saved`);
        
        // Create styled PDF with bilingual disclaimer
        const pdfPath = path.join(__dirname, 'translations', `kroll_complaint_${language.code}_styled.pdf`);
        await createStyledPDF(translation, language, translatedDisclaimer, pdfPath);
        
        // Wait between languages to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`Failed to process ${language.name}:`, error.message);
      }
    }
    
    console.log('\n================================');
    console.log('✅ Translation test complete!');
    console.log('Files saved in:', path.join(__dirname, 'translations'));
    console.log('================================');
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run
main();