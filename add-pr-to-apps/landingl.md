vvHere’s the clean, low‑friction way to publish and interlink the release across your three surfaces without creating SEO duplicates or confusing reporters.

**TL;DR (architecture)**

* **Canonical home:** `ftxclaims.com` (full HTML press release + PDF).
* **Law‑firm cross‑post:** `hallattorneys.com` (mirror page **with cross‑domain canonical → ftxclaims.com**).
* **Dockets hub:** `dockets.ftxclaims.com` (host the **complaint** + a short “Docket Notice” that links to the canonical release).

The PDF you shared already contains the required disclaimers (“Attorney Advertising…”, allegations only, contact info). Keep those verbatim on every surface.&#x20;

---

## If you publish on…

**1 of 3 (minimum viable):**

* Publish the **full release** at `ftxclaims.com/press/kroll-class-action-2025-08-20`.
* Put the **complaint** at `dockets.ftxclaims.com/repko-v-kroll/complaint.pdf`.
* Add a short “announcement post” on `hallattorneys.com` that **links out** to the canonical release (no duplicate body).

**2 of 3 (recommended):**

* Full release on **ftxclaims.com** (canonical).
* **hallattorneys.com** mirror (with `rel=canonical` to the ftxclaims URL).
* **dockets** hosts complaint + short notice linking to the canonical release.

**3 of 3 (max coverage, no cannibalization):**

* Same as “2 of 3,” plus a very short summary page on **dockets** (no full text), heavily linking to the canonical release and the complaint.

---

## Link map (make this exact)

* **Canonical release (HTML):**
  `https://ftxclaims.com/press/kroll-class-action-2025-08-20`
* **Downloadable release (PDF):**
  `https://ftxclaims.com/press/Hall_Attorneys_Kroll_Class_Action_2025-08-20.pdf`
* **Complaint (primary asset):**
  `https://dockets.ftxclaims.com/repko-v-kroll/complaint.pdf`
* **Docket index / case page:**
  `https://dockets.ftxclaims.com/repko-v-kroll/`  (links to complaint + filings, links back to canonical release)
* **Law firm cross‑post:**
  `https://hallattorneys.com/news/kroll-class-action-2025-08-20` (with canonical → ftxclaims.com)

Use consistent, descriptive link text (no “click here”). Include the two mandatory lines from the PDF at the top/bottom: **“Attorney Advertising.”** and **“The complaint contains allegations only; no findings have been made.”**&#x20;

---

## Tracking & UTM (non‑gross)

Add **UTMs only on outbound social + email**, not on-site links.

```
?utm_source=x&utm_medium=social&utm_campaign=kroll_class_action_2025_08_20
?utm_source=linkedin&utm_medium=social&utm_campaign=kroll_class_action_2025_08_20
```

---

## What each site should publish

### 1) ftxclaims.com (canonical)

* **Full HTML** body + **Download PDF** button.
* **Links:** complaint (dockets), law‑firm page, contact email/phone from the PDF.&#x20;
* **Technical:**

  * `rel=canonical` → self.
  * Open Graph + Twitter Card.
  * JSON‑LD **PressRelease** with publication date **2025‑08‑20**, Austin, TX.
  * Add to sitemap; noindex = false.

**Next.js 15 (App Router) skeleton:**

