const translations = {
  "zh-Hans": {
    title: "Codex 额度监控",
    refresh: "刷新",
    logout: "退出",
    loginTitle: "登录",
    registerTitle: "创建账号",
    username: "用户名",
    password: "密码",
    login: "登录",
    register: "注册",
    accountName: "账号名称",
    accountNamePlaceholder: "OpenAI Business",
    authJson: "Codex auth.json",
    import: "导入",
    guideTitle: "如何获取 auth.json",
    guideOne: "在本机找到 Codex 登录文件：<code>${CODEX_HOME:-$HOME/.codex}/auth.json</code>",
    guideTwo: "在这里上传该文件。服务器只保存加密后的凭据，刷新额度时才临时解密。",
    guideThree: "公开部署时请使用强密码；不再信任服务器时请轮换 Codex 登录。",
    accounts: "账号",
    healthy: "正常",
    updated: "更新",
    noAccounts: "暂无账号",
    refreshing: "刷新中",
    pending: "等待刷新",
    updatedIn: "更新耗时",
    resetUnavailable: "无重置时间",
    resets: "重置于",
    left: "剩余",
    used: "已用",
    limit: "额度",
    fiveHour: "5 小时额度",
    weekly: "每周额度",
    authRequired: "请先登录",
    importDone: "已导入账号",
  },
  "zh-Hant": {
    title: "Codex 額度監控",
    refresh: "重新整理",
    logout: "登出",
    loginTitle: "登入",
    registerTitle: "建立帳號",
    username: "使用者名稱",
    password: "密碼",
    login: "登入",
    register: "註冊",
    accountName: "帳號名稱",
    accountNamePlaceholder: "OpenAI Business",
    authJson: "Codex auth.json",
    import: "匯入",
    guideTitle: "如何取得 auth.json",
    guideOne: "在本機找到 Codex 登入檔：<code>${CODEX_HOME:-$HOME/.codex}/auth.json</code>",
    guideTwo: "在這裡上傳該檔案。伺服器只保存加密後的憑據，刷新額度時才暫時解密。",
    guideThree: "公開部署時請使用強密碼；不再信任伺服器時請輪換 Codex 登入。",
    accounts: "帳號",
    healthy: "正常",
    updated: "更新",
    noAccounts: "尚無帳號",
    refreshing: "重新整理中",
    pending: "等待重新整理",
    updatedIn: "更新耗時",
    resetUnavailable: "無重置時間",
    resets: "重置於",
    left: "剩餘",
    used: "已用",
    limit: "額度",
    fiveHour: "5 小時額度",
    weekly: "每週額度",
    authRequired: "請先登入",
    importDone: "已匯入帳號",
  },
  en: {
    title: "Codex Limit Monitor",
    refresh: "Refresh",
    logout: "Logout",
    loginTitle: "Login",
    registerTitle: "Create Account",
    username: "Username",
    password: "Password",
    login: "Login",
    register: "Register",
    accountName: "Account Name",
    accountNamePlaceholder: "OpenAI Business",
    authJson: "Codex auth.json",
    import: "Import",
    guideTitle: "How to get auth.json",
    guideOne: "Find your local Codex login file: <code>${CODEX_HOME:-$HOME/.codex}/auth.json</code>",
    guideTwo: "Upload it here. Credentials are encrypted at rest and only decrypted temporarily while refreshing limits.",
    guideThree: "For public deployments, use a strong password and rotate the Codex login if you no longer trust the server.",
    accounts: "Accounts",
    healthy: "Healthy",
    updated: "Updated",
    noAccounts: "No accounts",
    refreshing: "Refreshing",
    pending: "Pending refresh",
    updatedIn: "updated in",
    resetUnavailable: "reset time unavailable",
    resets: "resets",
    left: "left",
    used: "used",
    limit: "Limit",
    fiveHour: "5h limit",
    weekly: "Weekly limit",
    authRequired: "Please login first",
    importDone: "Account imported",
  },
  ja: {
    title: "Codex 制限モニター",
    refresh: "更新",
    logout: "ログアウト",
    loginTitle: "ログイン",
    registerTitle: "アカウント作成",
    username: "ユーザー名",
    password: "パスワード",
    login: "ログイン",
    register: "登録",
    accountName: "アカウント名",
    accountNamePlaceholder: "OpenAI Business",
    authJson: "Codex auth.json",
    import: "インポート",
    guideTitle: "auth.json の取得方法",
    guideOne: "ローカルの Codex ログインファイルを探します: <code>${CODEX_HOME:-$HOME/.codex}/auth.json</code>",
    guideTwo: "ここにアップロードします。認証情報は保存時に暗号化され、制限更新時だけ一時的に復号されます。",
    guideThree: "公開運用では強いパスワードを使い、サーバーを信頼しなくなった場合は Codex ログインをローテーションしてください。",
    accounts: "アカウント",
    healthy: "正常",
    updated: "更新",
    noAccounts: "アカウントなし",
    refreshing: "更新中",
    pending: "更新待ち",
    updatedIn: "更新時間",
    resetUnavailable: "リセット時刻なし",
    resets: "リセット",
    left: "残り",
    used: "使用済み",
    limit: "制限",
    fiveHour: "5時間制限",
    weekly: "週間制限",
    authRequired: "先にログインしてください",
    importDone: "アカウントをインポートしました",
  },
};

