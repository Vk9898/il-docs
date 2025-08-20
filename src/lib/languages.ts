export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  pdfUrl: string;
}

export const languages: Language[] = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English', 
    flag: '🇬🇧',
    pdfUrl: '/kroll-complaint.pdf' // Local file
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية', 
    flag: '🇸🇦',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_ar.pdf'
  },
  { 
    code: 'bn', 
    name: 'Bengali', 
    nativeName: 'বাংলা', 
    flag: '🇧🇩',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_bn.pdf'
  },
  { 
    code: 'bg', 
    name: 'Bulgarian', 
    nativeName: 'Български', 
    flag: '🇧🇬',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_bg.pdf'
  },
  { 
    code: 'zh-CN', 
    name: 'Chinese (Simplified)', 
    nativeName: '简体中文', 
    flag: '🇨🇳',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_zh-CN.pdf'
  },
  { 
    code: 'zh-TW', 
    name: 'Chinese (Traditional)', 
    nativeName: '繁體中文', 
    flag: '🇹🇼',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_zh-TW.pdf'
  },
  { 
    code: 'hr', 
    name: 'Croatian', 
    nativeName: 'Hrvatski', 
    flag: '🇭🇷',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_hr.pdf'
  },
  { 
    code: 'cs', 
    name: 'Czech', 
    nativeName: 'Čeština', 
    flag: '🇨🇿',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_cs.pdf'
  },
  { 
    code: 'da', 
    name: 'Danish', 
    nativeName: 'Dansk', 
    flag: '🇩🇰',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_da.pdf'
  },
  { 
    code: 'nl', 
    name: 'Dutch', 
    nativeName: 'Nederlands', 
    flag: '🇳🇱',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_nl.pdf'
  },
  { 
    code: 'et', 
    name: 'Estonian', 
    nativeName: 'Eesti', 
    flag: '🇪🇪',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_et.pdf'
  },
  { 
    code: 'fa', 
    name: 'Farsi', 
    nativeName: 'فارسی', 
    flag: '🇮🇷',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_fa.pdf'
  },
  { 
    code: 'fi', 
    name: 'Finnish', 
    nativeName: 'Suomi', 
    flag: '🇫🇮',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_fi.pdf'
  },
  { 
    code: 'fr', 
    name: 'French', 
    nativeName: 'Français', 
    flag: '🇫🇷',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_fr.pdf'
  },
  { 
    code: 'de', 
    name: 'German', 
    nativeName: 'Deutsch', 
    flag: '🇩🇪',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_de.pdf'
  },
  { 
    code: 'el', 
    name: 'Greek', 
    nativeName: 'Ελληνικά', 
    flag: '🇬🇷',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_el.pdf'
  },
  { 
    code: 'gu', 
    name: 'Gujarati', 
    nativeName: 'ગુજરાતી', 
    flag: '🇮🇳',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_gu.pdf'
  },
  { 
    code: 'he', 
    name: 'Hebrew', 
    nativeName: 'עברית', 
    flag: '🇮🇱',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_he.pdf'
  },
  { 
    code: 'hi', 
    name: 'Hindi', 
    nativeName: 'हिन्दी', 
    flag: '🇮🇳',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_hi.pdf'
  },
  { 
    code: 'hu', 
    name: 'Hungarian', 
    nativeName: 'Magyar', 
    flag: '🇭🇺',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_hu.pdf'
  },
  { 
    code: 'id', 
    name: 'Indonesian', 
    nativeName: 'Bahasa Indonesia', 
    flag: '🇮🇩',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_id.pdf'
  },
  { 
    code: 'it', 
    name: 'Italian', 
    nativeName: 'Italiano', 
    flag: '🇮🇹',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_it.pdf'
  },
  { 
    code: 'ja', 
    name: 'Japanese', 
    nativeName: '日本語', 
    flag: '🇯🇵',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_ja.pdf'
  },
  { 
    code: 'kn', 
    name: 'Kannada', 
    nativeName: 'ಕನ್ನಡ', 
    flag: '🇮🇳',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_kn.pdf'
  },
  { 
    code: 'ko', 
    name: 'Korean', 
    nativeName: '한국어', 
    flag: '🇰🇷',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_ko.pdf'
  },
  { 
    code: 'lv', 
    name: 'Latvian', 
    nativeName: 'Latviešu', 
    flag: '🇱🇻',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_lv.pdf'
  },
  { 
    code: 'lt', 
    name: 'Lithuanian', 
    nativeName: 'Lietuvių', 
    flag: '🇱🇹',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_lt.pdf'
  },
  { 
    code: 'ml', 
    name: 'Malayalam', 
    nativeName: 'മലയാളം', 
    flag: '🇮🇳',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_ml.pdf'
  },
  { 
    code: 'mr', 
    name: 'Marathi', 
    nativeName: 'मराठी', 
    flag: '🇮🇳',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_mr.pdf'
  },
  { 
    code: 'no', 
    name: 'Norwegian', 
    nativeName: 'Norsk', 
    flag: '🇳🇴',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_no.pdf'
  },
  { 
    code: 'pl', 
    name: 'Polish', 
    nativeName: 'Polski', 
    flag: '🇵🇱',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_pl.pdf'
  },
  { 
    code: 'pt', 
    name: 'Portuguese', 
    nativeName: 'Português', 
    flag: '🇵🇹',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_pt.pdf'
  },
  { 
    code: 'ro', 
    name: 'Romanian', 
    nativeName: 'Română', 
    flag: '🇷🇴',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_ro.pdf'
  },
  { 
    code: 'ru', 
    name: 'Russian', 
    nativeName: 'Русский', 
    flag: '🇷🇺',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_ru.pdf'
  },
  { 
    code: 'sr', 
    name: 'Serbian', 
    nativeName: 'Српски', 
    flag: '🇷🇸',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_sr.pdf'
  },
  { 
    code: 'sk', 
    name: 'Slovak', 
    nativeName: 'Slovenčina', 
    flag: '🇸🇰',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_sk.pdf'
  },
  { 
    code: 'sl', 
    name: 'Slovenian', 
    nativeName: 'Slovenščina', 
    flag: '🇸🇮',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_sl.pdf'
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español', 
    flag: '🇪🇸',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_es.pdf'
  },
  { 
    code: 'sw', 
    name: 'Swahili', 
    nativeName: 'Kiswahili', 
    flag: '🇰🇪',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_sw.pdf'
  },
  { 
    code: 'sv', 
    name: 'Swedish', 
    nativeName: 'Svenska', 
    flag: '🇸🇪',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_sv.pdf'
  },
  { 
    code: 'th', 
    name: 'Thai', 
    nativeName: 'ไทย', 
    flag: '🇹🇭',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_th.pdf'
  },
  { 
    code: 'uk', 
    name: 'Ukrainian', 
    nativeName: 'Українська', 
    flag: '🇺🇦',
    pdfUrl: 'https://kirleckjvch4fn0m.public.blob.vercel-storage.com/translations/pdfs/kroll_complaint_uk.pdf'
  }
];

export const defaultLanguage = languages[0]; // English