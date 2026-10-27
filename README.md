# LipaFast

A financial gateway for Ugandan micro-exporters to receive international payments and settle locally via Mobile Money.

## Key Features
- **Global Payment Link:** Unique URLs for businesses (e.g., `lipafast.ug/business-name`).
- **KYC Verification:** Built-in identity verification workflow.
- **Mobile Money Integration:** Ready for integration with local networks (MTN/Airtel).

## Development Setup
This project uses `next.js` and `supabase`.

### Environment Variables
Create a `.env` file based on `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `KYC_API_KEY`: API key for your KYC provider.
- `USE_MOCK_APIS`: Set to `false` to enable real service integration.

### Vercel Deployment
This repo is configured for Vercel deployment with the Next.js framework.

1. Push this repo to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Keep the default settings:
   - Framework Preset: Next.js
   - Root Directory: `.`
   - Build Command: `npm run build`
4. Add the same environment variables from `.env.example` in the Vercel project settings.
5. Deploy.

## Development Status
This is an MVP implementation. The following integrations currently use mock services:
- **Supabase:** Database connection is stubbed in `app/api/kyc/register/route.ts`.
- **KYC Provider:** Identity verification logic is stubbed in `lib/kyc/verify.ts`.
