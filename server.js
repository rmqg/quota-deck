import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const dataDir = process.env.DATA_DIR || path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");
const accountsFile = path.join(dataDir, "accounts.json");
const sessionsFile = path.join(dataDir, "sessions.json");
const port = Number(process.env.PORT || 8787);
const refreshTimeoutMs = Number(process.env.REFRESH_TIMEOUT_MS || 25000);
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;
const appSecret = process.env.APP_SECRET || "dev-secret-change-me";
const allowRegistration = process.env.ALLOW_REGISTRATION === "1";
const claudeUsageUrl = process.env.CLAUDE_USAGE_URL || "https://api.anthropic.com/api/oauth/usage";
const defaultClaudeTokenUrl = "https://platform.claude.com/v1/oauth/token";
const deprecatedClaudeTokenUrl = "https://console.anthropic.com/v1/oauth/token";
const claudeTokenUrls = resolveClaudeTokenUrls(
  process.env.CLAUDE_OAUTH_TOKEN_URLS || process.env.CLAUDE_OAUTH_TOKEN_URL,
);
const claudeClientId = process.env.CLAUDE_OAUTH_CLIENT_ID || "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
const claudeUserAgent = process.env.CLAUDE_USER_AGENT || "claude-code/2.0.0";
const claudeBeta = process.env.CLAUDE_OAUTH_BETA || "oauth-2025-04-20";
const httpTimeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000);
const backgroundRefreshEnabled = process.env.BACKGROUND_REFRESH !== "0";
const barkDefaultServer = process.env.BARK_DEFAULT_SERVER || "https://api.day.app";
const rateBuckets = new Map();

function resolveClaudeTokenUrls(configured) {
  const urls = String(configured || defaultClaudeTokenUrl)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const unique = [...new Set(urls)];
  if (unique.includes(deprecatedClaudeTokenUrl) && !unique.includes(defaultClaudeTokenUrl)) {
    unique.push(defaultClaudeTokenUrl);
  }
  return unique.length ? unique : [defaultClaudeTokenUrl];
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) {
      rateBuckets.delete(key);
    }
  }
}, 60_000).unref();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function json(res, status, body, headers = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
    "cdn-cache-control": "no-store",
    "cloudflare-cdn-cache-control": "no-store",
    pragma: "no-cache",
    expires: "0",
    "x-content-type-options": "nosniff",
    "referrer-policy": "same-origin",
    ...headers,
  });
  res.end(payload);
}

function text(res, status, body) {
  res.writeHead(status, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
    "cdn-cache-control": "no-store",
    "cloudflare-cdn-cache-control": "no-store",
    pragma: "no-cache",
    expires: "0",
    "x-content-type-options": "nosniff",
    "referrer-policy": "same-origin",
  });
  res.end(body);
}

function safeCompare(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) {
    return true;
  }
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function checkOrigin(req, res) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method || "")) {
    return true;
  }
  if (sameOrigin(req)) {
    return true;
  }
  json(res, 403, { error: "Invalid request origin" });
  return false;
}

function checkRate(req, res, key, limit, windowMs) {
  const now = Date.now();
  const bucketKey = `${key}:${clientIp(req)}`;
  const current = rateBuckets.get(bucketKey);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return true;
  }
  current.count += 1;
  if (current.count <= limit) {
    return true;
  }
  json(res, 429, { error: "Too many requests" });
  return false;
}

function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

function verifyPassword(password, encoded) {
  const [scheme, saltText, hashText] = String(encoded || "").split("$");
  if (scheme !== "scrypt" || !saltText || !hashText) {
    return false;
  }
  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(hashText, "base64url");
  const actual = scryptSync(password, salt, expected.length, { N: 16384, r: 8, p: 1 });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function secretKey() {
  return createHash("sha256").update(appSecret).digest();
}

function encryptJson(value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secretKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    "v1",
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

function decryptJson(encoded) {
  const [version, ivText, tagText, ciphertextText] = String(encoded || "").split(".");
  if (version !== "v1") {
    throw new Error("Unsupported encrypted credential version");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    secretKey(),
    Buffer.from(ivText, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextText, "base64url")),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString("utf8"));
}

function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("base64url");
}

async function ensureJsonFile(file, fallback) {
  await mkdir(dataDir, { recursive: true });
  try {
    await stat(file);
  } catch {
    await writeFile(file, `${JSON.stringify(fallback, null, 2)}\n`, { mode: 0o600 });
  }
}

