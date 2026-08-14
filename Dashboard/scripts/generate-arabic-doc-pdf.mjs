import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const bundledNodeModules =
  process.env.CODEX_NODE_MODULES ??
  '/Users/isupekira/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const markdownPath = path.join(projectRoot, 'DOCUMENTATION_AR.md');
const outputDir = path.join(projectRoot, 'output', 'pdf');
const tempDir = path.join(projectRoot, 'tmp', 'pdfs');
const htmlPath = path.join(tempDir, 'transpay-documentation-ar.html');
const pdfPath = path.join(outputDir, 'TransPay_Dashboard_Documentation_AR.pdf');

const { marked } = await import(pathToFileURL(path.join(bundledNodeModules, 'marked/lib/marked.esm.js')).href);
const { chromium } = await import(pathToFileURL(path.join(bundledNodeModules, 'playwright/index.mjs')).href);

const markdown = await fs.readFile(markdownPath, 'utf8');

marked.setOptions({
  gfm: true,
  breaks: false,
});

const headings = [];
const renderer = new marked.Renderer();
const baseHeading = renderer.heading.bind(renderer);
renderer.heading = ({ tokens, depth }) => {
  const text = tokens.map((token) => token.raw ?? token.text ?? '').join('');
  const clean = text.replace(/<[^>]+>/g, '').trim();
  const id = clean
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
  if (depth === 2) headings.push({ id, text: clean });
  return `<h${depth} id="${id}">${marked.parseInline(text)}</h${depth}>`;
};

let bodyHtml = marked(markdown, { renderer });
bodyHtml = bodyHtml.replace('<h2 ', '<h2 class="first-section" ');
renderer.heading = baseHeading;

const tocHtml = headings
  .map((heading) => `<li><a href="#${heading.id}">${heading.text}</a></li>`)
  .join('\n');

const today = new Intl.DateTimeFormat('ar-IQ', {
  dateStyle: 'long',
}).format(new Date());

