# QuotaDeck

**语言**：简体中文 | [繁體中文](docs/README.zh-Hant.md) | [English](docs/README.en.md) | [日本語](docs/README.ja.md)

QuotaDeck 是一个自托管网页面板，用来集中查看 OpenAI Codex 和 Anthropic Claude 的两个额度：

- `5h limit`（5 小时额度）
- `Weekly limit`（每周额度）

读取方式：

- Codex：运行 `codex app-server --listen stdio://` 并调用 JSON-RPC 方法 `account/rateLimits/read`。
- Claude：使用 Claude Code 登录凭据（OAuth token）调用 Anthropic 的 `GET /api/oauth/usage`，过期时自动用 refresh token 刷新。

还支持通过 [Bark](https://github.com/Finb/Bark) 推送通知：服务端可定时主动监控所有账号，在额度即将耗尽、已耗尽、重新可用或刷新失败时推送到你的 iPhone。

## 适合谁

适合：

- 有多个 Codex / ChatGPT 登录账号，需要集中查看额度
- 想部署到自己的 VPS
- 想用 Docker 管理服务，避免污染宿主机环境
- 想让每个用户自己注册、自己上传自己的 Codex 登录文件

不适合：

- 查看 OpenAI API 账单或 API token 用量
- 查看 Anthropic API（按量付费）账单用量
- 在不信任的服务器上保存 Codex / Claude 登录状态

## 安全模型

QuotaDeck 会处理敏感的 Codex / Claude 登录文件，请先理解这些规则：

- 本站账号保存在本地数据目录里。
- 密码使用 `scrypt` 哈希保存，不保存明文密码。
- 上传的 Codex `auth.json` 和 Claude `credentials.json` 都会被校验，然后使用 `APP_SECRET` 派生出的密钥通过 AES-256-GCM 加密保存。
- 刷新 Codex 额度时，服务器才会把凭据临时解密到 `/tmp` 下的临时 `CODEX_HOME`，调用 Codex CLI 后立即删除临时目录。
- 刷新 Claude 额度时，服务器在内存里解密 OAuth token 调用 Anthropic 接口；token 过期会自动刷新，并把轮换后的新 token 重新加密写回数据目录。
- 浏览器接口不会返回 access token、refresh token、id token。
- 每个导入账号都绑定 QuotaDeck 用户，用户只能看到自己的导入账号。
- Bark 配置按用户保存；推送会把账号名称和额度状态发送到用户自己配置的 Bark 服务器。
- 没有管理员角色，只有一种用户。
- 注册是否开放由 `ALLOW_REGISTRATION` 控制。

重要限制：

- 只要你把 `auth.json` 上传到服务器，就必须信任这台服务器及其管理员。
- `APP_SECRET` 必须长期保持不变。换掉它之后，旧的加密凭据无法解密。
- 不再信任某台服务器时，请重新登录 Codex 或轮换 ChatGPT/Codex 登录状态，让旧凭据失效。

## 快速开始

推荐使用 Docker。

```bash
cp .env.example .env
```

编辑 `.env`：

```env
DOMAIN=quota.example.com
APP_SECRET=replace-with-a-long-random-secret
ALLOW_REGISTRATION=1
```

生成强 `APP_SECRET` 的例子：

```bash
openssl rand -base64 48
```

启动：

```bash
docker compose up -d --build
```

打开：

```txt
https://quota.example.com
```

如果只是本地试用，也可以直接运行 Node：

```bash
APP_SECRET='dev-secret-change-me' \
ALLOW_REGISTRATION=1 \
npm start
```

本地地址：

```txt
http://127.0.0.1:8787
```

## VPS 部署

准备条件：

- 一台已安装 Docker 和 Docker Compose 的 VPS
- 一个已经 A 到 VPS IP 的域名
- VPS 的 80 和 443 端口开放

部署步骤：

```bash
git clone https://github.com/rmqg/quota-deck.git /srv/quota-deck
cd /srv/quota-deck
cp .env.example .env
nano .env
docker compose up -d --build
```

`.env` 示例：

```env
DOMAIN=quota.example.com
APP_SECRET=use-a-long-random-secret-here
ALLOW_REGISTRATION=1
```

`DOMAIN` 必须是你的真实域名。Caddy 会使用这个域名自动申请 HTTPS 证书。

创建自己的账号后，建议关闭公开注册：

```bash
cd /srv/quota-deck
sed -i 's/^ALLOW_REGISTRATION=.*/ALLOW_REGISTRATION=0/' .env
docker compose up -d
```

## 如何获取 Codex auth.json

在已经登录 Codex CLI 的电脑上找：

```txt
${CODEX_HOME:-$HOME/.codex}/auth.json
```

常见路径：

- Linux/macOS 默认路径：`~/.codex/auth.json`
- 如果你设置了 `CODEX_HOME`，就在 `$CODEX_HOME/auth.json`

可以用命令确认：

```bash
ls -l "${CODEX_HOME:-$HOME/.codex}/auth.json"
```

导入步骤：

1. 打开 QuotaDeck。
2. 注册或登录 QuotaDeck 本地账号。
3. 在“账号名称”里填一个容易识别的名字，比如 `OpenAI Business`。
4. 选择本机的 `auth.json`。
5. 点击“导入”。
6. 导入后页面会在账号名称下方显示 `auth.json` 里解析出的邮箱（如果存在），再点击刷新。

不要把 `auth.json` 发到公开聊天、Issue、论坛，或上传到不信任的服务器。

## 如何获取 Claude credentials.json

在已经登录 Claude Code 的电脑上找：

```txt
~/.claude/.credentials.json
```

说明：

- Linux/Windows(WSL)：明文文件 `~/.claude/.credentials.json`。
- macOS：凭据保存在钥匙串（服务名 `Claude Code-credentials`），需要先导出成同样结构的 JSON 文件再上传。
- 文件结构为 `{ "claudeAiOauth": { "accessToken": ..., "refreshToken": ..., "expiresAt": ... } }`。

导入步骤：

1. 在导入表单的“平台”里选择 `Claude`。
2. 填写账号名称，选择本机的 `.credentials.json`。
3. 点击“导入”，再点刷新。

服务器只保存加密后的凭据。Claude 的 access token 约 1 小时过期，QuotaDeck 会用 refresh token 自动刷新，并把轮换后的新凭据重新加密写回。

不要把 `.credentials.json` 发到公开聊天、Issue、论坛，或上传到不信任的服务器。

## Bark 推送通知

QuotaDeck 支持通过 [Bark](https://github.com/Finb/Bark)（iOS 推送 App）提醒额度状态。

### 快速上手

1. iPhone 在 App Store 搜索安装 **Bark**。
2. 打开 Bark，首页会显示一条形如 `https://api.day.app/abcd1234/` 的地址，其中 `abcd1234` 就是你的 **device key**（点一下可复制）。
3. 在 QuotaDeck 登录后展开“Bark 推送通知”：
   - **Bark 服务器地址**：用官方服务器就填 `https://api.day.app`（默认值）。
   - **Bark 设备 Key**：填上一步的 `abcd1234`。
   - **低额度阈值**：剩余百分比，默认 `20`（即剩余低于 20% 时提醒）。
   - 勾选需要的“通知时机”，并勾上最上面的“启用 Bark 推送”。
4. 点“保存”，再点“发送测试”，iPhone 收到一条 QuotaDeck 通知就说明配置成功。
5. 之后系统会按设置自动提醒，无需再手动操作。

每个用户在页面的“Bark 推送通知”里配置自己的：

- Bark 服务器地址（默认 `https://api.day.app`，自建服务器填自己的地址）。
- Bark 设备 Key。
- 低额度阈值（剩余百分比，默认 20%）。
- 通知时机：额度即将耗尽 / 已耗尽 / 已恢复 / 刷新失败（可分别开关）。

保存后可点“发送测试”验证。开启后，服务器会按 `BARK_MONITOR_INTERVAL_MS`（默认 5 分钟）定时刷新所有账号并在状态变化时推送，即使没有打开网页也能收到提醒。设为 `0` 可关闭服务端主动监控。

Bark 推送会把账号名称和额度状态发送到你配置的 Bark 服务器，请确认信任该服务器。

## 页面怎么用

页面在桌面和手机端都使用紧凑布局，方便同时查看更多账号和额度条。

顶部按钮：

- “刷新”：刷新当前用户的所有账号。
- “退出”：退出 QuotaDeck 本地账号。

账号卡片按钮：

- 账号名称下方会显示账号邮箱（Codex 从 `auth.json` 解析，Claude 在导入时刷新获取），方便区分多个账号。
- `↻`：只刷新这个账号。
- `×`：删除这个账号配置。删除前会二次确认，不会影响 Codex / Claude 本身。

状态数字：

- “账号”：当前导入的账号数量。
- “正常”：最近一次刷新成功的账号数量。
- “更新”：最近一次刷新返回的时间。

额度条：

- `5 小时额度`：Codex CLI TUI 里的 `5h limit`。
- `每周额度`：Codex CLI TUI 里的 `Weekly limit`。
- 当额度显示为 `100%` 剩余时，页面不显示重置时间；低于 `100%` 时会显示重置时间和距离重置还剩多久。
- 只有 `5 小时额度` 会把 Codex 返回的小于等于 `1%` 已用按原生 TUI 的观感显示为 `100%` 剩余；`每周额度` 按 Codex 返回值显示。

## 更新、备份和恢复

更新：

```bash
cd /srv/quota-deck
git pull
docker compose up -d --build
```

备份：

```bash
cd /srv/quota-deck
tar -czf quota-deck-backup-$(date +%Y%m%d-%H%M%S).tar.gz .env data
```

恢复：

```bash
cd /srv/quota-deck
tar -xzf quota-deck-backup-YYYYMMDD-HHMMSS.tar.gz
docker compose up -d
```

注意：如果 `.env` 里的 `APP_SECRET` 丢了，即使还有 `data/accounts.json`，也无法解密旧的 Codex 凭据。

## 常见问题

### 单个账号显示 401 Unauthorized

通常说明上传的 Codex 登录状态失效了。

处理办法：

1. 在本机重新登录 Codex CLI。
2. 重新上传新的 `auth.json`。
3. 删除旧账号配置。

### 证书申请失败

检查：

- 域名 A 记录是否指向 VPS IP
- VPS 的 80 和 443 端口是否开放
- 是否有宿主机 nginx/apache 占用了 80/443
- `.env` 里的 `DOMAIN` 是否写错

查看 Caddy 日志：

```bash
docker compose logs -f quota-deck-proxy
```

### 修改 APP_SECRET 后账号无法刷新

这是预期行为。旧凭据是用旧 `APP_SECRET` 加密的。

处理办法：

1. 恢复旧 `APP_SECRET`；或
2. 删除旧账号，重新上传 `auth.json`。

### 使用 Cloudflare 或其他 CDN

建议不要缓存 `/api/*`。额度数据和登录状态都是动态内容，缓存 API 响应会导致页面显示旧数据。

## 开发命令

语法检查：

```bash
node --check server.js
node --check public/app.js
```

开发模式：

```bash
APP_SECRET='dev-secret-change-me' ALLOW_REGISTRATION=1 npm run dev
```

Docker 构建：

```bash
docker compose up -d --build
```

## 许可证

本项目使用 `GPL-3.0-or-later`。完整许可证见 [LICENSE](./LICENSE)。

## 免责声明

QuotaDeck 是非官方项目，不代表 OpenAI 或 Anthropic。它依赖 Codex CLI 当前可用的本地登录状态和 RPC 行为；如果 Codex CLI 或 ChatGPT 后端接口变化，项目可能需要更新。
