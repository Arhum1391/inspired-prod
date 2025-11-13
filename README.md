This project is built with [Next.js](https://nextjs.org) and integrates multiple third-party services (Stripe, Calendly, Binance).

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an `.env.local` file in the project root and configure the required environment variables (see below).

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Required Environment Variables

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | Connection string for the primary MongoDB database. |
| `JWT_SECRET` | Secret used to sign user JWTs. |

### Binance Portfolio Integration

Binance API credentials are stored encrypted at rest. Configure the following before enabling the portfolio sync flow:

| Variable | Description |
| --- | --- |
| `BINANCE_CREDENTIALS_ENCRYPTION_KEY` | 32-byte key (base64, hex, or 32-char UTF-8) used for AES-256-GCM encryption of Binance API keys. |
| `BINANCE_API_BASE_URL` (optional) | Overrides the default Binance REST base (e.g. `https://testnet.binance.vision`). |
| `BINANCE_USE_TESTNET_DEFAULT` (optional) | When set to `true`, new credential entries default to the Binance testnet. |

You can generate a secure base64 key with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Store API keys server-side only; they should never be exposed to the browser.

## Development Notes

- The app uses the Next.js App Router (`src/app`).
- MongoDB helpers live in `src/lib/mongodb.ts`.
- Binance credential encryption utilities live in `src/lib/crypto.ts` and `src/lib/binanceCredentials.ts`.
- Run `npm run lint` to check for linting errors.