async function loadJson(file, fallback) {
  await ensureJsonFile(file, fallback);
  const raw = await readFile(file, "utf8");
  const parsed = JSON.parse(raw || JSON.stringify(fallback));
  return Array.isArray(fallback) && !Array.isArray(parsed) ? fallback : parsed;
}

async function saveJson(file, value) {
  await ensureJsonFile(file, Array.isArray(value) ? [] : {});
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}

const loadUsers = () => loadJson(usersFile, []);
const saveUsers = (users) => saveJson(usersFile, users);
const loadAccounts = () => loadJson(accountsFile, []);
const saveAccounts = (accounts) => saveJson(accountsFile, accounts);
const loadSessions = () => loadJson(sessionsFile, []);
const saveSessions = (sessions) => saveJson(sessionsFile, sessions);

let accountsWriteChain = Promise.resolve();

function withAccountsLock(task) {
  const run = accountsWriteChain.then(task, task);
  accountsWriteChain = run.then(
    () => {},
    () => {},
  );
  return run;
}

function persistAccountAuth(accountId, userId, auth, email) {
  return withAccountsLock(async () => {
    const accounts = await loadAccounts();
    const account = accounts.find((item) => item.id === accountId && item.userId === userId);
    if (!account) {
      return;
    }
    account.encryptedAuth = encryptJson(auth);
    if (email && !account.email) {
      account.email = email;
    }
    await saveAccounts(accounts);
  });
}

function persistBarkState(accountId, userId, barkState) {
  return withAccountsLock(async () => {
    const accounts = await loadAccounts();
    const account = accounts.find((item) => item.id === accountId && item.userId === userId);
    if (!account) {
      return;
    }
    account.barkState = barkState;
    await saveAccounts(accounts);
  });
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function validateUsername(username) {
  if (!/^[a-z0-9][a-z0-9_-]{2,31}$/.test(username)) {
    throw new Error("Username must be 3-32 characters: lowercase letters, numbers, _ or -");
  }
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 10) {
    throw new Error("Password must be at least 10 characters");
  }
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
}

function publicAccount(account) {
  return {
    id: account.id,
    provider: account.provider,
    name: account.name,
    email: normalizeEmail(account.email) || normalizeEmail(account.identity),
    createdAt: account.createdAt,
  };
}

