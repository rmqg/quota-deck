# QuotaDeck

**语言**：简体中文 | [繁體中文](docs/README.zh-Hant.md) | [English](docs/README.en.md) | [日本語](docs/README.ja.md)

QuotaDeck 是一个自托管网页面板，用来查看 OpenAI Codex CLI TUI 中显示的两个额度：

- `5h limit`
- `Weekly limit`

它通过运行 `codex app-server --listen stdio://` 并调用 JSON-RPC 方法 `account/rateLimits/read` 读取同一份额度数据。

## 适合谁

适合：

- 有多个 Codex / ChatGPT 登录账号，需要集中查看额度
- 想部署到自己的 VPS
- 想用 Docker 管理服务，避免污染宿主机环境
- 想让每个用户自己注册、自己上传自己的 Codex 登录文件

不适合：

- 查看 OpenAI API 账单或 API token 用量
- 查看 Claude Pro 额度
- 在不信任的服务器上保存 Codex 登录状态

## 安全模型

QuotaDeck 会处理敏感的 Codex 登录文件，请先理解这些规则：

- 本站账号保存在本地数据目录里。
- 密码使用 `scrypt` 哈希保存，不保存明文密码。
- 上传的 Codex `auth.json` 会被校验，然后使用 `APP_SECRET` 派生出的密钥通过 AES-256-GCM 加密保存。
- 刷新额度时，服务器才会把某个账号的凭据临时解密到 `/tmp` 下的临时 `CODEX_HOME`，调用 Codex CLI 后立即删除临时目录。
- 浏览器接口不会返回 access token、refresh token、id token。
- 每个导入账号都绑定 QuotaDeck 用户，用户只能看到自己的导入账号。
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
6. 导入后点击刷新。

不要把 `auth.json` 发到公开聊天、Issue、论坛，或上传到不信任的服务器。

## 页面怎么用

顶部按钮：

- “刷新”：刷新当前用户的所有账号。
- “退出”：退出 QuotaDeck 本地账号。

账号卡片按钮：

- `↻`：只刷新这个账号。
- `×`：删除这个账号配置。删除前会二次确认，不会影响 Codex / ChatGPT 本身。

状态数字：

- “账号”：当前导入的账号数量。
- “正常”：最近一次刷新成功的账号数量。
- “更新”：最近一次刷新返回的时间。

额度条：

- `5 小时额度`：Codex CLI TUI 里的 `5h limit`。
- `每周额度`：Codex CLI TUI 里的 `Weekly limit`。
- 页面只显示剩余百分比，不显示 Codex 返回的滚动窗口重置时间；5 小时窗口在未明显使用时可能返回类似“当前查询时间 + 5 小时”的时间，容易误解。
- 当 Codex 返回的已用百分比小于等于 `1%` 时，页面按原生 TUI 的观感显示为 `100%` 剩余。

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
