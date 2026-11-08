# Vetroarts Accessories Ltd - Website

A modern, responsive, front-end HTML5 website for **Vetroarts Accessories Ltd**, a Ugandan phone-case brand based in Kampala developing a range of cases for individuals, businesses, and retail partners across East Africa.

---

## 1. Project Overview & Structure

The website is built with clean semantic HTML5, modern vanilla CSS3, and vanilla JavaScript. It requires no build tools, dependencies, or paid services to run.

```
VetroArts/
├── index.html              # Home page
├── products.html           # Planned Product Range
├── custom-orders.html      # Individual Custom Orders & Enquiry Form
├── business-orders.html    # Corporate & Bulk Orders & Enquiry Form
├── about.html              # About Vetroarts, Kampala origins & manufacturing vision
├── contact.html            # Contact information, location, and general enquiry form
├── css/
│   └── style.css           # Central stylesheet with CSS custom properties (variables)
├── js/
│   └── main.js             # Mobile nav, accessible validation, email preparation
├── images/
│   ├── favicon.svg         # SVG favicon
│   ├── case-clear-tpu.svg  # Clear TPU case vector mockup
│   ├── case-silicone.svg   # Silicone case vector mockup
│   ├── case-hybrid.svg     # Hybrid bumper case vector mockup
│   ├── case-uv-print.svg   # UV-printed personalized case mockup
│   ├── case-corporate.svg  # Corporate-branded case mockup
│   ├── case-magsafe.svg    # MagSafe-compatible case mockup
│   ├── case-carbon.svg     # Carbon-fibre finish case mockup
│   ├── case-leather.svg    # Textured leather finish case mockup
│   └── case-rugged.svg     # Rugged armor case mockup
└── README.md               # Documentation & editing instructions
```

---

## 2. How to Preview the Website

### Option A: Using Python (Recommended)
You can run a local development server using Python:

```bash
# In the project directory:
python3 -m http.server 8000
```
Then open your web browser and navigate to:
**`http://localhost:8000`**

### Option B: Open Directly in Any Browser
You can open `index.html` directly by double-clicking it or right-clicking and selecting **Open With** &rarr; **Google Chrome / Safari / Firefox / Edge**. All pages, mockups, and scripts work locally without needing a web server.

---

## 3. How to Edit Website Elements

### A. Changing Colours and Design Tokens
All colours are defined as CSS variables at the top of [`css/style.css`](css/style.css#L11-L47):

```css
:root {
  /* Distinctive Brand Accent Colour */
  --color-accent: #0284C7;         /* Change this hex code to modify the brand accent */
  --color-accent-hover: #0369A1;   /* Hover state for buttons and links */
  --color-accent-light: #E0F2FE;   /* Subtle background tint for badges and active states */
  --color-accent-border: #BAE6FD;  /* Border tint for accent components */

  /* Neutral Theme Palette */
  --color-primary: #0F172A;        /* Deep slate for dark sections and typography */
  --color-bg-body: #F8FAFC;        /* Light clean background */
  --color-bg-card: #FFFFFF;        /* Card surface background */
}
```
*Tip: Change `--color-accent` to any brand colour (e.g. amber `#D97706`, emerald `#059669`, or cobalt `#2563EB`) and the entire website will update consistently.*

### B. Editing Contact Details
The official business contact details appear on [`contact.html`](contact.html), as well as in the footer of every HTML page:
- **Physical Address:** Plot 23, Bukoto–Kisasi Road, opposite Kabira Country Club, Kampala, Uganda
- **Phone Numbers:** `0774 016000` / `0754 000000`
- **Email:** `r.ajuk@seedofwheels.org`

To change the contact details, search and replace these values in:
- `contact.html` (Lines ~90–140 for the main card)
- `index.html`, `products.html`, `custom-orders.html`, `business-orders.html`, `about.html`, and `contact.html` (in the `site-footer` section)
- `js/main.js` (update `const recipient = 'r.ajuk@seedofwheels.org'` if the destination email changes)

### C. Editing Text & Page Content
Each page is self-contained semantic HTML:
- **Home (`index.html`):** Update hero tagline, feature summaries, and commercial overview.
- **Products (`products.html`):** Edit product category cards, plain descriptions, and phone model guidance notes.
- **Custom Orders (`custom-orders.html`):** Edit customisation options (photos, artwork, names, logos) and form questions.
- **Business Orders (`business-orders.html`):** Edit trade solutions, procurement use cases, and bulk enquiry fields.
- **About (`about.html`):** Update company background, local manufacturing status in Kampala, and regional East African objectives.
- **Contact (`contact.html`):** Update office directions, telephone, and email.

### D. Replacing Product Mockups
The current product cards use high-resolution, lightweight SVG mockups in the `images/` folder (`images/case-*.svg`).
To replace any mockup with a real photograph:
1. Place your photograph (JPG, PNG, or WebP) into the `images/` directory.
2. In the corresponding HTML file, update the `src` attribute of the `<img src="images/case-xxx.svg" alt="...">` tag.
3. Keep descriptive `alt` text for accessibility.

---

## 4. Form Backend Integration

Because this is a 100% static front-end build:
- Submitting the forms on **Custom Orders**, **Business Orders**, or **Contact** validates user inputs and prepares a formatted `mailto:` email directly directed to `r.ajuk@seedofwheels.org`.
- A feedback card also displays the compiled details with a **"Copy Details to Clipboard"** button so users can paste their enquiry into webmail (e.g. Gmail) if a desktop email client is not configured.
- **To hook up a real backend or API endpoint:**
  1. Open [`js/main.js`](js/main.js).
  2. Look for the `BACKEND INTEGRATION POINT` comments in `initCustomOrderForm()`, `initBusinessOrderForm()`, and `initContactForm()`.
  3. Replace the `window.location.href = mailtoUrl;` line with a standard `fetch('https://your-api.com/enquiry', { method: 'POST', body: ... })` call, or set the form's `action="https://formspree.io/f/YOUR_ID"` attribute.

---

## 5. Accessibility & Browser Compatibility

- Fully responsive across mobile screens (&lt;480px), tablets (768px), laptops (1024px), and 4K desktop displays.
- WCAG 2.1 AA compliant colour contrast ratios.
- Visible keyboard focus rings (`:focus-visible`).
- Accessible mobile navigation with keyboard navigation (`Escape` to close, `aria-expanded` state tracking).
- Skip-to-content accessibility link on every page.
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<footer>`).
- No external CDN dependencies; operates fully offline.