async function createUser(usernameInput, password) {
  const username = normalizeUsername(usernameInput);
  validateUsername(username);
  validatePassword(password);

  const users = await loadUsers();
  if (users.some((user) => user.username === username)) {
    throw new Error("Username is already registered");
  }

  const user = {
    id: randomUUID(),
    username,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await saveUsers(users);
  return user;
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const cookies = {};
  for (const part of header.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (!name) {
      continue;
    }
    cookies[name] = decodeURIComponent(valueParts.join("="));
  }
  return cookies;
}

function isHttps(req) {
  return req.headers["x-forwarded-proto"] === "https" || req.socket.encrypted;
}

function sessionCookie(token, req) {
  const secure = isHttps(req) ? "; Secure" : "";
  return `qd_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAgeSeconds}${secure}`;
}

function clearSessionCookie(req) {
  const secure = isHttps(req) ? "; Secure" : "";
  return `qd_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}

async function createSession(userId, req, res) {
  const token = randomBytes(32).toString("base64url");
  const sessions = (await loadSessions()).filter(
    (session) => new Date(session.expiresAt).getTime() > Date.now(),
  );
  sessions.push({
    id: randomUUID(),
    tokenHash: hashSessionToken(token),
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + sessionMaxAgeSeconds * 1000).toISOString(),
  });
  await saveSessions(sessions);
  res.setHeader("set-cookie", sessionCookie(token, req));
}

async function getCurrentUser(req) {
  const token = parseCookies(req).qd_session;
  if (!token) {
    return null;
  }
  const tokenHash = hashSessionToken(token);
  const sessions = await loadSessions();
  const session = sessions.find(
    (item) => item.tokenHash === tokenHash && new Date(item.expiresAt).getTime() > Date.now(),
  );
  if (!session) {
    return null;
  }
  const users = await loadUsers();
  return users.find((user) => user.id === session.userId) || null;
}

async function requireUser(req, res) {
  const user = await getCurrentUser(req);
  if (!user) {
    json(res, 401, { error: "Authentication required" });
    return null;
  }
  return user;
}

function readBearerToken(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (match) {
    return match[1].trim();
  }
  const apiKey = req.headers["x-api-key"];
  return apiKey ? String(apiKey).trim() : "";
}

// Read-only API token for headless clients (e.g. the tmux status bar). The
// token maps to a single configured user and is only honoured for GET requests;
// all mutations stay cookie-only.
async function getApiTokenUser(req) {
  const configured = process.env.READ_API_TOKEN || "";
  const username = normalizeUsername(process.env.READ_API_USERNAME || "");
  if (!configured || !username) {
    return null;
  }
  const provided = readBearerToken(req);
  if (!provided) {
    return null;
  }
  const a = Buffer.from(provided);
  const b = Buffer.from(configured);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }
  const users = await loadUsers();
  return users.find((user) => user.username === username) || null;
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 512 * 1024) {
      throw new Error("Request body too large");
    }
    chunks.push(chunk);
  }
  if (!chunks.length) {
    return {};
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function validateAuthJson(input) {
  const auth = typeof input === "string" ? JSON.parse(input) : input;
  if (!auth || typeof auth !== "object" || Array.isArray(auth)) {
    throw new Error("auth.json must contain a JSON object");
  }
  if (auth.auth_mode !== "chatgpt") {
    throw new Error("Only ChatGPT/Codex auth.json files are supported");
  }
  const tokens = auth.tokens;
  const required = ["access_token", "refresh_token", "id_token", "account_id"];
  for (const key of required) {
    if (!tokens || typeof tokens[key] !== "string" || !tokens[key]) {
      throw new Error(`auth.json is missing tokens.${key}`);
    }
  }
  return auth;
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    return payload ? JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) : {};
  } catch {
    return {};
  }
}

function normalizeEmail(value) {
  const email = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function identityFromAuth(auth) {
  const payload = decodeJwtPayload(auth.tokens.id_token);
  return normalizeEmail(payload.email) || payload.name || auth.tokens.account_id || null;
}

function emailFromAuth(auth) {
  const payload = decodeJwtPayload(auth.tokens.id_token);
  return normalizeEmail(payload.email);
}

async function createAccountFromAuth(user, input) {
  const auth = validateAuthJson(input.authJson);
  const identity = identityFromAuth(auth);
  const email = emailFromAuth(auth);
  const name = String(input.name || identity || "Codex Account").trim();
  if (!name) {
    throw new Error("Account name is required");
  }

  const account = {
    id: randomUUID(),
    userId: user.id,
    provider: "codex",
    name,
    email,
    identity,
    encryptedAuth: encryptJson(auth),
    createdAt: new Date().toISOString(),
  };
  const accounts = await loadAccounts();
  accounts.push(account);
  await saveAccounts(accounts);
  return account;
}

async function withTemporaryCodexHome(account, callback) {
  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), "quota-deck-codex-"));
  try {
    await chmod(tmpRoot, 0o700);
    const auth = decryptJson(account.encryptedAuth);
    await writeFile(path.join(tmpRoot, "auth.json"), `${JSON.stringify(auth)}\n`, { mode: 0o600 });
    return await callback(tmpRoot);
  } finally {
    await rm(tmpRoot, { recursive: true, force: true });
  }
}

function requestCodexRateLimits(codexHome) {
  return new Promise((resolve, reject) => {
    const child = spawn("codex", ["app-server", "--listen", "stdio://"], {
      env: {
        ...process.env,
        CODEX_HOME: codexHome,
      },
      stdio: ["pipe", "pipe", "pipe"],
    });

    let buffer = "";
    let stderr = "";
    let settled = false;

    const timeout = setTimeout(() => {
      finish(new Error(`Timed out after ${refreshTimeoutMs}ms`));
    }, refreshTimeoutMs);

    function finish(error, result) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      if (!child.killed) {
        child.kill("SIGTERM");
      }
      error ? reject(error) : resolve(result);
    }

    function send(message) {
      try {
        child.stdin.write(`${JSON.stringify(message)}\n`);
      } catch (error) {
        finish(error);
      }
    }

    child.on("error", (error) => finish(error));
    child.stdin.on("error", (error) => finish(error));
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 4000) {
        stderr = stderr.slice(-4000);
      }
    });

    child.stdout.on("data", (chunk) => {
      buffer += chunk.toString();
      for (;;) {
        const newline = buffer.indexOf("\n");
        if (newline < 0) {
          break;
        }

        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) {
          continue;
        }

        let message;
        try {
          message = JSON.parse(line);
        } catch (error) {
          finish(new Error(`Invalid Codex JSON-RPC response: ${error.message}`));
          return;
        }

        if (message.id === "init") {
          send({ id: "limits", method: "account/rateLimits/read", params: null });
          continue;
        }

        if (message.id === "limits") {
          message.error
            ? finish(new Error(message.error.message || "Codex rate-limit read failed"))
            : finish(null, message.result);
          return;
        }
      }
    });

    child.on("exit", (code) => {
      if (!settled && code !== 0) {
        finish(new Error(stderr.trim() || `codex app-server exited with status ${code}`));
      }
    });

    send({
      id: "init",
      method: "initialize",
      params: {
        clientInfo: { name: "quota-deck", version: "0.2.0" },
        capabilities: { experimentalApi: true },
      },
    });
  });
}

function validateClaudeCredentials(input) {
  const parsed = typeof input === "string" ? JSON.parse(input) : input;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("credentials.json must contain a JSON object");
  }
  const oauth = parsed.claudeAiOauth && typeof parsed.claudeAiOauth === "object"
    ? parsed.claudeAiOauth
    : parsed;
  for (const key of ["accessToken", "refreshToken"]) {
    if (typeof oauth[key] !== "string" || !oauth[key]) {
      throw new Error(`credentials.json is missing claudeAiOauth.${key}`);
    }
  }
  const expiresAt = Number(oauth.expiresAt);
  return {
    accessToken: oauth.accessToken,
    refreshToken: oauth.refreshToken,
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : 0,
    scopes: Array.isArray(oauth.scopes) ? oauth.scopes : [],
    subscriptionType: typeof oauth.subscriptionType === "string" ? oauth.subscriptionType : null,
  };
}

async function createAccountFromClaude(user, input) {
  const credentials = validateClaudeCredentials(input.credentialsJson);
  const name = String(input.name || "Claude Account").trim();
  if (!name) {
    throw new Error("Account name is required");
  }

  // Refresh once on import to validate the credentials and capture the account
  // email (only the token endpoint returns it), then store the rotated tokens.
  let stored = credentials;
  let email = normalizeEmail(input.email);
  try {
    stored = await refreshClaudeToken(credentials);
    email = email || normalizeEmail(stored.email);
  } catch {
    // Keep the uploaded credentials; email stays unknown until a later refresh.
  }

  const account = {
    id: randomUUID(),
    userId: user.id,
    provider: "claude",
    name,
    email: email || null,
    identity: null,
    encryptedAuth: encryptJson(stored),
    createdAt: new Date().toISOString(),
  };
  const accounts = await loadAccounts();
  accounts.push(account);
  await saveAccounts(accounts);
  return account;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), httpTimeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function refreshClaudeToken(credentials) {
  let lastError = null;
  for (let index = 0; index < claudeTokenUrls.length; index += 1) {
    const tokenUrl = claudeTokenUrls[index];
    const response = await fetchWithTimeout(tokenUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": claudeUserAgent,
        "anthropic-beta": claudeBeta,
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: credentials.refreshToken,
        client_id: claudeClientId,
      }),
    });
    if (!response.ok) {
      const detail = (await response.text().catch(() => "")).slice(0, 200);
      lastError = new Error(`Claude token refresh failed (HTTP ${response.status})${detail ? `: ${detail}` : ""}`);
      if (response.status === 404 && index < claudeTokenUrls.length - 1) {
        continue;
      }
      throw lastError;
    }
    const body = await response.json();
    if (!body.access_token) {
      throw new Error("Claude token refresh returned no access_token");
    }
    return {
      ...credentials,
      accessToken: body.access_token,
      refreshToken: body.refresh_token || credentials.refreshToken,
      expiresAt: body.expires_in ? Date.now() + Number(body.expires_in) * 1000 : 0,
      email: normalizeEmail(body.account?.email_address) || credentials.email || null,
    };
  }
  throw lastError || new Error("Claude token refresh failed: no token endpoints configured");
}

// Claude uses rotating refresh tokens: each refresh consumes the current
// refresh token and invalidates it. Multiple concurrent callers (background
// tick, /api/limits, manual refresh) each load their own account copy, so
// without coordination two refreshes can race on the same token — one wins,
// the loser persists a now-invalid chain and the account loses its auth.
// Serialize per account and always read the freshest persisted credentials.
const claudeRefreshInFlight = new Map();

function syncAccountFromCredentials(account, credentials) {
  account.encryptedAuth = encryptJson(credentials);
  if (credentials.email && !account.email) {
    account.email = credentials.email;
  }
}

async function loadAccountAuth(accountId, userId) {
  const accounts = await loadAccounts();
  const account = accounts.find((item) => item.id === accountId && item.userId === userId);
  return account ? account.encryptedAuth : null;
}

async function resolveClaudeCredentials(account) {
  // Re-read the latest persisted token in case another worker already rotated
  // it while this account object was sitting stale.
  const encrypted = (await loadAccountAuth(account.id, account.userId)) || account.encryptedAuth;
  const credentials = decryptJson(encrypted);
  if (credentials.expiresAt && credentials.expiresAt > Date.now() + 60_000) {
    return credentials;
  }
  const refreshed = await refreshClaudeToken(credentials);
  await persistAccountAuth(account.id, account.userId, refreshed, refreshed.email);
  return refreshed;
}

async function ensureClaudeAccessToken(account) {
  const existing = claudeRefreshInFlight.get(account.id);
  if (existing) {
    const refreshed = await existing;
    syncAccountFromCredentials(account, refreshed);
    return refreshed;
  }
  // Register the in-flight promise synchronously (no await between get/set) so
  // concurrent callers for the same account dedupe onto a single refresh.
  const task = resolveClaudeCredentials(account);
  claudeRefreshInFlight.set(account.id, task);
  try {
    const refreshed = await task;
    syncAccountFromCredentials(account, refreshed);
    return refreshed;
  } finally {
    if (claudeRefreshInFlight.get(account.id) === task) {
      claudeRefreshInFlight.delete(account.id);
    }
  }
}

function claudeWindow(window, windowDurationMins) {
  if (!window || typeof window !== "object") {
    return null;
  }
  const used = Number(window.utilization);
  const resetsAt = window.resets_at ? Math.floor(Date.parse(window.resets_at) / 1000) : null;
  return {
    usedPercent: Number.isFinite(used) ? used : 0,
    windowDurationMins,
    resetsAt: Number.isFinite(resetsAt) ? resetsAt : null,
  };
}

function normalizeClaudeUsage(data) {
  const weekly = data.seven_day || data.seven_day_sonnet || data.seven_day_opus;
  return {
    planType: "claude",
    primary: claudeWindow(data.five_hour, 300),
    secondary: claudeWindow(weekly, 10080),
  };
}

async function requestClaudeUsage(account) {
  const credentials = await ensureClaudeAccessToken(account);
  const response = await fetchWithTimeout(claudeUsageUrl, {
    method: "GET",
    headers: {
      authorization: `Bearer ${credentials.accessToken}`,
      "content-type": "application/json",
      "user-agent": claudeUserAgent,
      "anthropic-beta": claudeBeta,
    },
  });
  if (response.status === 401) {
    throw new Error("Claude credentials are no longer valid (401). Re-export credentials.json.");
  }
  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 200);
    throw new Error(`Claude usage read failed (HTTP ${response.status})${detail ? `: ${detail}` : ""}`);
  }
  return normalizeClaudeUsage(await response.json());
}

function selectedSnapshot(result) {
  if (!result) {
    return null;
  }
  if (!result.rateLimitsByLimitId) {
    return result.rateLimits || null;
  }
  return (
    result.rateLimitsByLimitId.codex ||
    Object.values(result.rateLimitsByLimitId)[0] ||
    result.rateLimits
  );
}

async function refreshAccount(account) {
  const startedAt = Date.now();
  try {
    let rateLimits;
    let rateLimitsByLimitId = null;
    if (account.provider === "claude") {
      rateLimits = await requestClaudeUsage(account);
    } else {
      const result = await withTemporaryCodexHome(account, requestCodexRateLimits);
      rateLimits = result.rateLimits;
      rateLimitsByLimitId = result.rateLimitsByLimitId || null;
    }
    return {
      account: publicAccount(account),
      ok: true,
      refreshedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      rateLimits,
      rateLimitsByLimitId,
    };
  } catch (error) {
    return {
      account: publicAccount(account),
      ok: false,
      refreshedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      error: error.message,
    };
  }
}

const defaultBarkEvents = { low: true, exhausted: true, reset: true, error: true };

function publicBark(user) {
  const bark = user.bark || {};
  return {
    enabled: Boolean(bark.enabled),
    serverUrl: bark.serverUrl || barkDefaultServer,
    deviceKey: bark.deviceKey || "",
    threshold: Number.isFinite(Number(bark.threshold)) ? Number(bark.threshold) : 20,
    events: { ...defaultBarkEvents, ...(bark.events || {}) },
  };
}

function normalizeBarkInput(input) {
  const threshold = Math.round(Number(input.threshold));
  const events = input.events && typeof input.events === "object" ? input.events : {};
  return {
    enabled: Boolean(input.enabled),
    serverUrl: String(input.serverUrl || barkDefaultServer).trim().replace(/\/+$/, ""),
    deviceKey: String(input.deviceKey || "").trim(),
    threshold: Number.isFinite(threshold) ? Math.min(99, Math.max(1, threshold)) : 20,
    events: {
      low: events.low !== false,
      exhausted: events.exhausted !== false,
      reset: events.reset !== false,
      error: events.error !== false,
    },
  };
}

async function sendBark(bark, payload) {
  if (!bark || !bark.deviceKey) {
    throw new Error("Bark device key is not configured");
  }
  const base = String(bark.serverUrl || barkDefaultServer).replace(/\/+$/, "");
  const response = await fetchWithTimeout(`${base}/${encodeURIComponent(bark.deviceKey)}`, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      title: payload.title,
      body: payload.body,
      group: "QuotaDeck",
    }),
  });
  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 200);
    throw new Error(`Bark push failed (HTTP ${response.status})${detail ? `: ${detail}` : ""}`);
  }
}

function windowLevel(window, threshold) {
  if (!window) {
    return "ok";
  }
  const remaining = 100 - (Number(window.usedPercent) || 0);
  if (remaining <= 0) {
    return "empty";
  }
  if (remaining <= threshold) {
    return "low";
  }
  return "ok";
}

function windowRemaining(window) {
  return window ? Math.max(0, Math.round(100 - (Number(window.usedPercent) || 0))) : 0;
}

async function evaluateBark(user, account, result) {
  const bark = publicBark(user);
  const previous = account.barkState || {};
  // Carry quota levels forward so a failed refresh does not reset them and
  // re-trigger an "exhausted" alert on the next successful read. A level only
  // changes (and re-notifies) when a successful read reports a new state.
  const nextState = {
    error: !result.ok,
    fiveHour: previous.fiveHour || "ok",
    weekly: previous.weekly || "ok",
  };
  const messages = [];

  if (!result.ok) {
    if (bark.events.error && !previous.error) {
      messages.push({
        title: `⚠️ ${account.name} 刷新失败`,
        body: result.error || "未知错误",
      });
    }
  } else {
    const snapshot = selectedSnapshot(result);
    const windows = [
      ["fiveHour", snapshot?.primary, "5 小时额度"],
      ["weekly", snapshot?.secondary, "每周额度"],
    ];
    for (const [key, window, label] of windows) {
      const level = windowLevel(window, bark.threshold);
      nextState[key] = level;
      const old = previous[key] || "ok";
      if (level === old) {
        continue;
      }
      if (level === "empty" && bark.events.exhausted) {
        messages.push({ title: `🚫 ${account.name} ${label}已耗尽`, body: `${label} 已用尽` });
      } else if (level === "low" && old === "ok" && bark.events.low) {
        messages.push({
          title: `⏳ ${account.name} ${label}即将耗尽`,
          body: `${label} 仅剩 ${windowRemaining(window)}%`,
        });
      } else if (level === "ok" && (old === "low" || old === "empty") && bark.events.reset) {
        messages.push({
          title: `✅ ${account.name} ${label}已恢复`,
          body: `${label} 剩余 ${windowRemaining(window)}%`,
        });
      }
    }
  }

  const changed =
    previous.error !== nextState.error ||
    previous.fiveHour !== nextState.fiveHour ||
    previous.weekly !== nextState.weekly;
  if (changed) {
    await persistBarkState(account.id, account.userId, nextState);
  }
  for (const message of messages) {
    try {
      await sendBark(bark, message);
    } catch (error) {
      console.error("Bark push error:", error.message);
    }
  }
}

// Latest usage snapshot per account, kept fresh by the background refresh so
// browsers can display the most recent data without each one hitting upstream.
const latestResults = new Map();

async function refreshAndStore(account) {
  const result = await refreshAccount(account);
  latestResults.set(account.id, result);
  return result;
}

let backgroundRefreshRunning = false;

async function runBackgroundRefresh() {
  if (backgroundRefreshRunning) {
    return;
  }
  backgroundRefreshRunning = true;
  try {
    const accounts = await loadAccounts();
    const users = await loadUsers();
    const usersById = new Map(users.map((user) => [user.id, user]));
    for (const account of accounts) {
      const result = await refreshAndStore(account);
      const user = usersById.get(account.userId);
      if (user?.bark?.enabled && user.bark?.deviceKey) {
        await evaluateBark(user, account, result);
      }
    }
  } catch (error) {
    console.error("Background refresh error:", error.message);
  } finally {
    backgroundRefreshRunning = false;
  }
}

async function handleApi(req, res, url) {
  if (url.pathname === "/api/healthz" && req.method === "GET") {
    json(res, 200, { ok: true });
    return;
  }

  if (url.pathname === "/api/auth/me" && req.method === "GET") {
    const user = await getCurrentUser(req);
    json(res, 200, { user: user ? publicUser(user) : null, allowRegistration });
    return;
  }

  if (url.pathname === "/api/auth/register" && req.method === "POST") {
    if (!allowRegistration) {
      json(res, 403, { error: "Registration is disabled" });
      return;
    }
    if (!checkRate(req, res, "auth", 20, 15 * 60 * 1000)) return;
    const body = await readBody(req);
    const user = await createUser(body.username, body.password);
    await createSession(user.id, req, res);
    json(res, 201, { user: publicUser(user) });
    return;
  }

  if (url.pathname === "/api/auth/login" && req.method === "POST") {
    if (!checkRate(req, res, "auth", 20, 15 * 60 * 1000)) return;
    const body = await readBody(req);
    const username = normalizeUsername(body.username);
    const users = await loadUsers();
    const user = users.find((item) => item.username === username);
    if (!user || !verifyPassword(String(body.password || ""), user.passwordHash)) {
      json(res, 401, { error: "Invalid username or password" });
      return;
    }
    await createSession(user.id, req, res);
    json(res, 200, { user: publicUser(user) });
    return;
  }

  if (url.pathname === "/api/auth/logout" && req.method === "POST") {
    const token = parseCookies(req).qd_session;
    if (token) {
      const tokenHash = hashSessionToken(token);
      const sessions = (await loadSessions()).filter((session) => session.tokenHash !== tokenHash);
      await saveSessions(sessions);
    }
    json(res, 200, { ok: true }, { "set-cookie": clearSessionCookie(req) });
    return;
  }

  let user = await getCurrentUser(req);
  let viaToken = false;
  if (!user) {
    const tokenUser = await getApiTokenUser(req);
    if (tokenUser) {
      user = tokenUser;
      viaToken = true;
    }
  }
  if (!user) {
    json(res, 401, { error: "Authentication required" });
    return;
  }
  if (viaToken && req.method !== "GET") {
    json(res, 403, { error: "Read-only API token" });
    return;
  }

  if (url.pathname === "/api/accounts" && req.method === "GET") {
    const accounts = (await loadAccounts()).filter((account) => account.userId === user.id);
    json(res, 200, { accounts: accounts.map(publicAccount) });
    return;
  }

  if (url.pathname === "/api/accounts/import-auth" && req.method === "POST") {
    if (!checkRate(req, res, "import-auth", 20, 60 * 60 * 1000)) return;
    const body = await readBody(req);
    const account = await createAccountFromAuth(user, body);
    json(res, 201, { account: publicAccount(account) });
    return;
  }

  if (url.pathname === "/api/accounts/import-claude" && req.method === "POST") {
    if (!checkRate(req, res, "import-claude", 20, 60 * 60 * 1000)) return;
    const body = await readBody(req);
    const account = await createAccountFromClaude(user, body);
    json(res, 201, { account: publicAccount(account) });
    return;
  }

  if (url.pathname === "/api/settings/bark" && req.method === "GET") {
    json(res, 200, { bark: publicBark(user) });
    return;
  }

  if (url.pathname === "/api/settings/bark" && req.method === "PUT") {
    const body = await readBody(req);
    const bark = normalizeBarkInput(body);
    const users = await loadUsers();
    const stored = users.find((item) => item.id === user.id);
    if (!stored) {
      json(res, 404, { error: "User not found" });
      return;
    }
    stored.bark = bark;
    await saveUsers(users);
    json(res, 200, { bark: publicBark(stored) });
    return;
  }

  if (url.pathname === "/api/settings/bark/test" && req.method === "POST") {
    if (!checkRate(req, res, "bark-test", 10, 10 * 60 * 1000)) return;
    const body = await readBody(req);
    const bark = normalizeBarkInput(body);
    if (!bark.deviceKey) {
      json(res, 400, { error: "Bark device key is required" });
      return;
    }
    try {
      await sendBark(bark, { title: "QuotaDeck", body: "测试通知 / Test notification" });
    } catch (error) {
      json(res, 502, { error: error.message });
      return;
    }
    json(res, 200, { ok: true });
    return;
  }

  const accountMatch = url.pathname.match(/^\/api\/accounts\/([^/]+)$/);
  if (accountMatch && req.method === "DELETE") {
    const id = decodeURIComponent(accountMatch[1]);
    const accounts = await loadAccounts();
    const account = accounts.find((item) => item.id === id && item.userId === user.id);
    if (!account) {
      json(res, 404, { error: "Account not found" });
      return;
    }
    const remainingAccounts = accounts.filter(
      (item) => !(item.id === id && item.userId === user.id),
    );
    await saveAccounts(remainingAccounts);
    latestResults.delete(id);
    json(res, 200, {
      ok: true,
      deletedId: id,
      remaining: remainingAccounts.filter((item) => item.userId === user.id).length,
    });
    return;
  }

  if (url.pathname === "/api/limits" && req.method === "GET") {
    // Serve the background snapshot; lazily fetch any account not yet cached
    // (e.g. just imported, or right after a cold start).
    const accounts = (await loadAccounts()).filter((account) => account.userId === user.id);
    const missing = accounts.filter((account) => !latestResults.has(account.id));
    if (missing.length) {
      await Promise.all(missing.map(refreshAndStore));
    }
    const results = accounts.map((account) => latestResults.get(account.id)).filter(Boolean);
    json(res, 200, { results });
    return;
  }

  if (url.pathname === "/api/limits/refresh" && req.method === "POST") {
    const accounts = (await loadAccounts()).filter((account) => account.userId === user.id);
    const results = await Promise.all(accounts.map(refreshAndStore));
    json(res, 200, { results });
    return;
  }

  const limitMatch = url.pathname.match(/^\/api\/limits\/([^/]+)$/);
  if (limitMatch && req.method === "GET") {
    const id = decodeURIComponent(limitMatch[1]);
    const account = (await loadAccounts()).find(
      (item) => item.id === id && item.userId === user.id,
    );
    if (!account) {
      json(res, 404, { error: "Account not found" });
      return;
    }
    json(res, 200, await refreshAndStore(account));
    return;
  }

  const limitRefreshMatch = url.pathname.match(/^\/api\/limits\/([^/]+)\/refresh$/);
  if (limitRefreshMatch && req.method === "POST") {
    const id = decodeURIComponent(limitRefreshMatch[1]);
    const account = (await loadAccounts()).find(
      (item) => item.id === id && item.userId === user.id,
    );
    if (!account) {
      json(res, 404, { error: "Account not found" });
      return;
    }
    json(res, 200, await refreshAndStore(account));
    return;
  }

  json(res, 404, { error: "Not found" });
}

async function serveStatic(req, res, url) {
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const normalized = path.normalize(decodeURIComponent(requested)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, normalized);

  if (!filePath.startsWith(publicDir)) {
    text(res, 403, "Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      text(res, 404, "Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "content-type": mimeTypes[ext] || "application/octet-stream",
      "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
      "cdn-cache-control": "no-store",
      "cloudflare-cdn-cache-control": "no-store",
      pragma: "no-cache",
      expires: "0",
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin",
      "content-security-policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    });
    createReadStream(filePath).pipe(res);
  } catch {
    text(res, 404, "Not found");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      if (!checkOrigin(req, res)) {
        return;
      }
      await handleApi(req, res, url);
    } else {
      await serveStatic(req, res, url);
    }
  } catch (error) {
    json(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(port, () => {
  const secretState = process.env.APP_SECRET ? "APP_SECRET configured" : "dev secret";
  console.log(`QuotaDeck listening on http://127.0.0.1:${port} (${secretState})`);
});

if (backgroundRefreshEnabled) {
  // Refresh on the minute boundary (:00) so the snapshot and reset countdowns
  // tick predictably, then re-arm for the next minute (self-correcting drift).
  const scheduleMinuteRefresh = () => {
    const delay = 60_000 - (Date.now() % 60_000);
    setTimeout(() => {
      runBackgroundRefresh().catch((error) => console.error("Background refresh error:", error.message));
      scheduleMinuteRefresh();
    }, delay).unref();
  };
  // Populate the snapshot once at startup so the first view is not empty.
  runBackgroundRefresh().catch((error) => console.error("Background refresh error:", error.message));
  scheduleMinuteRefresh();
}
