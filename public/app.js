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
    refreshReturnedNoResults: "刷新没有返回账号结果",
    updatedIn: "更新耗时",
    left: "剩余",
    used: "已用",
    limit: "额度",
    fiveHour: "5 小时额度",
    weekly: "每周额度",
    authRequired: "请先登录",
    importDone: "已导入账号",
    deleteConfirm: "确定删除“{name}”吗？这不会影响 Codex / ChatGPT 本身。",
    beginnerGuideTitle: "小白使用说明",
    beginnerGuideBody: `
      <h3>这个页面能做什么</h3>
      <p>QuotaDeck 用来查看 Codex CLI 里显示的两个额度：5 小时额度和每周额度。它不会查看 OpenAI API 账单，也不覆盖 Claude Pro。</p>
      <h3>第一次使用</h3>
      <ol>
        <li>先注册一个本站账号。公开部署时，创建好自己的账号后，应在服务器里把 <code>ALLOW_REGISTRATION</code> 改成 <code>0</code> 并重启容器，避免陌生人注册。</li>
        <li>在你自己的电脑上确认 Codex CLI 已经登录。一般登录文件在 <code>\${CODEX_HOME:-$HOME/.codex}/auth.json</code>。</li>
        <li>填写一个容易识别的账号名称，选择 <code>auth.json</code>，点击导入。服务器只保存加密后的凭据。</li>
        <li>导入后可以点顶部刷新更新所有账号，也可以点每个账号右侧的小刷新只更新那一个账号。</li>
      </ol>
      <h3>安全注意</h3>
      <ul>
        <li>不要把 <code>auth.json</code> 发到公开聊天、Issue、论坛或别人控制的服务器。</li>
        <li><code>APP_SECRET</code> 必须长期保持不变；改掉后旧凭据无法解密。</li>
        <li>不再信任某台服务器时，请重新登录或轮换 Codex 登录，让旧凭据失效。</li>
      </ul>
    `,
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
    refreshReturnedNoResults: "重新整理未返回帳號結果",
    updatedIn: "更新耗時",
    left: "剩餘",
    used: "已用",
    limit: "額度",
    fiveHour: "5 小時額度",
    weekly: "每週額度",
    authRequired: "請先登入",
    importDone: "已匯入帳號",
    deleteConfirm: "確定刪除「{name}」嗎？這不會影響 Codex / ChatGPT 本身。",
    beginnerGuideTitle: "新手使用說明",
    beginnerGuideBody: `
      <h3>這個頁面能做什麼</h3>
      <p>QuotaDeck 用來查看 Codex CLI 裡顯示的兩個額度：5 小時額度和每週額度。它不會查看 OpenAI API 帳單，也不涵蓋 Claude Pro。</p>
      <h3>第一次使用</h3>
      <ol>
        <li>先註冊一個本站帳號。公開部署時，建立好自己的帳號後，應在伺服器把 <code>ALLOW_REGISTRATION</code> 改成 <code>0</code> 並重啟容器，避免陌生人註冊。</li>
        <li>在你自己的電腦上確認 Codex CLI 已經登入。一般登入檔在 <code>\${CODEX_HOME:-$HOME/.codex}/auth.json</code>。</li>
        <li>填寫一個容易識別的帳號名稱，選擇 <code>auth.json</code>，點擊匯入。伺服器只保存加密後的憑據。</li>
        <li>匯入後可以點頂部重新整理更新所有帳號，也可以點每個帳號右側的小重新整理只更新那一個帳號。</li>
      </ol>
      <h3>安全注意</h3>
      <ul>
        <li>不要把 <code>auth.json</code> 發到公開聊天、Issue、論壇或別人控制的伺服器。</li>
        <li><code>APP_SECRET</code> 必須長期保持不變；改掉後舊憑據無法解密。</li>
        <li>不再信任某台伺服器時，請重新登入或輪換 Codex 登入，讓舊憑據失效。</li>
      </ul>
    `,
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
    refreshReturnedNoResults: "Refresh returned no account results",
    updatedIn: "updated in",
    left: "left",
    used: "used",
    limit: "Limit",
    fiveHour: "5h limit",
    weekly: "Weekly limit",
    authRequired: "Please login first",
    importDone: "Account imported",
    deleteConfirm: "Delete \"{name}\"? This does not affect Codex / ChatGPT itself.",
    beginnerGuideTitle: "Beginner guide",
    beginnerGuideBody: `
      <h3>What this page does</h3>
      <p>QuotaDeck shows the two limits that Codex CLI displays: the 5-hour limit and the weekly limit. It does not monitor OpenAI API billing, and it does not cover Claude Pro.</p>
      <h3>First-time setup</h3>
      <ol>
        <li>Create a local QuotaDeck account. For public deployments, create your own account first, then set <code>ALLOW_REGISTRATION</code> to <code>0</code> on the server and restart the container.</li>
        <li>Make sure Codex CLI is logged in on your own computer. The login file is usually <code>\${CODEX_HOME:-$HOME/.codex}/auth.json</code>.</li>
        <li>Enter a recognizable account name, choose <code>auth.json</code>, and import it. The server stores only encrypted credentials.</li>
        <li>Use the top refresh button for all accounts, or the small refresh button on one account to refresh only that account.</li>
      </ol>
      <h3>Security notes</h3>
      <ul>
        <li>Do not post <code>auth.json</code> in public chats, issues, forums, or servers you do not control.</li>
        <li>Keep <code>APP_SECRET</code> stable. Changing it makes old encrypted credentials unreadable.</li>
        <li>If you stop trusting a server, log in again or rotate your Codex login so the old credential becomes invalid.</li>
      </ul>
    `,
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
    refreshReturnedNoResults: "更新結果にアカウントが含まれていません",
    updatedIn: "更新時間",
    left: "残り",
    used: "使用済み",
    limit: "制限",
    fiveHour: "5時間制限",
    weekly: "週間制限",
    authRequired: "先にログインしてください",
    importDone: "アカウントをインポートしました",
    deleteConfirm: "「{name}」を削除しますか？Codex / ChatGPT 自体には影響しません。",
    beginnerGuideTitle: "初心者向けガイド",
    beginnerGuideBody: `
      <h3>このページでできること</h3>
      <p>QuotaDeck は Codex CLI に表示される 2 つの制限、5 時間制限と週間制限を表示します。OpenAI API の請求利用量や Claude Pro は対象外です。</p>
      <h3>初回利用</h3>
      <ol>
        <li>まず QuotaDeck のローカルアカウントを作成します。公開運用では、自分のアカウントを作成した後、サーバー側で <code>ALLOW_REGISTRATION</code> を <code>0</code> に変更してコンテナを再起動してください。</li>
        <li>自分の PC で Codex CLI にログイン済みであることを確認します。ログインファイルは通常 <code>\${CODEX_HOME:-$HOME/.codex}/auth.json</code> にあります。</li>
        <li>分かりやすいアカウント名を入力し、<code>auth.json</code> を選択してインポートします。サーバーには暗号化された認証情報だけが保存されます。</li>
        <li>上部の更新ボタンで全アカウントを更新できます。各アカウント右側の小さい更新ボタンでは、そのアカウントだけを更新できます。</li>
      </ol>
      <h3>セキュリティ注意</h3>
      <ul>
        <li><code>auth.json</code> を公開チャット、Issue、フォーラム、自分が管理していないサーバーに投稿しないでください。</li>
        <li><code>APP_SECRET</code> は維持してください。変更すると既存の暗号化済み認証情報を復号できなくなります。</li>
        <li>サーバーを信頼しなくなった場合は、Codex に再ログインするかログイン情報をローテーションして、古い認証情報を無効化してください。</li>
      </ul>
    `,
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
let refreshAllInFlight = null;
const refreshingAccountIds = new Set();