```tsx
// app/press/kroll-class-action-2025-08-20/page.tsx
import type { Metadata } from 'next';

const title = 'Hall Attorneys Files Class Action Against Kroll';
const description =
  'W.D. Tex. complaint alleges notice and verification failures harming FTX, BlockFi, and Genesis creditors.';
const canonical = 'https://ftxclaims.com/press/kroll-class-action-2025-08-20';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    type: 'article',
    title,
    description,
    url: canonical,
    siteName: 'FTX Claims',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function Page() {
  const complaintUrl = 'https://dockets.ftxclaims.com/repko-v-kroll/complaint.pdf';
  const pdfUrl = 'https://ftxclaims.com/press/Hall_Attorneys_Kroll_Class_Action_2025-08-20.pdf';
  const firmUrl = 'https://hallattorneys.com/news/kroll-class-action-2025-08-20';

  return (
    <main>
      <h1>Hall Attorneys Files Class Action Against Kroll</h1>
      <p><strong>Attorney Advertising.</strong> The complaint contains allegations only; no findings have been made.</p>
      <p><em>Austin, Texas — August 20, 2025.</em></p>
      {/* Body of the release here */}
      <p>
        Read the <a href={complaintUrl}>filed complaint (PDF)</a>.
        Download the <a href={pdfUrl}>press release (PDF)</a>.
        Law‑firm page: <a href={firmUrl}>Hall Attorneys</a>.
      </p>
      <script
        type="application/ld+json"
        // Minimal PressRelease schema (expand as needed)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'PressRelease',
            headline: title,
            datePublished: '2025-08-20T09:00:00-05:00',
            dateModified: '2025-08-20T09:00:00-05:00',
            articleBody: description,
            isBasedOn: 'https://dockets.ftxclaims.com/repko-v-kroll/complaint.pdf',
            publisher: { '@type': 'Organization', name: 'FTX Claims' },
            author: { '@type': 'Organization', name: 'Hall Attorneys, P.C.' },
            mainEntityOfPage: canonical,
          }),
        }}
      />
    </main>
  );
}
```

---

### 2) hallattorneys.com (cross‑post)

* Publish the **same HTML** (don’t change quotes).
* **Set cross‑domain canonical → ftxclaims** (Google supports this).
* Keep firm contact block prominent (email + phone from PDF).&#x20;

**Head tags to add there:**

```html
<link rel="canonical" href="https://ftxclaims.com/press/kroll-class-action-2025-08-20" />
<meta property="og:url" content="https://hallattorneys.com/news/kroll-class-action-2025-08-20" />
```

---

### 3) dockets.ftxclaims.com (complaint + short notice)

* **Primary:** host the complaint PDF at a stable path.
* **Short “Docket Notice” page** (3–5 sentences) that links to:

  * the complaint (PDF),
  * the canonical press release on ftxclaims.com,
  * the law‑firm page (optional).

Keep this page **brief** to avoid duplicate content. Use a descriptive H1 and a “Files” list.

---

## PDF handling (everywhere the PDF appears)

* Filename: `Hall_Attorneys_Kroll_Class_Action_2025-08-20.pdf`
* Headers: `Content-Disposition: inline` (so it opens in browser) and a visible **Download** button.
* If you must surface the PDF on multiple domains, link them all back to the **canonical HTML** page.

---

## Accessibility & legal must‑haves (non‑negotiable)

* H1 = exact headline; logical H2s; no all‑caps paragraphs.
* Link text is descriptive (“Read the filed complaint”), not “here.”
* Include the two disclaimers from the PDF on every surface.&#x20;

---

## Social posts / share URLs (copy‑paste)

* **X/Twitter:**
  `https://x.com/intent/tweet?text=Hall%20Attorneys%20files%20class%20action%20against%20Kroll&url=https%3A%2F%2Fftxclaims.com%2Fpress%2Fkroll-class-action-2025-08-20%3Futm_source%3Dx%26utm_medium%3Dsocial%26utm_campaign%3Dkroll_class_action_2025_08_20`
* **LinkedIn:**
  `https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fftxclaims.com%2Fpress%2Fkroll-class-action-2025-08-20%3Futm_source%3Dlinkedin%26utm_medium%3Dsocial%26utm_campaign%3Dkroll_class_action_2025_08_20`

---

## Quick launch checklist (10 steps)

1. Create the **canonical** page on ftxclaims.com with full HTML + disclaimers.&#x20;
2. Upload complaint to dockets with a stable slug.
3. Upload the press‑release PDF to ftxclaims.com and link it from the canonical page.
4. Publish a **short** dockets notice linking to (a) complaint and (b) canonical release.
5. Publish the **hallattorneys.com** mirror with `rel=canonical` → ftxclaims.
6. Ensure OG/Twitter cards render (title, description, image if you have one).
7. Add both pages to their sitemaps; deploy.
8. Post on X/LinkedIn using the UTM’d canonical URL.
9. Set internal nav: “Press” on ftxclaims.com lists this item first.
10. Verify all three surfaces link to each other exactly as in the **Link map** above.

If you want, I can turn the uploaded PDF into a clean HTML body block for the canonical page and hand you the finished `page.tsx` with the content dropped in.
