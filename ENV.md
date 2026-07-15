# Environment Variables

## Required for production email delivery

### `WEB3FORMS_KEY`

The quote form (`/quote`) and newsletter signup (`/newsletter`) post to `/api/lead` and `/api/newsletter` respectively. Both API routes forward submissions to [Web3Forms](https://web3forms.com) when `WEB3FORMS_KEY` is set. Without it, submissions succeed silently and log to the server console for local development.

**How to get one:**

1. Visit https://web3forms.com
2. Enter the destination email address (use `hello@mydockguide.com` or wherever leads should land)
3. Web3Forms emails you an access key immediately
4. Copy it

**Where to set it in Vercel:**

1. Vercel dashboard → **dock-builder → Settings → Environment Variables**
2. Add:
   - Key: `WEB3FORMS_KEY`
   - Value: (paste from step 4 above)
   - Environments: **Production**, **Preview**, and **Development** (all three)
3. Save
4. Redeploy: `vercel --prod` (env changes require a fresh deploy)

**Local development:**

Create `.env.local` in the project root (gitignored):

```
WEB3FORMS_KEY=your-key-here
```

Restart `npm run dev` after adding it.

**Verify it works:**

Submit the form at https://www.mydockguide.com/quote. The email should land at `hello@mydockguide.com` within a minute. Also check the Vercel function logs for `/api/lead` — a successful forward logs no error; a failure logs the reason.

---

## Optional (later)

When we migrate to a real ESP (Beehiiv or ConvertKit) for the newsletter, we'll add:

- `BEEHIIV_API_KEY` or `CONVERTKIT_API_KEY`
- `BEEHIIV_PUBLICATION_ID` or `CONVERTKIT_FORM_ID`

The `/api/newsletter` route already isolates the delivery logic in one place, so switching providers is a single-file change.

---

## Never commit

- `.env`, `.env.local`, or any file containing secret keys
- All are covered by `.gitignore`
