# QuotaDeck

**Languages**: [简体中文](../README.md) | [繁體中文](README.zh-Hant.md) | English | [日本語](README.ja.md)

QuotaDeck is a self-hosted web dashboard for viewing the two limits shown in the OpenAI Codex CLI TUI:

- `5h limit`
- `Weekly limit`

It runs `codex app-server --listen stdio://` and calls the JSON-RPC method `account/rateLimits/read` to read the same limit data.

## Who It Is For

Good fit:

- You have multiple Codex / ChatGPT login accounts and want one place to view their limits.
- You want to deploy it on your own VPS.
- You want Docker-managed services without polluting the host environment.
- You want each user to register locally and upload their own Codex login file.

Not a good fit:

- Monitoring OpenAI API billing or API token usage.
- Monitoring Claude Pro limits.
- Storing Codex login state on a server you do not trust.

## Security Model

QuotaDeck handles sensitive Codex login files. Understand these rules before using it:

- Local QuotaDeck accounts are stored in the local data directory.
- Passwords are stored as `scrypt` hashes. Plaintext passwords are never stored.
- Uploaded Codex `auth.json` files are validated, then encrypted with AES-256-GCM using a key derived from `APP_SECRET`.
- When refreshing limits, the server temporarily decrypts one account credential into a temporary `CODEX_HOME` under `/tmp`, calls Codex CLI, then immediately removes the temporary directory.
- Browser APIs do not return access tokens, refresh tokens, or ID tokens.
- Every imported account belongs to a QuotaDeck user. Users can only see accounts they imported.
- There is no administrator role. There is only one user role.
- Registration is controlled by `ALLOW_REGISTRATION`.

Important limits:

- Once you upload `auth.json` to a server, you must trust that server and its administrator.
- `APP_SECRET` must stay stable. If you change it, old encrypted credentials cannot be decrypted.
- If you stop trusting a server, log in to Codex again or rotate your ChatGPT/Codex login state so old credentials become invalid.

## Quick Start

Docker is recommended.

```bash
cp .env.example .env
```

Edit `.env`:

```env
DOMAIN=quota.example.com
APP_SECRET=replace-with-a-long-random-secret
ALLOW_REGISTRATION=1
```

Example command for generating a strong `APP_SECRET`:

```bash
openssl rand -base64 48
```

Start the service:

```bash
docker compose up -d --build
```

Open:

```txt
https://quota.example.com
```

For local testing, you can also run Node directly:

```bash
APP_SECRET='dev-secret-change-me' \
ALLOW_REGISTRATION=1 \
npm start
```

Local URL:

```txt
http://127.0.0.1:8787
```

## VPS Deployment

Requirements:

- A VPS with Docker and Docker Compose installed.
- A domain with an A record pointing to the VPS IP.
- Ports 80 and 443 open on the VPS.

Deploy:

```bash
git clone https://github.com/rmqg/quota-deck.git /srv/quota-deck
cd /srv/quota-deck
cp .env.example .env
nano .env
docker compose up -d --build
```

Example `.env`:

```env
DOMAIN=quota.example.com
APP_SECRET=use-a-long-random-secret-here
ALLOW_REGISTRATION=1
```

`DOMAIN` must be your real domain. Caddy uses it to request an HTTPS certificate automatically.

After creating your own account, you should disable public registration:

```bash
cd /srv/quota-deck
sed -i 's/^ALLOW_REGISTRATION=.*/ALLOW_REGISTRATION=0/' .env
docker compose up -d
```

## How To Get Codex auth.json

On a computer where Codex CLI is already logged in, look for:

```txt
${CODEX_HOME:-$HOME/.codex}/auth.json
```

Common paths:

- Linux/macOS default path: `~/.codex/auth.json`
- If you set `CODEX_HOME`, use `$CODEX_HOME/auth.json`

You can confirm with:

```bash
ls -l "${CODEX_HOME:-$HOME/.codex}/auth.json"
```

Import steps:

1. Open QuotaDeck.
2. Register or log in to a local QuotaDeck account.
3. Enter a recognizable name in "Account Name", for example `OpenAI Business`.
4. Select the local `auth.json`.
5. Click "Import".
6. Refresh after import.

Do not send `auth.json` to public chats, issues, forums, or servers you do not trust.

## How To Use The Page

Top buttons:

- "Refresh": refresh all accounts for the current user.
- "Logout": log out of the local QuotaDeck account.

Account card buttons:

- `↻`: refresh only this account.
- `×`: delete this account configuration. QuotaDeck asks for confirmation first. This does not affect Codex / ChatGPT itself.

Status numbers:

- "Accounts": number of imported accounts.
- "Healthy": number of accounts that succeeded in the latest refresh.
- "Updated": time returned by the latest refresh.

Limit bars:

- `5h limit`: the `5h limit` shown in the Codex CLI TUI.
- `Weekly limit`: the `Weekly limit` shown in the Codex CLI TUI.
- When a limit shows `100%` remaining, the page hides the rolling-window reset timestamp returned by Codex. Below `100%`, it shows the reset time.
- Only the `5h limit` displays `1%` used or less as `100%` remaining to match the native TUI behavior. `Weekly limit` displays Codex's returned value.

## Updates, Backups, And Restore

Update:

```bash
cd /srv/quota-deck
git pull
docker compose up -d --build
```

Back up:

```bash
cd /srv/quota-deck
tar -czf quota-deck-backup-$(date +%Y%m%d-%H%M%S).tar.gz .env data
```

Restore:

```bash
cd /srv/quota-deck
tar -xzf quota-deck-backup-YYYYMMDD-HHMMSS.tar.gz
docker compose up -d
```

Note: if `APP_SECRET` in `.env` is lost, old Codex credentials cannot be decrypted even if `data/accounts.json` still exists.

## FAQ

### One Account Shows 401 Unauthorized

This usually means the uploaded Codex login state has expired.

Fix:

1. Log in to Codex CLI again on your local machine.
2. Upload the new `auth.json`.
3. Delete the old account configuration.

### Certificate Request Fails

Check:

- Whether the domain A record points to the VPS IP.
- Whether ports 80 and 443 are open on the VPS.
- Whether host nginx/apache is already using 80/443.
- Whether `DOMAIN` in `.env` is correct.

View Caddy logs:

```bash
docker compose logs -f quota-deck-proxy
```

### Accounts Cannot Refresh After Changing APP_SECRET

This is expected. Old credentials were encrypted with the old `APP_SECRET`.

Fix:

1. Restore the old `APP_SECRET`; or
2. Delete old accounts and upload `auth.json` again.

### Using Cloudflare Or Another CDN

Do not cache `/api/*`. Limit data and login state are dynamic, and cached API responses can make the page show stale data.

## Development Commands

Syntax checks:

```bash
node --check server.js
node --check public/app.js
```

Development mode:

```bash
APP_SECRET='dev-secret-change-me' ALLOW_REGISTRATION=1 npm run dev
```

Docker build:

```bash
docker compose up -d --build
```

## License

This project uses `GPL-3.0-or-later`. See [LICENSE](../LICENSE) for the full license text.

## Disclaimer

QuotaDeck is an unofficial project and does not represent OpenAI or Anthropic. It depends on the currently available local login state and RPC behavior of Codex CLI. If Codex CLI or ChatGPT backend interfaces change, the project may need updates.