const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const importForm = document.querySelector("#importForm");
const authPanel = document.querySelector("#authPanel");
const appPanel = document.querySelector("#appPanel");
const authMessage = document.querySelector("#authMessage");
const languageSelect = document.querySelector("#languageSelect");
const refreshAllButton = document.querySelector("#refreshAll");
const logoutButton = document.querySelector("#logoutButton");
const accountList = document.querySelector("#accountList");
const accountTemplate = document.querySelector("#accountTemplate");
const limitTemplate = document.querySelector("#limitTemplate");
const accountCount = document.querySelector("#accountCount");
const healthyCount = document.querySelector("#healthyCount");
const updatedAt = document.querySelector("#updatedAt");
const refreshIntervalMs = 30_000;

let lang = localStorage.getItem("quotaDeckLang") || navigator.language || "en";
lang = translations[lang] ? lang : lang.startsWith("zh-TW") || lang.startsWith("zh-HK") ? "zh-Hant" : lang.startsWith("zh") ? "zh-Hans" : lang.startsWith("ja") ? "ja" : "en";
let currentUser = null;
let allowRegistration = false;
let accounts = [];
let results = new Map();
let requestNonce = 0;

function t(key) {
  return translations[lang]?.[key] || translations.en[key] || key;
}

function applyI18n() {
  document.documentElement.lang = lang;
  languageSelect.value = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    node.innerHTML = t(node.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  render();
}

async function api(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const requestPath =
    method === "GET"
      ? `${path}${path.includes("?") ? "&" : "?"}_qd=${Date.now()}-${requestNonce++}`
      : path;
  const response = await fetch(requestPath, {
    ...options,
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || `HTTP ${response.status}`);
  }
  return body;
}

function formatTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(lang, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function formatReset(unixSeconds) {
  if (!unixSeconds) return t("resetUnavailable");
  return `${t("resets")} ${formatTime(new Date(unixSeconds * 1000))}`;
}

function limitLabel(window) {
  if (!window?.windowDurationMins) return t("limit");
  if (window.windowDurationMins === 300) return t("fiveHour");
  if (window.windowDurationMins === 10080) return t("weekly");
  if (window.windowDurationMins % 1440 === 0) return `${window.windowDurationMins / 1440}d ${t("limit")}`;
  if (window.windowDurationMins % 60 === 0) return `${window.windowDurationMins / 60}h ${t("limit")}`;
  return `${window.windowDurationMins}m ${t("limit")}`;
}

function selectedSnapshot(result) {
  if (!result?.rateLimitsByLimitId) return result?.rateLimits || null;
  return result.rateLimitsByLimitId.codex || Object.values(result.rateLimitsByLimitId)[0] || result.rateLimits;
}

function renderLimit(window) {
  const fragment = limitTemplate.content.cloneNode(true);
  const root = fragment.querySelector(".limit-line");
  const used = Number(window?.usedPercent || 0);
  const left = Math.max(0, Math.min(100, 100 - used));
  const fill = fragment.querySelector(".bar-fill");
  fragment.querySelector(".limit-name").textContent = limitLabel(window);
  fragment.querySelector(".limit-left").textContent = `${left}% ${t("left")}`;
  fragment.querySelector(".reset-text").textContent = formatReset(window?.resetsAt);
  fill.style.width = `${left}%`;
  fill.classList.toggle("low", left <= 25 && left > 5);
  fill.classList.toggle("empty", left <= 5);
  root.title = `${used}% ${t("used")}`;
  return fragment;
}

function setAuthedState() {
  document.querySelectorAll(".authed-only").forEach((node) => {
    node.hidden = !currentUser;
  });
  authPanel.hidden = Boolean(currentUser);
}

function render() {
  setAuthedState();
  registerForm.hidden = !allowRegistration;
  if (!currentUser) return;

  accountCount.textContent = String(accounts.length);
  healthyCount.textContent = String([...results.values()].filter((result) => result.ok).length);
  const lastRefresh = [...results.values()].map((result) => result.refreshedAt).sort().at(-1);
  updatedAt.textContent = lastRefresh ? formatTime(lastRefresh) : "-";
  accountList.replaceChildren();

  if (!accounts.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("noAccounts");
    accountList.append(empty);
    return;
  }

  for (const account of accounts) {
    const result = results.get(account.id);
    const fragment = accountTemplate.content.cloneNode(true);
    const root = fragment.querySelector(".account-row");
    const limits = fragment.querySelector(".limits");
    const message = fragment.querySelector(".row-message");
    const snapshot = selectedSnapshot(result);

    fragment.querySelector(".account-name").textContent = account.name;
    fragment.querySelector(".account-path").textContent = account.provider;
    fragment.querySelector(".plan-badge").textContent = snapshot?.planType || account.provider;
    fragment.querySelector(".refresh-one").addEventListener("click", () => refreshOne(account.id));
    fragment.querySelector(".delete-one").addEventListener("click", () => deleteAccount(account.id));

    if (result?.ok && snapshot) {
      const windows = [snapshot.primary, snapshot.secondary].filter(Boolean);
      limits.replaceChildren(...windows.map(renderLimit));
      message.textContent = `${t("updatedIn")} ${result.latencyMs}ms`;
      message.classList.remove("error");
    } else if (result && !result.ok) {
      limits.replaceChildren();
      message.textContent = result.error;
      message.classList.add("error");
    } else {
      limits.replaceChildren();
      message.textContent = t("pending");
      message.classList.remove("error");
    }
    accountList.append(root);
  }
}

async function loadMe() {
  const body = await api("/api/auth/me");
  currentUser = body.user;
  allowRegistration = Boolean(body.allowRegistration);
  render();
}

async function loadAccounts() {
  if (!currentUser) return;
  const body = await api("/api/accounts");
  accounts = body.accounts;
  render();
}

async function refreshAll() {
  if (!currentUser) return;
  refreshAllButton.disabled = true;
  refreshAllButton.textContent = t("refreshing");
  try {
    const body = await api("/api/limits/refresh", { method: "POST" });
    results = new Map(body.results.map((result) => [result.account.id, result]));
    render();
  } finally {
    refreshAllButton.disabled = false;
    refreshAllButton.textContent = t("refresh");
  }
}

async function refreshOne(id) {
  const body = await api(`/api/limits/${encodeURIComponent(id)}/refresh`, { method: "POST" });
  results.set(body.account.id, body);
  render();
}

async function deleteAccount(id) {
  await api(`/api/accounts/${encodeURIComponent(id)}`, { method: "DELETE" });
  results.delete(id);
  await loadAccounts();
}

async function submitAuthForm(form, endpoint) {
  authMessage.textContent = "";
  const payload = Object.fromEntries(new FormData(form).entries());
  const body = await api(endpoint, { method: "POST", body: JSON.stringify(payload) });
  currentUser = body.user;
  form.reset();
  await loadAccounts();
  await refreshAll();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await submitAuthForm(loginForm, "/api/auth/login");
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await submitAuthForm(registerForm, "/api/auth/register");
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

importForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(importForm);
  const file = formData.get("authFile");
  if (!(file instanceof File)) return;
  const payload = {
    name: formData.get("name"),
    authJson: await file.text(),
  };
  const body = await api("/api/accounts/import-auth", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  accounts.push(body.account);
  importForm.reset();
  render();
  await refreshOne(body.account.id);
});

logoutButton.addEventListener("click", async () => {
  await api("/api/auth/logout", { method: "POST" });
  currentUser = null;
  accounts = [];
  results = new Map();
  render();
});

refreshAllButton.addEventListener("click", refreshAll);
languageSelect.addEventListener("change", () => {
  lang = languageSelect.value;
  localStorage.setItem("quotaDeckLang", lang);
  applyI18n();
});

applyI18n();
await loadMe();
await loadAccounts();
await refreshAll();
window.setInterval(() => {
  refreshAll().catch(console.error);
}, refreshIntervalMs);