const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TransPay Dashboard Documentation</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 22mm 16mm;
    }

    :root {
      --ink: #1d1b1c;
      --muted: #69645d;
      --line: #e8e0d2;
      --soft: #fff9ed;
      --gold: #fac445;
      --gold-dark: #b88d25;
      --emerald: #087f5b;
      --rose: #b42318;
      --slate: #f7f5f0;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      color: var(--ink);
      background: #ffffff;
      font-family: Tahoma, Arial, "Arial Unicode MS", sans-serif;
      font-size: 10.6pt;
      line-height: 1.72;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page-shell {
      position: relative;
    }

    .cover {
      min-height: 232mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12mm 4mm 4mm;
      break-after: page;
      border: 1px solid var(--line);
      background:
        linear-gradient(135deg, rgba(250, 196, 69, 0.22), rgba(255, 255, 255, 0) 38%),
        linear-gradient(180deg, #ffffff, #fffaf0);
      border-radius: 10mm;
    }

    .brand-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10mm;
    }

    .brand-mark {
      width: 19mm;
      height: 19mm;
      border-radius: 6mm;
      background: var(--gold);
      color: var(--ink);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 17pt;
      box-shadow: 0 10px 24px rgba(184, 141, 37, 0.22);
    }

    .brand-copy {
      text-align: right;
      flex: 1;
    }

    .brand-copy strong {
      display: block;
      font-size: 20pt;
      letter-spacing: 0;
    }

    .brand-copy span {
      color: var(--muted);
      font-size: 9pt;
    }

    .cover h1 {
      margin: 24mm 0 5mm;
      font-size: 34pt;
      line-height: 1.18;
      max-width: 145mm;
    }

    .cover .subtitle {
      margin: 0;
      color: var(--muted);
      font-size: 14pt;
      max-width: 145mm;
    }

    .cover-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5mm;
      margin-top: 18mm;
    }

    .metric {
      border: 1px solid var(--line);
      border-radius: 5mm;
      background: rgba(255, 255, 255, 0.78);
      padding: 6mm;
      min-height: 32mm;
    }

    .metric strong {
      display: block;
      font-size: 10pt;
      margin-bottom: 2mm;
    }

    .metric span {
      color: var(--muted);
      font-size: 8.5pt;
    }

    .toc {
      break-after: page;
      padding: 4mm 0;
    }

    .toc h2 {
      margin-top: 0;
      border: 0;
      padding: 0;
    }

    .toc ol {
      list-style: none;
      margin: 8mm 0 0;
      padding: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3mm 6mm;
      counter-reset: toc;
    }

    .toc li {
      counter-increment: toc;
      border: 1px solid var(--line);
      background: #fffdf8;
      border-radius: 4mm;
      padding: 3.3mm 4mm;
      min-height: 13mm;
    }

    .toc li::before {
      content: counter(toc, decimal-leading-zero);
      display: inline-block;
      direction: ltr;
      color: var(--gold-dark);
      font-weight: 800;
      margin-left: 2mm;
    }

    .toc a {
      color: var(--ink);
      text-decoration: none;
      font-weight: 700;
      font-size: 9.2pt;
    }

    .content {
      counter-reset: section;
    }

    h1, h2, h3, h4 {
      page-break-after: avoid;
      break-after: avoid;
      color: var(--ink);
      letter-spacing: 0;
    }

    .content > h1:first-child {
      display: none;
    }

    h2 {
      margin: 14mm 0 5mm;
      padding: 4mm 0 3mm;
      border-bottom: 2px solid var(--gold);
      font-size: 19pt;
      line-height: 1.28;
      break-before: page;
    }

    h2.first-section {
      break-before: auto;
      margin-top: 8mm;
    }

    h2::before {
      content: "";
      display: inline-block;
      width: 4mm;
      height: 4mm;
      background: var(--gold);
      border-radius: 1.2mm;
      margin-left: 2.5mm;
      vertical-align: middle;
    }

    h3 {
      margin: 8mm 0 3mm;
      font-size: 13.2pt;
      color: #2f2b24;
    }

    h4 {
      margin: 6mm 0 2mm;
      font-size: 11.2pt;
    }

    p {
      margin: 0 0 3.5mm;
      orphans: 3;
      widows: 3;
    }

    blockquote {
      margin: 5mm 0;
      padding: 4mm 5mm;
      border-right: 4px solid var(--gold);
      background: var(--soft);
      color: #3a3329;
      border-radius: 4mm 0 0 4mm;
    }

    ul, ol {
      margin: 2mm 0 5mm;
      padding-right: 7mm;
    }

    li {
      margin-bottom: 1.5mm;
    }

    strong {
      font-weight: 800;
    }

    a {
      color: #775806;
      text-decoration-color: rgba(184, 141, 37, 0.45);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 5mm 0 7mm;
      font-size: 8.2pt;
      line-height: 1.48;
      page-break-inside: auto;
      break-inside: auto;
      box-shadow: 0 0 0 1px var(--line);
      border-radius: 3mm;
      overflow: hidden;
    }

    thead {
      display: table-header-group;
    }

    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    th {
      background: #2a2724;
      color: #ffffff;
      font-weight: 800;
      padding: 2.5mm 2.8mm;
      text-align: right;
      border: 1px solid #3a3631;
    }

    td {
      padding: 2.4mm 2.8mm;
      border: 1px solid var(--line);
      vertical-align: top;
      background: #ffffff;
    }

    tbody tr:nth-child(even) td {
      background: #fffaf0;
    }

    code {
      direction: ltr;
      unicode-bidi: embed;
      font-family: "SF Mono", Menlo, Consolas, monospace;
      font-size: 8.4pt;
      background: #f3efe7;
      color: #2b2925;
      border: 1px solid #e2d8c8;
      border-radius: 1.5mm;
      padding: 0.2mm 1.2mm;
    }

    pre {
      direction: ltr;
      text-align: left;
      background: #171614;
      color: #fff7df;
      border-radius: 4mm;
      padding: 4mm;
      overflow: hidden;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: "SF Mono", Menlo, Consolas, monospace;
      font-size: 8.1pt;
      line-height: 1.5;
      margin: 4mm 0 6mm;
      border: 1px solid #38332a;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    pre code {
      background: transparent;
      border: 0;
      color: inherit;
      padding: 0;
      font-size: inherit;
    }

    hr {
      border: 0;
      border-top: 1px solid var(--line);
      margin: 8mm 0;
    }

    .note-strip {
      margin: 0 0 7mm;
      padding: 4mm 5mm;
      border: 1px solid var(--line);
      border-radius: 4mm;
      background: linear-gradient(90deg, rgba(250, 196, 69, 0.2), rgba(255, 255, 255, 0));
      color: var(--muted);
      font-size: 9pt;
    }

    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <section class="cover">
    <div>
      <div class="brand-row">
        <div class="brand-mark">T</div>
        <div class="brand-copy">
          <strong>TransPay Dashboard</strong>
          <span>توثيق تقني احترافي للمناقشة والعرض أمام اللجنة</span>
        </div>
      </div>
      <h1>توثيق مشروع لوحة إدارة النقل</h1>
      <p class="subtitle">تحليل معماري وبرمجي مبسط للمبتدئين، مع شرح التقنيات، تدفق البيانات، نقاط القوة، القيود، وخطة العرض العملي.</p>
      <div class="cover-grid">
        <div class="metric"><strong>Frontend SPA</strong><span>React + TypeScript + Vite</span></div>
        <div class="metric"><strong>API خارجي</strong><span>HTTP requests عبر fetchApi</span></div>
        <div class="metric"><strong>جاهز للمراجعة</strong><span>Build وLint تم التحقق منهما</span></div>
      </div>
    </div>
  </section>

  <section class="toc">
    <h2>فهرس المحتويات</h2>
    <ol>${tocHtml}</ol>
  </section>

  <main class="content">
    <div class="note-strip">تم توليد هذا الملف من التوثيق العربي بعد تحليل ملفات المشروع. الأقسام غير الموجودة في الكود الحالي موضحة بصراحة داخل الوثيقة.</div>
    ${bodyHtml}
  </main>
</body>
</html>`;

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(tempDir, { recursive: true });
await fs.writeFile(htmlPath, html, 'utf8');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `
    <div style="width:100%; padding:0 16mm; font-family:Tahoma, Arial, sans-serif; color:#9b9181; font-size:8px;">
      <div style="border-top:1px solid #eee6d8; padding-top:5px; display:flex; justify-content:space-between; direction:rtl;">
        <span>TransPay Dashboard Documentation</span>
        <span>صفحة <span class="pageNumber"></span> من <span class="totalPages"></span></span>
      </div>
    </div>
  `,
});
await browser.close();

console.log(pdfPath);