function t(key) {
  return translations[lang]?.[key] || translations.en[key] || key;
}

function interpolate(message, values) {
  return message.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
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

function remainingPercent(window) {
  const used = Number(window?.usedPercent || 0);
  if (!Number.isFinite(used) || used <= 1) return 100;
  return Math.max(0, Math.min(100, Math.round(100 - used)));
}

function renderLimit(window) {
  const fragment = limitTemplate.content.cloneNode(true);
  const root = fragment.querySelector(".limit-line");
  const used = Number(window?.usedPercent || 0);
  const left = remainingPercent(window);
  const fill = fragment.querySelector(".bar-fill");
  fragment.querySelector(".limit-name").textContent = limitLabel(window);
  fragment.querySelector(".limit-left").textContent = `${left}% ${t("left")}`;
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

function findAccountRow(id) {
  return [...accountList.querySelectorAll(".account-row")].find((row) => row.dataset.accountId === id);
}

function renderPreservingAccount(id) {
  const previousRow = findAccountRow(id);
  const previousTop = previousRow?.getBoundingClientRect().top;
  const previousScrollX = window.scrollX;
  const previousScrollY = window.scrollY;
  render();

  const nextRow = findAccountRow(id);
  if (previousRow && nextRow && Number.isFinite(previousTop)) {
    window.scrollBy(0, nextRow.getBoundingClientRect().top - previousTop);
    return;
  }
  window.scrollTo(previousScrollX, previousScrollY);
}

function render() {
  setAuthedState();
  registerForm.hidden = !allowRegistration;
  if (!currentUser) return;

  const visibleResults = accounts.map((account) => results.get(account.id)).filter(Boolean);
  accountCount.textContent = String(accounts.length);
  healthyCount.textContent = String(visibleResults.filter((result) => result.ok).length);
  const lastRefresh = visibleResults.map((result) => result.refreshedAt).sort().at(-1);
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
    const isRefreshing = refreshingAccountIds.has(account.id);
    const refreshButton = fragment.querySelector(".refresh-one");

    root.dataset.accountId = account.id;
    root.classList.toggle("is-refreshing", isRefreshing);
    fragment.querySelector(".account-name").textContent = account.name;
    fragment.querySelector(".account-path").textContent = account.provider;
    fragment.querySelector(".plan-badge").textContent = snapshot?.planType || account.provider;
    refreshButton.disabled = isRefreshing;
    refreshButton.addEventListener("click", () => refreshOne(account.id));
    fragment.querySelector(".delete-one").addEventListener("click", () => deleteAccount(account.id));

    if (result?.ok && snapshot) {
      const windows = [snapshot.primary, snapshot.secondary].filter(Boolean);
      limits.replaceChildren(...windows.map(renderLimit));
      message.textContent = isRefreshing ? t("refreshing") : `${t("updatedIn")} ${result.latencyMs}ms`;
      message.classList.remove("error");
    } else if (result && !result.ok) {
      limits.replaceChildren();
      message.textContent = result.error;
      message.classList.add("error");
    } else {
      limits.replaceChildren();
      message.textContent = isRefreshing ? t("refreshing") : t("pending");
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
  const accountIds = new Set(accounts.map((account) => account.id));
  results = new Map([...results].filter(([id]) => accountIds.has(id)));
  render();
}

function applyRefreshResults(body) {
  const incoming = Array.isArray(body?.results) ? body.results : [];
  const next = new Map(results);
  const seen = new Set();
  for (const result of incoming) {
    const id = result?.account?.id;
    if (!id) continue;
    seen.add(id);
    next.set(id, result);
  }

  if (accounts.length && seen.size < accounts.length) {
    const now = new Date().toISOString();
    for (const account of accounts) {
      if (seen.has(account.id) || next.has(account.id)) continue;
      next.set(account.id, {
        account,
        ok: false,
        refreshedAt: now,
        latencyMs: 0,
        error: t("refreshReturnedNoResults"),
      });
    }
  }
  results = next;
}

function refreshAll() {
  if (!currentUser) return Promise.resolve();
  if (refreshAllInFlight) return refreshAllInFlight;
  refreshAllButton.disabled = true;
  refreshAllButton.textContent = t("refreshing");
  refreshAllInFlight = (async () => {
    const body = await api("/api/limits/refresh", { method: "POST" });
    applyRefreshResults(body);
    render();
  })();

  return refreshAllInFlight.finally(() => {
    refreshAllInFlight = null;
    refreshAllButton.disabled = false;
    refreshAllButton.textContent = t("refresh");
  });
}

async function refreshOne(id) {
  if (refreshingAccountIds.has(id)) return;
  refreshingAccountIds.add(id);
  renderPreservingAccount(id);

  try {
    const body = await api(`/api/limits/${encodeURIComponent(id)}/refresh`, { method: "POST" });
    results.set(body.account.id, body);
  } catch (error) {
    const account = accounts.find((item) => item.id === id);
    if (account) {
      results.set(id, {
        account,
        ok: false,
        refreshedAt: new Date().toISOString(),
        latencyMs: 0,
        error: error.message,
      });
    }
  } finally {
    refreshingAccountIds.delete(id);
    renderPreservingAccount(id);
  }
}

async function deleteAccount(id) {
  const account = accounts.find((item) => item.id === id);
  if (!account) return;
  if (!window.confirm(interpolate(t("deleteConfirm"), { name: account.name }))) return;

  const previousAccounts = accounts;
  const previousResults = results;
  accounts = accounts.filter((account) => account.id !== id);
  results = new Map(results);
  results.delete(id);
  render();

  try {
    await api(`/api/accounts/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch (error) {
    accounts = previousAccounts;
    results = previousResults;
    render();
    window.alert(error.message);
  }
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
