Textflow is a local customer message generator based on the supplied prototype.

Run `npm run dev`, then open http://localhost:3000. For production, run `npm run build` followed by `npm start`.

The app preserves the prototype's responsive design, CSV import, English/Spanish/Catalan variants, singular/plural forms, live recipient preview, clipboard copy, and ZIP export. Create templates with **New template**. Every edit saves immediately to this browser's localStorage. **Back up templates** downloads a JSON library; **Restore backup** validates and replaces it after confirmation. Storage is specific to the browser profile and origin (including port); clearing site data removes templates. Customer lists are held in memory only.

CSV headers: `customer_email,customer_name,language,genre`. Languages: `en`, `es`, `ca`. Forms: `singular`, `plural`. Comma, semicolon, and tab delimiters, UTF-8 BOM, quoted fields, and multiline values are supported. Invalid customer records are reported and skipped; malformed CSV imports leave the current customer list intact. An example is available at `/sample-customers.csv`.

**Save to folder** (Chrome/Edge on localhost) asks for a destination and creates a unique batch directory containing `customer_email/template-id.txt`. **Download ZIP** exports the same customer directory structure. Unsafe filename characters are replaced; repeated email addresses receive numbered messages. Existing batches are not overwritten. Empty required variants block export. All processing and file generation happen on your device.

Implementation: the lightweight app lives in `public/textflow.html`, `public/textflow.css`, and `public/textflow.js`. Next.js serves it at `/` using a rewrite, without remote services or additional runtime dependencies. Run `node scripts/check-workflows.cjs` for workflow checks and `npx tsc --noEmit` for TypeScript checks.

Original scaffold notes follow.
Templates support `**bold text**` and `[link text](https://example.com)`. The preview renders formatting safely. **Copy for Gmail** writes HTML and plain text to the clipboard; paste normally into a Gmail compose window with Plain text mode turned off. **Export formatted HTML instead of TXT** saves formatted `.html` messages using the existing customer folders, for both folder and ZIP exports. Browser clipboard permission is required; if unavailable, select and copy the rendered preview manually. Gmail paste behavior has not been tested against a signed-in Gmail session.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
