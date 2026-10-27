Textflow is a local customer message generator based on the supplied prototype.

Run `npm run dev`, then open http://localhost:3000. For production, run `npm run build` followed by `npm start`.

The app preserves the prototype's responsive design, CSV import, English/Spanish/Catalan variants, singular/plural forms, live recipient preview, clipboard copy, and ZIP export. Create templates with **New template**. Every edit saves immediately to this browser's localStorage. **Back up templates** downloads a JSON library; **Restore backup** validates and replaces it after confirmation. Storage is specific to the browser profile and origin (including port); clearing site data removes templates. Customer lists are held in memory only.

CSV headers: `customer_email,customer_name,language,genre,location` (`location` is optional and fills `{{location}}` in templates). Languages: `en`, `es`, `ca`. Forms: `singular`, `plural`. Comma, semicolon, and tab delimiters, UTF-8 BOM, quoted fields, and multiline values are supported. Invalid customer records are reported and skipped; malformed CSV imports leave the current customer list intact. An example is available at `/sample-customers.csv`.

**Save to folder** (Chrome/Edge on localhost) asks for a destination and creates a unique batch directory containing `customer_email/template-id.txt`. **Download ZIP** exports the same customer directory structure. Unsafe filename characters are replaced; repeated email addresses receive numbered messages. Existing batches are not overwritten. Empty required variants block export. All processing and file generation happen on your device.

Implementation: Next.js 16 App Router renders the application at `/`. `app/page.tsx` is the server entry point; `components/Textflow.jsx` owns React state, event handlers, browser storage, clipboard access, and file generation. Pure CSV, backup validation, formatting, and ZIP utilities live in `lib/textflow-core.js`. Page sections are split into recipients, templates, preview, export, header, intro, footer, and toast components under `components/`. Styles are imported through the root layout from `app/globals.css`. The legacy `/textflow.html` URL permanently redirects to `/`.

Saved templates use the existing `textflow.templates.v1` storage key, so libraries remain available on the same origin. Browser storage loads after hydration; edits write only after an explicit user action, preserving stored data when loading fails. No customer data is sent to a server.

Templates support `**bold text**` and `[link text](https://example.com)`. The preview escapes input and renders supported formatting. **Copy for Gmail** writes HTML and plain text to the clipboard. **Export formatted HTML instead of TXT** exports HTML through both folder and ZIP workflows. Browser clipboard support and permission are required; manually copying the preview is the fallback.

Validation: `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `node scripts/check-workflows.mjs`.

Each language/form variant also has an optional subject supporting the same variables as the body. Subjects save with templates and are included in exports when filled in. Older version 1 backups restore with blank subjects; new backups preserve subjects alongside the original text variants. The preview offers separate Copy email and Copy subject buttons, with Mark as sent beside the recipient arrows.
