# QuotaDeck

**語言**：[简体中文](../README.md) | 繁體中文 | [English](README.en.md) | [日本語](README.ja.md)

QuotaDeck 是一個自託管網頁面板，用來集中查看 OpenAI Codex 和 Anthropic Claude 的兩個額度：

- `5h limit`（5 小時額度）
- `Weekly limit`（每週額度）

讀取方式：

- Codex：執行 `codex app-server --listen stdio://`，並呼叫 JSON-RPC 方法 `account/rateLimits/read`。
- Claude：使用 Claude Code 登入憑據（OAuth token）呼叫 Anthropic 的 `GET /api/oauth/usage`，過期時自動以 refresh token 刷新。

也支援透過 [Bark](https://github.com/Finb/Bark) 推播通知：伺服器可定時主動監控所有帳號，在額度即將耗盡、已耗盡、重新可用或刷新失敗時推播到你的 iPhone。

## 適合誰

適合：

- 有多個 Codex / ChatGPT 登入帳號，需要集中查看額度
- 想部署到自己的 VPS
- 想用 Docker 管理服務，避免污染主機環境
- 想讓每個使用者自己註冊、自己上傳自己的 Codex 登入檔

不適合：

- 查看 OpenAI API 帳單或 API token 用量
- 查看 Anthropic API（按量付費）用量
- 在不信任的伺服器上保存 Codex / Claude 登入狀態

## 安全模型

QuotaDeck 會處理敏感的 Codex / Claude 登入檔，請先理解這些規則：

- 本站帳號保存在本機資料目錄。
- 密碼使用 `scrypt` 雜湊保存，不保存明文密碼。
- 上傳的 Codex `auth.json` 和 Claude `credentials.json` 都會先被校驗，然後使用由 `APP_SECRET` 派生出的金鑰透過 AES-256-GCM 加密保存。
- 重新整理 Codex 額度時，伺服器才會把憑據暫時解密到 `/tmp` 下的臨時 `CODEX_HOME`，呼叫 Codex CLI 後立即刪除臨時目錄。
- 重新整理 Claude 額度時，伺服器在記憶體中解密 OAuth token 呼叫 Anthropic 介面；token 過期會自動刷新，並把輪換後的新 token 重新加密寫回資料目錄。
- 瀏覽器介面不會返回 access token、refresh token、id token。
- 每個匯入帳號都綁定 QuotaDeck 使用者，使用者只能看到自己的匯入帳號。
- Bark 設定按使用者保存；推播會把帳號名稱和額度狀態傳送到使用者自己配置的 Bark 伺服器。
- 沒有管理員角色，只有一種使用者。
- 是否開放註冊由 `ALLOW_REGISTRATION` 控制。

重要限制：

- 只要你把 `auth.json` 上傳到伺服器，就必須信任這台伺服器及其管理員。
- `APP_SECRET` 必須長期保持不變。更換後，舊的加密憑據無法解密。
- 不再信任某台伺服器時，請重新登入 Codex 或輪換 ChatGPT/Codex 登入狀態，讓舊憑據失效。

## 快速開始

推薦使用 Docker。

```bash
cp .env.example .env
```

編輯 `.env`：

```env
DOMAIN=quota.example.com
APP_SECRET=replace-with-a-long-random-secret
ALLOW_REGISTRATION=1
```

生成強 `APP_SECRET` 的例子：

```bash
openssl rand -base64 48
```

啟動：

```bash
docker compose up -d --build
```

打開：

```txt
https://quota.example.com
```

如果只是本機試用，也可以直接執行 Node：

```bash
APP_SECRET='dev-secret-change-me' \
ALLOW_REGISTRATION=1 \
npm start
```

本機地址：

```txt
http://127.0.0.1:8787
```

## VPS 部署

準備條件：

- 一台已安裝 Docker 和 Docker Compose 的 VPS
- 一個已經 A 到 VPS IP 的網域
- VPS 的 80 和 443 連接埠開放

部署步驟：

```bash
git clone https://github.com/rmqg/quota-deck.git /srv/quota-deck
cd /srv/quota-deck
cp .env.example .env
nano .env
docker compose up -d --build
```

`.env` 範例：

```env
DOMAIN=quota.example.com
APP_SECRET=use-a-long-random-secret-here
ALLOW_REGISTRATION=1
```

`DOMAIN` 必須是你的真實網域。Caddy 會使用這個網域自動申請 HTTPS 憑證。

建立自己的帳號後，建議關閉公開註冊：

```bash
cd /srv/quota-deck
sed -i 's/^ALLOW_REGISTRATION=.*/ALLOW_REGISTRATION=0/' .env
docker compose up -d
```

## 如何取得 Codex auth.json

在已經登入 Codex CLI 的電腦上找：

```txt
${CODEX_HOME:-$HOME/.codex}/auth.json
```

常見路徑：

- Linux/macOS 預設路徑：`~/.codex/auth.json`
- 如果你設定了 `CODEX_HOME`，就在 `$CODEX_HOME/auth.json`

可以用命令確認：

```bash
ls -l "${CODEX_HOME:-$HOME/.codex}/auth.json"
```

匯入步驟：

1. 打開 QuotaDeck。
2. 註冊或登入 QuotaDeck 本機帳號。
3. 在「帳號名稱」裡填一個容易識別的名稱，例如 `OpenAI Business`。
4. 選擇本機的 `auth.json`。
5. 點擊「匯入」。
6. 匯入後頁面會在帳號名稱下方顯示從 `auth.json` 解析出的信箱（如果存在），再點擊重新整理。

不要把 `auth.json` 發到公開聊天、Issue、論壇，或上傳到不信任的伺服器。

## 如何取得 Claude credentials.json

在已經登入 Claude Code 的電腦上找：

```txt
~/.claude/.credentials.json
```

說明：

- Linux/Windows(WSL)：明文檔案 `~/.claude/.credentials.json`。
- macOS：憑據保存在鑰匙圈（服務名 `Claude Code-credentials`），需先匯出成相同結構的 JSON 檔再上傳。
- 檔案結構為 `{ "claudeAiOauth": { "accessToken": ..., "refreshToken": ..., "expiresAt": ... } }`。

匯入步驟：

1. 在匯入表單的「平台」選擇 `Claude`。
2. 填寫帳號名稱，選擇本機的 `.credentials.json`。
3. 點擊「匯入」，再點重新整理。

伺服器只保存加密後的憑據。Claude 的 access token 約 1 小時過期，QuotaDeck 會用 refresh token 自動刷新，並把輪換後的新憑據重新加密寫回。

不要把 `.credentials.json` 發到公開聊天、Issue、論壇，或上傳到不信任的伺服器。

## Bark 推播通知

QuotaDeck 支援透過 [Bark](https://github.com/Finb/Bark)（iOS 推播 App）提醒額度狀態。

### 快速上手

1. iPhone 在 App Store 搜尋安裝 **Bark**。
2. 開啟 Bark，首頁會顯示一條形如 `https://api.day.app/abcd1234/` 的位址，其中 `abcd1234` 就是你的 **device key**（點一下可複製）。
3. 在 QuotaDeck 登入後展開「Bark 推播通知」：
   - **Bark 伺服器位址**：用官方伺服器就填 `https://api.day.app`（預設值）。
   - **Bark 裝置 Key**：填上一步的 `abcd1234`。
   - **低額度閾值**：剩餘百分比，預設 `20`（即剩餘低於 20% 時提醒）。
   - 勾選需要的「通知時機」，並勾上最上面的「啟用 Bark 推播」。
4. 點「儲存」，再點「傳送測試」，iPhone 收到一條 QuotaDeck 通知就代表配置成功。
5. 之後系統會依設定自動提醒，無需再手動操作。

每個使用者在頁面的「Bark 推播通知」裡配置自己的：

- Bark 伺服器位址（預設 `https://api.day.app`，自建伺服器填自己的位址）。
- Bark 裝置 Key。
- 低額度閾值（剩餘百分比，預設 20%）。
- 通知時機：額度即將耗盡 / 已耗盡 / 已恢復 / 刷新失敗（可分別開關）。

儲存後可點「傳送測試」驗證。開啟後，伺服器會依 `BARK_MONITOR_INTERVAL_MS`（預設 5 分鐘）定時刷新所有帳號並在狀態變化時推播，即使沒有開啟網頁也能收到提醒。設為 `0` 可關閉伺服器端主動監控。

Bark 推播會把帳號名稱和額度狀態傳送到你配置的 Bark 伺服器，請確認信任該伺服器。

## 頁面怎麼用

頁面在桌面和手機端都使用緊湊佈局，方便同時查看更多帳號和額度條。

頂部按鈕：

- 「重新整理」：重新整理目前使用者的所有帳號。
- 「登出」：登出 QuotaDeck 本機帳號。

帳號卡片按鈕：

- 帳號名稱下方會顯示帳號信箱（Codex 從 `auth.json` 解析，Claude 在匯入時刷新取得），方便區分多個帳號。
- `↻`：只重新整理這個帳號。
- `×`：刪除這個帳號設定。刪除前會二次確認，不會影響 Codex / ChatGPT 本身。

狀態數字：

- 「帳號」：目前匯入的帳號數量。
- 「正常」：最近一次重新整理成功的帳號數量。
- 「更新」：最近一次重新整理返回的時間。

額度條：

- `5 小時額度`：Codex CLI TUI 裡的 `5h limit`。
- `每週額度`：Codex CLI TUI 裡的 `Weekly limit`。
- 當額度顯示為 `100%` 剩餘時，頁面不顯示重置時間；低於 `100%` 時會顯示重置時間與距離重置還剩多久。
- 只有 `5 小時額度` 會把 Codex 返回的小於等於 `1%` 已用依照原生 TUI 的觀感顯示為 `100%` 剩餘；`每週額度` 依 Codex 返回值顯示。

## 更新、備份和恢復

更新：

```bash
cd /srv/quota-deck
git pull
docker compose up -d --build
```

備份：

```bash
cd /srv/quota-deck
tar -czf quota-deck-backup-$(date +%Y%m%d-%H%M%S).tar.gz .env data
```

恢復：

```bash
cd /srv/quota-deck
tar -xzf quota-deck-backup-YYYYMMDD-HHMMSS.tar.gz
docker compose up -d
```

注意：如果 `.env` 裡的 `APP_SECRET` 丟了，即使還有 `data/accounts.json`，也無法解密舊的 Codex 憑據。

## 常見問題

### 單個帳號顯示 401 Unauthorized

通常表示上傳的 Codex 登入狀態失效了。

處理辦法：

1. 在本機重新登入 Codex CLI。
2. 重新上傳新的 `auth.json`。
3. 刪除舊帳號設定。

### 憑證申請失敗

檢查：

- 網域 A 記錄是否指向 VPS IP
- VPS 的 80 和 443 連接埠是否開放
- 是否有主機上的 nginx/apache 佔用了 80/443
- `.env` 裡的 `DOMAIN` 是否寫錯

查看 Caddy 日誌：

```bash
docker compose logs -f quota-deck-proxy
```

### 修改 APP_SECRET 後帳號無法重新整理

這是預期行為。舊憑據是用舊 `APP_SECRET` 加密的。

處理辦法：

1. 恢復舊 `APP_SECRET`；或
2. 刪除舊帳號，重新上傳 `auth.json`。

### 使用 Cloudflare 或其他 CDN

建議不要快取 `/api/*`。額度資料和登入狀態都是動態內容，快取 API 回應會導致頁面顯示舊資料。

## 開發命令

語法檢查：

```bash
node --check server.js
node --check public/app.js
```

開發模式：

```bash
APP_SECRET='dev-secret-change-me' ALLOW_REGISTRATION=1 npm run dev
```

Docker 建置：

```bash
docker compose up -d --build
```

## 授權

本專案使用 `GPL-3.0-or-later`。完整授權條款見 [LICENSE](../LICENSE)。

## 免責聲明

QuotaDeck 是非官方專案，不代表 OpenAI 或 Anthropic。它依賴 Codex CLI 目前可用的本機登入狀態和 RPC 行為；如果 Codex CLI 或 ChatGPT 後端介面變更，專案可能需要更新。
