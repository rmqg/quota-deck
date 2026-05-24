# QuotaDeck

QuotaDeck is a small web dashboard for the two Codex CLI limits shown in the
TUI:

- `5h limit`
- `Weekly limit`

It reads the same source as Codex CLI by running `codex app-server` and calling
the JSON-RPC method `account/rateLimits/read`.

## Security Model

- Users register/login with local QuotaDeck accounts.
- Passwords are stored with `scrypt` hashes.
- Uploaded Codex `auth.json` files are validated, encrypted with AES-256-GCM,
  and stored as encrypted blobs.
- During refresh, QuotaDeck decrypts one credential into a temporary
  `CODEX_HOME`, runs Codex, then deletes the temporary directory.
- There is only one user type. Every registered user can only access their own
  imported Codex accounts.
- Mutating API requests check the request origin, and auth/import endpoints have
  simple in-memory rate limits.
- Open registration is disabled by default. Set `ALLOW_REGISTRATION=1` only if
  you intentionally want anyone with the URL to create an account.
- Account identity extracted from Codex is stored encrypted-side metadata but is
  not returned to the browser.

Keep `APP_SECRET` stable and private. If it changes, existing encrypted Codex
credentials cannot be decrypted.

## Current Login Import

OpenAI does not currently expose a clean public OAuth flow for third-party apps
to obtain the Codex/ChatGPT CLI login state. The practical import path is:

1. Login locally with Codex CLI.
2. Upload your local Codex auth file in QuotaDeck:

```txt
${CODEX_HOME:-$HOME/.codex}/auth.json
```

For a public deployment, users should only upload this file to a server they
trust and should rotate/revoke their Codex login if that trust changes.

## Run Locally

```bash
APP_SECRET='dev-secret-change-me' \
ALLOW_REGISTRATION=1 \
npm start
```

Open:

```txt
http://127.0.0.1:8787
```

## Run With Docker

```bash
cp .env.example .env
docker compose up -d --build
```

Example `.env`:

```env
DOMAIN=quota.example.com
APP_SECRET=replace-with-a-long-random-secret
ALLOW_REGISTRATION=1
```

After creating your own account, set `ALLOW_REGISTRATION=0` and restart if you
want to close public signup.

The compose stack includes:

- `quota-deck`: Node app with Codex CLI installed
- `quota-deck-proxy`: Caddy reverse proxy with automatic HTTPS

## Notes

- This monitors ChatGPT/Codex login limits, not OpenAI API billing usage.
- Claude Pro is not covered by this Codex RPC.
- Data files are JSON for now, suitable for small self-hosted deployments.
