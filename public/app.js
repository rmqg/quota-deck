const translations = {
  "zh-Hans": {
    title: "额度监控",
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
    provider: "平台",
    providerCodex: "Codex / ChatGPT",
    providerClaude: "Claude",
    claudeCredentials: "Claude credentials.json",
    guideClaude: "Claude 账号请上传 Claude Code 登录文件：<code>~/.claude/.credentials.json</code>",
    barkTitle: "Bark 推送通知",
    barkEnabled: "启用 Bark 推送",
    barkServerUrl: "Bark 服务器地址",
    barkDeviceKey: "Bark 设备 Key",
    barkThreshold: "低额度阈值（%）",
    barkEvents: "通知时机",
    barkEventLow: "额度即将耗尽",
    barkEventExhausted: "额度已耗尽",
    barkEventReset: "额度已恢复",
    barkEventError: "刷新失败",
    barkSave: "保存",
    barkTest: "发送测试",
    barkSaved: "已保存 Bark 设置",
    barkTestSent: "测试通知已发送",
    barkTestFailed: "发送失败：",
    guideTitle: "如何获取登录文件",
    guideOne: "在本机找到 Codex 登录文件：<code>${CODEX_HOME:-$HOME/.codex}/auth.json</code>",
    guideTwo: "在这里上传该文件。服务器只保存加密后的凭据，刷新额度时才临时解密。",
    guideThree: "公开部署时请使用强密码；不再信任服务器时请轮换对应账号的登录。",
    accounts: "账号",
    healthy: "正常",
    updated: "更新",
    noAccounts: "暂无账号",
    refreshing: "刷新中",
    pending: "等待刷新",
    refreshReturnedNoResults: "刷新没有返回账号结果",
    updatedIn: "更新耗时",
    resetUnavailable: "无重置时间",
    resets: "重置于",
    resetsIn: "还剩",
    left: "剩余",
    used: "已用",
    limit: "额度",
    fiveHour: "5 小时额度",
    weekly: "每周额度",
    authRequired: "请先登录",
    importDone: "已导入账号",
    deleteConfirm: "确定删除“{name}”吗？这不会影响 Codex / Claude 本身。",
    beginnerGuideTitle: "小白使用说明",
    beginnerGuideBody: `
      <h3>这个页面能做什么</h3>
      <p>QuotaDeck 用来集中查看 Codex 的每周额度，以及 Claude 的 5 小时和每周额度。它不查看 OpenAI API 账单；Claude 订阅额度可通过上传 Claude Code 登录文件查看。</p>
      <h3>第一次使用</h3>
      <ol>
        <li>先注册一个本站账号。公开部署时，创建好自己的账号后，应在服务器里把 <code>ALLOW_REGISTRATION</code> 改成 <code>0</code> 并重启容器，避免陌生人注册。</li>
        <li>确认你要监控的工具已经登录：Codex 登录文件一般在 <code>\${CODEX_HOME:-$HOME/.codex}/auth.json</code>，Claude Code 在 <code>~/.claude/.credentials.json</code>。</li>
        <li>在导入表单选择平台（Codex 或 Claude），填写一个容易识别的账号名称，选择对应的登录文件，点击导入。服务器只保存加密后的凭据。</li>
        <li>导入后可以点顶部刷新更新所有账号，也可以点每个账号右侧的小刷新只更新那一个账号。</li>
      </ol>
      <h3>安全注意</h3>
      <ul>
        <li>不要把登录文件（<code>auth.json</code> / <code>credentials.json</code>）发到公开聊天、Issue、论坛或别人控制的服务器。</li>
        <li><code>APP_SECRET</code> 必须长期保持不变；改掉后旧凭据无法解密。</li>
        <li>不再信任某台服务器时，请重新登录或轮换对应账号的登录，让旧凭据失效。</li>
      </ul>
    `,
  },
  "zh-Hant": {
    title: "額度監控",
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
    provider: "平台",
    providerCodex: "Codex / ChatGPT",
    providerClaude: "Claude",
    claudeCredentials: "Claude credentials.json",
    guideClaude: "Claude 帳號請上傳 Claude Code 登入檔：<code>~/.claude/.credentials.json</code>",
    barkTitle: "Bark 推播通知",
    barkEnabled: "啟用 Bark 推播",
    barkServerUrl: "Bark 伺服器位址",
    barkDeviceKey: "Bark 裝置 Key",
    barkThreshold: "低額度閾值（%）",
    barkEvents: "通知時機",
    barkEventLow: "額度即將耗盡",
    barkEventExhausted: "額度已耗盡",
    barkEventReset: "額度已恢復",
    barkEventError: "重新整理失敗",
    barkSave: "儲存",
    barkTest: "傳送測試",
    barkSaved: "已儲存 Bark 設定",
    barkTestSent: "測試通知已傳送",
    barkTestFailed: "傳送失敗：",
    guideTitle: "如何取得登入檔",
    guideOne: "在本機找到 Codex 登入檔：<code>${CODEX_HOME:-$HOME/.codex}/auth.json</code>",
    guideTwo: "在這裡上傳該檔案。伺服器只保存加密後的憑據，刷新額度時才暫時解密。",
    guideThree: "公開部署時請使用強密碼；不再信任伺服器時請輪換對應帳號的登入。",
    accounts: "帳號",
    healthy: "正常",
    updated: "更新",
    noAccounts: "尚無帳號",
    refreshing: "重新整理中",
    pending: "等待重新整理",
    refreshReturnedNoResults: "重新整理未返回帳號結果",
    updatedIn: "更新耗時",
    resetUnavailable: "無重置時間",
    resets: "重置於",
    resetsIn: "還剩",
    left: "剩餘",
    used: "已用",
    limit: "額度",
    fiveHour: "5 小時額度",
    weekly: "每週額度",
    authRequired: "請先登入",
    importDone: "已匯入帳號",
    deleteConfirm: "確定刪除「{name}」嗎？這不會影響 Codex / Claude 本身。",
    beginnerGuideTitle: "新手使用說明",
    beginnerGuideBody: `
      <h3>這個頁面能做什麼</h3>
      <p>QuotaDeck 用來集中查看 Codex 的每週額度，以及 Claude 的 5 小時和每週額度。它不會查看 OpenAI API 帳單；Claude 訂閱額度可透過上傳 Claude Code 登入檔查看。</p>
      <h3>第一次使用</h3>
      <ol>
        <li>先註冊一個本站帳號。公開部署時，建立好自己的帳號後，應在伺服器把 <code>ALLOW_REGISTRATION</code> 改成 <code>0</code> 並重啟容器，避免陌生人註冊。</li>
        <li>確認你要監控的工具已經登入：Codex 登入檔一般在 <code>\${CODEX_HOME:-$HOME/.codex}/auth.json</code>，Claude Code 在 <code>~/.claude/.credentials.json</code>。</li>
        <li>在匯入表單選擇平台（Codex 或 Claude），填寫一個容易識別的帳號名稱，選擇對應的登入檔，點擊匯入。伺服器只保存加密後的憑據。</li>
        <li>匯入後可以點頂部重新整理更新所有帳號，也可以點每個帳號右側的小重新整理只更新那一個帳號。</li>
      </ol>
      <h3>安全注意</h3>
      <ul>
        <li>不要把登入檔（<code>auth.json</code> / <code>credentials.json</code>）發到公開聊天、Issue、論壇或別人控制的伺服器。</li>
        <li><code>APP_SECRET</code> 必須長期保持不變；改掉後舊憑據無法解密。</li>
        <li>不再信任某台伺服器時，請重新登入或輪換對應帳號的登入，讓舊憑據失效。</li>
      </ul>
    `,
  },
  en: {
    title: "Quota Monitor",
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
    provider: "Provider",
    providerCodex: "Codex / ChatGPT",
    providerClaude: "Claude",
    claudeCredentials: "Claude credentials.json",
    guideClaude: "For Claude, upload the Claude Code login file: <code>~/.claude/.credentials.json</code>",
    barkTitle: "Bark notifications",
    barkEnabled: "Enable Bark notifications",
    barkServerUrl: "Bark server URL",
    barkDeviceKey: "Bark device key",
    barkThreshold: "Low-quota threshold (%)",
    barkEvents: "Notify on",
    barkEventLow: "Low quota",
    barkEventExhausted: "Quota exhausted",
    barkEventReset: "Quota reset",
    barkEventError: "Refresh failure",
    barkSave: "Save",
    barkTest: "Send test",
    barkSaved: "Bark settings saved",
    barkTestSent: "Test notification sent",
    barkTestFailed: "Send failed: ",
    guideTitle: "How to get login files",
    guideOne: "Find your local Codex login file: <code>${CODEX_HOME:-$HOME/.codex}/auth.json</code>",
    guideTwo: "Upload it here. Credentials are encrypted at rest and only decrypted temporarily while refreshing limits.",
    guideThree: "For public deployments, use a strong password and rotate the corresponding login if you no longer trust the server.",
    accounts: "Accounts",
    healthy: "Healthy",
    updated: "Updated",
    noAccounts: "No accounts",
    refreshing: "Refreshing",
    pending: "Pending refresh",
    refreshReturnedNoResults: "Refresh returned no account results",
    updatedIn: "updated in",
    resetUnavailable: "reset time unavailable",
    resets: "resets",
    resetsIn: "in",
    left: "left",
    used: "used",
    limit: "Limit",
    fiveHour: "5h limit",
    weekly: "Weekly limit",
    authRequired: "Please login first",
    importDone: "Account imported",
    deleteConfirm: "Delete \"{name}\"? This does not affect Codex / Claude itself.",
    beginnerGuideTitle: "Beginner guide",
    beginnerGuideBody: `
      <h3>What this page does</h3>
      <p>QuotaDeck shows Codex's weekly limit and Claude's 5-hour and weekly limits in one place. It does not monitor OpenAI API billing; Claude subscription limits are available by uploading the Claude Code login file.</p>
      <h3>First-time setup</h3>
      <ol>
        <li>Create a local QuotaDeck account. For public deployments, create your own account first, then set <code>ALLOW_REGISTRATION</code> to <code>0</code> on the server and restart the container.</li>
        <li>Make sure the tool you want to monitor is logged in: the Codex login file is usually <code>\${CODEX_HOME:-$HOME/.codex}/auth.json</code>, and Claude Code uses <code>~/.claude/.credentials.json</code>.</li>
        <li>Pick the provider (Codex or Claude) in the import form, enter a recognizable account name, choose the matching login file, and import it. The server stores only encrypted credentials.</li>
        <li>Use the top refresh button for all accounts, or the small refresh button on one account to refresh only that account.</li>
      </ol>
      <h3>Security notes</h3>
      <ul>
        <li>Do not post login files (<code>auth.json</code> / <code>credentials.json</code>) in public chats, issues, forums, or servers you do not control.</li>
        <li>Keep <code>APP_SECRET</code> stable. Changing it makes old encrypted credentials unreadable.</li>
        <li>If you stop trusting a server, log in again or rotate the corresponding login so the old credential becomes invalid.</li>
      </ul>
    `,
  },
  ja: {
    title: "使用量モニター",
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
    provider: "プロバイダー",
    providerCodex: "Codex / ChatGPT",
    providerClaude: "Claude",
    claudeCredentials: "Claude credentials.json",
    guideClaude: "Claude の場合は Claude Code のログインファイルをアップロード：<code>~/.claude/.credentials.json</code>",
    barkTitle: "Bark 通知",
    barkEnabled: "Bark 通知を有効化",
    barkServerUrl: "Bark サーバー URL",
    barkDeviceKey: "Bark デバイスキー",
    barkThreshold: "残量しきい値（%）",
    barkEvents: "通知タイミング",
    barkEventLow: "残量わずか",
    barkEventExhausted: "残量ゼロ",
    barkEventReset: "残量回復",
    barkEventError: "更新失敗",
    barkSave: "保存",
    barkTest: "テスト送信",
    barkSaved: "Bark 設定を保存しました",
    barkTestSent: "テスト通知を送信しました",
    barkTestFailed: "送信失敗：",
    guideTitle: "ログインファイルの取得方法",
    guideOne: "ローカルの Codex ログインファイルを探します: <code>${CODEX_HOME:-$HOME/.codex}/auth.json</code>",
    guideTwo: "ここにアップロードします。認証情報は保存時に暗号化され、制限更新時だけ一時的に復号されます。",
    guideThree: "公開運用では強いパスワードを使い、サーバーを信頼しなくなった場合は対応するアカウントのログインをローテーションしてください。",
    accounts: "アカウント",
    healthy: "正常",
    updated: "更新",
    noAccounts: "アカウントなし",
    refreshing: "更新中",
    pending: "更新待ち",
    refreshReturnedNoResults: "更新結果にアカウントが含まれていません",
    updatedIn: "更新時間",
    resetUnavailable: "リセット時刻なし",
    resets: "リセット",
    resetsIn: "あと",
    left: "残り",
    used: "使用済み",
    limit: "制限",
    fiveHour: "5時間制限",
    weekly: "週間制限",
    authRequired: "先にログインしてください",
    importDone: "アカウントをインポートしました",
    deleteConfirm: "「{name}」を削除しますか？Codex / Claude 自体には影響しません。",
    beginnerGuideTitle: "初心者向けガイド",
    beginnerGuideBody: `
      <h3>このページでできること</h3>
      <p>QuotaDeck は Codex の週間制限と、Claude の 5 時間制限・週間制限をまとめて表示します。OpenAI API の請求利用量は対象外ですが、Claude のサブスク残量は Claude Code のログインファイルをアップロードすると確認できます。</p>
      <h3>初回利用</h3>
      <ol>
        <li>まず QuotaDeck のローカルアカウントを作成します。公開運用では、自分のアカウントを作成した後、サーバー側で <code>ALLOW_REGISTRATION</code> を <code>0</code> に変更してコンテナを再起動してください。</li>
        <li>監視したいツールがログイン済みであることを確認します。Codex のログインファイルは通常 <code>\${CODEX_HOME:-$HOME/.codex}/auth.json</code>、Claude Code は <code>~/.claude/.credentials.json</code> です。</li>
        <li>インポートフォームでプロバイダー（Codex または Claude）を選び、分かりやすいアカウント名を入力し、対応するログインファイルを選択してインポートします。サーバーには暗号化された認証情報だけが保存されます。</li>
        <li>上部の更新ボタンで全アカウントを更新できます。各アカウント右側の小さい更新ボタンでは、そのアカウントだけを更新できます。</li>
      </ol>
      <h3>セキュリティ注意</h3>
      <ul>
        <li>ログインファイル（<code>auth.json</code> / <code>credentials.json</code>）を公開チャット、Issue、フォーラム、自分が管理していないサーバーに投稿しないでください。</li>
        <li><code>APP_SECRET</code> は維持してください。変更すると既存の暗号化済み認証情報を復号できなくなります。</li>
        <li>サーバーを信頼しなくなった場合は、対応するアカウントに再ログインするかログイン情報をローテーションして、古い認証情報を無効化してください。</li>
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
const beginnerGuide = document.querySelector(".beginner-guide");
const languageSelect = document.querySelector("#languageSelect");
const refreshAllButton = document.querySelector("#refreshAll");
const logoutButton = document.querySelector("#logoutButton");
const accountList = document.querySelector("#accountList");
const accountTemplate = document.querySelector("#accountTemplate");
const limitTemplate = document.querySelector("#limitTemplate");
const accountCount = document.querySelector("#accountCount");
const healthyCount = document.querySelector("#healthyCount");
const updatedAt = document.querySelector("#updatedAt");
const providerSelect = document.querySelector("#providerSelect");
const credentialLabel = document.querySelector("#credentialLabel");
const barkForm = document.querySelector("#barkForm");
const barkTestButton = document.querySelector("#barkTest");
const barkMessage = document.querySelector("#barkMessage");

let lang = localStorage.getItem("quotaDeckLang") || navigator.language || "en";
lang = translations[lang] ? lang : lang.startsWith("zh-TW") || lang.startsWith("zh-HK") ? "zh-Hant" : lang.startsWith("zh") ? "zh-Hans" : lang.startsWith("ja") ? "ja" : "en";
let currentUser = null;
let allowRegistration = false;
let accounts = [];
let results = new Map();
let requestNonce = 0;
let refreshAllInFlight = null;
let limitEvents = null;
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
  updateCredentialLabel();
  render();
}

function updateCredentialLabel() {
  if (!credentialLabel || !providerSelect) return;
  credentialLabel.textContent =
    providerSelect.value === "claude" ? t("claudeCredentials") : t("authJson");
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

function formatRelativeReset(unixSeconds) {
  const diffMs = unixSeconds * 1000 - Date.now();
  if (diffMs <= 0) return null;
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return "<1m";
}

function formatReset(unixSeconds) {
  if (!unixSeconds) return t("resetUnavailable");
  const at = `${t("resets")} ${formatTime(new Date(unixSeconds * 1000))}`;
  const remaining = formatRelativeReset(unixSeconds);
  return remaining ? `${at} · ${t("resetsIn")} ${remaining}` : at;
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

function weeklyQuotaWindow(snapshot) {
  for (const window of [snapshot?.weekly, snapshot?.week]) {
    if (window && typeof window === "object") return window;
  }
  return [snapshot?.primary, snapshot?.secondary].find(
    (window) => Number(window?.windowDurationMins) === 10080,
  ) || null;
}

function visibleLimitWindows(account, snapshot) {
  if (account?.provider === "codex") {
    return [weeklyQuotaWindow(snapshot)].filter(Boolean);
  }
  return [snapshot?.primary, snapshot?.secondary].filter(Boolean);
}

function remainingPercent(window) {
  const used = Number(window?.usedPercent || 0);
  if (!Number.isFinite(used)) return 100;
  return Math.max(0, Math.min(100, Math.round(100 - used)));
}

function barLevel(left) {
  if (left <= 10) return "empty";
  if (left <= 25) return "low";
  if (left <= 50) return "mid";
  if (left <= 75) return "high";
  return "full";
}

function renderLimit(window) {
  const fragment = limitTemplate.content.cloneNode(true);
  const root = fragment.querySelector(".limit-line");
  const used = Number(window?.usedPercent || 0);
  const left = remainingPercent(window);
  const fill = fragment.querySelector(".bar-fill");
  const resetText = fragment.querySelector(".reset-text");
  fragment.querySelector(".limit-name").textContent = limitLabel(window);
  fragment.querySelector(".limit-left").textContent = `${left}% ${t("left")}`;
  resetText.hidden = left >= 100;
  resetText.textContent = left < 100 ? formatReset(window?.resetsAt) : "";
  fill.style.width = `${left}%`;
  fill.classList.remove("full", "high", "mid", "low", "empty");
  fill.classList.add(barLevel(left));
  root.title = `${used}% ${t("used")}`;
  return fragment;
}

function setAuthedState() {
  document.querySelectorAll(".authed-only").forEach((node) => {
    node.hidden = !currentUser;
  });
  authPanel.hidden = Boolean(currentUser);
  beginnerGuide.hidden = Boolean(currentUser);
}

function findAccountRow(id) {
  return [...accountList.querySelectorAll(".account-row")].find((row) => row.dataset.accountId === id);
}

function accountDisplayLabel(account) {
  const email = String(account?.email || "").trim();
  const name = String(account?.name || email || "Codex Account").trim();
  return email && email.toLowerCase() !== name.toLowerCase() ? `${name} (${email})` : name;
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
    const emailNode = fragment.querySelector(".account-email");
    const email = String(account.email || "").trim();
    const showEmail = Boolean(email && email.toLowerCase() !== String(account.name || "").trim().toLowerCase());
    emailNode.textContent = showEmail ? email : "";
    emailNode.hidden = !showEmail;
    fragment.querySelector(".account-path").textContent = account.provider;
    fragment.querySelector(".plan-badge").textContent = snapshot?.planType || account.provider;
    refreshButton.disabled = isRefreshing;
    refreshButton.addEventListener("click", () => refreshOne(account.id));
    fragment.querySelector(".delete-one").addEventListener("click", () => deleteAccount(account.id));

    if (result?.ok && snapshot) {
      const windows = visibleLimitWindows(account, snapshot);
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

async function loadLimits() {
  if (!currentUser) return;
  const body = await api("/api/limits?refresh=1");
  applyRefreshResults(body);
  render();
}

function closeLimitEvents() {
  if (!limitEvents) return;
  limitEvents.close();
  limitEvents = null;
}

function connectLimitEvents() {
  if (!currentUser || limitEvents || !window.EventSource) return;
  limitEvents = new EventSource("/api/limits/events");
  limitEvents.addEventListener("limits", (event) => {
    try {
      applyRefreshResults(JSON.parse(event.data));
      render();
    } catch (error) {
      console.error(error);
    }
  });
  limitEvents.addEventListener("limits-error", (event) => {
    if (event.data) {
      try {
        console.error(JSON.parse(event.data).error);
      } catch {
        console.error(event.data);
      }
    }
  });
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
  if (!window.confirm(interpolate(t("deleteConfirm"), { name: accountDisplayLabel(account) }))) return;

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
  await loadBark();
  await loadLimits();
  connectLimitEvents();
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
  try {
    const formData = new FormData(importForm);
    const file = formData.get("authFile");
    if (!(file instanceof File)) return;
    const provider = formData.get("provider") === "claude" ? "claude" : "codex";
    const content = await file.text();
    const endpoint =
      provider === "claude" ? "/api/accounts/import-claude" : "/api/accounts/import-auth";
    const payload =
      provider === "claude"
        ? { name: formData.get("name"), credentialsJson: content }
        : { name: formData.get("name"), authJson: content };
    const body = await api(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    accounts.push(body.account);
    importForm.reset();
    updateCredentialLabel();
    render();
    await refreshOne(body.account.id);
  } catch (error) {
    window.alert(error.message);
  }
});

if (providerSelect) {
  providerSelect.addEventListener("change", updateCredentialLabel);
}

function barkConfigFromForm() {
  const formData = new FormData(barkForm);
  return {
    enabled: formData.get("enabled") === "on",
    serverUrl: formData.get("serverUrl") || "",
    deviceKey: formData.get("deviceKey") || "",
    threshold: Number(formData.get("threshold")) || 20,
    events: {
      low: formData.get("low") === "on",
      exhausted: formData.get("exhausted") === "on",
      reset: formData.get("reset") === "on",
      error: formData.get("error") === "on",
    },
  };
}

function applyBarkConfig(bark) {
  barkForm.elements.enabled.checked = Boolean(bark.enabled);
  barkForm.elements.serverUrl.value = bark.serverUrl || "";
  barkForm.elements.deviceKey.value = bark.deviceKey || "";
  barkForm.elements.threshold.value = bark.threshold ?? 20;
  const events = bark.events || {};
  barkForm.elements.low.checked = events.low !== false;
  barkForm.elements.exhausted.checked = events.exhausted !== false;
  barkForm.elements.reset.checked = events.reset !== false;
  barkForm.elements.error.checked = events.error !== false;
}

async function loadBark() {
  if (!currentUser) return;
  try {
    const body = await api("/api/settings/bark");
    applyBarkConfig(body.bark);
  } catch (error) {
    console.error(error);
  }
}

barkForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  barkMessage.textContent = "";
  barkMessage.classList.remove("error");
  try {
    const body = await api("/api/settings/bark", {
      method: "PUT",
      body: JSON.stringify(barkConfigFromForm()),
    });
    applyBarkConfig(body.bark);
    barkMessage.textContent = t("barkSaved");
  } catch (error) {
    barkMessage.textContent = error.message;
    barkMessage.classList.add("error");
  }
});

barkTestButton.addEventListener("click", async () => {
  barkMessage.textContent = "";
  barkMessage.classList.remove("error");
  try {
    await api("/api/settings/bark/test", {
      method: "POST",
      body: JSON.stringify(barkConfigFromForm()),
    });
    barkMessage.textContent = t("barkTestSent");
  } catch (error) {
    barkMessage.textContent = `${t("barkTestFailed")}${error.message}`;
    barkMessage.classList.add("error");
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error(error);
  }
  currentUser = null;
  accounts = [];
  results = new Map();
  closeLimitEvents();
  render();
});

refreshAllButton.addEventListener("click", () => {
  refreshAll().catch(console.error);
});
languageSelect.addEventListener("change", () => {
  lang = languageSelect.value;
  localStorage.setItem("quotaDeckLang", lang);
  applyI18n();
});

applyI18n();
try {
  await loadMe();
  await loadAccounts();
  await loadBark();
  await loadLimits();
  connectLimitEvents();
} catch (error) {
  console.error(error);
  authMessage.textContent = error.message;
}
