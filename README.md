# QuotaDeck

QuotaDeck 是一个自托管网页面板，用来查看 OpenAI Codex CLI TUI 里显示的两个额度：

- `5h limit`
- `Weekly limit`

它通过运行 `codex app-server --listen stdio://` 并调用 JSON-RPC 方法
`account/rateLimits/read` 读取同一份额度数据。

## 适合谁

适合想把自己的 Codex 额度放到一个网页里查看的人，尤其是：

- 有多个 Codex / ChatGPT Business / Pro 登录要看额度
- 想把面板部署到自己的 VPS
- 想用 Docker 管理服务，尽量不污染服务器全局环境
- 想让每个使用者自己注册、自己上传自己的 `auth.json`

不适合：

- 查看 OpenAI API 账单或 API token 用量
- 查看 Claude Pro 额度
- 在完全不信任的服务器上保存 Codex 登录状态

## 安全模型

QuotaDeck 会处理敏感的 Codex 登录文件，所以请先理解这些规则。

- 本站账号只保存在本地 JSON 数据文件里。
- 密码使用 `scrypt` 哈希保存，不保存明文密码。
- 上传的 Codex `auth.json` 会被校验，然后用 `APP_SECRET` 派生出的密钥通过 AES-256-GCM 加密保存。
- 刷新额度时，服务器才会把某个账号的凭据临时解密到 `/tmp` 里的临时 `CODEX_HOME`，调用 Codex CLI 后立即删除临时目录。
- 浏览器接口不会返回 Codex 邮箱、access token、refresh token、id token。
- 所有账号数据都带 `userId`，普通用户只能看到自己的导入账号。
- 没有管理员角色，只有一种用户。
- 注册是否开放由 `ALLOW_REGISTRATION` 控制。

重要限制：

- 只要你把 `auth.json` 上传到服务器，就必须信任这台服务器及其管理员。
- `APP_SECRET` 必须长期保持不变。换掉它之后，旧的加密凭据无法解密。
- 不再信任某台服务器时，请重新登录 Codex 或轮换 ChatGPT/Codex 登录状态，让旧凭据失效。

## 许可证

本项目使用 `GPL-3.0-or-later`。

也就是 GPLv3 或任何后续版本。没有正式的 GPLv4 许可证文本，所以不要写 `GPL-4.0`。标准写法是：

```txt
SPDX-License-Identifier: GPL-3.0-or-later
```

完整许可证见 [LICENSE](./LICENSE)。

## 文件说明

```txt
.
├── public/              # 前端页面、样式和浏览器逻辑
├── data/                # 运行时数据目录，真实数据不会提交到 git
├── server.js            # Node.js 后端
├── Dockerfile           # 应用镜像，包含 Codex CLI
├── docker-compose.yml   # 应用容器 + Caddy HTTPS 反代
├── Caddyfile            # Caddy 配置
├── .env.example         # 环境变量示例
└── LICENSE              # GPL-3.0-or-later
```

这些文件不要提交：

- `.env`
- `data/accounts.json`
- `data/users.json`
- `data/sessions.json`
- `caddy-data/`
- `caddy-config/`
- `node_modules/`

`.gitignore` 已经默认排除了它们。

## 本地运行

本地运行适合开发或先试试看。

准备条件：

- Node.js 20 或更新
- 已安装 Codex CLI，或者使用 Docker 方式运行

启动：

```bash
APP_SECRET='dev-secret-change-me' \
ALLOW_REGISTRATION=1 \
npm start
```

打开：

```txt
http://127.0.0.1:8787
```

第一次打开后：

1. 注册一个 QuotaDeck 本地账号。
2. 在自己的电脑上找到 Codex 登录文件。
3. 上传 `auth.json`。
4. 点击刷新查看额度。

## Docker 运行

推荐使用 Docker，避免把 Node、Caddy、Codex CLI 都装到宿主机全局环境。

复制环境变量文件：

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

查看状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f quota-deck
```

停止：

```bash
docker compose down
```

## VPS 部署

下面是假设你已经有一台 VPS，并且域名已经 A 到服务器 IP。

### 1. 准备目录

```bash
mkdir -p /srv/quota-deck
cd /srv/quota-deck
```

### 2. 上传代码

如果你是从 GitHub 拉取：

```bash
git clone https://github.com/YOUR_NAME/quota-deck.git /srv/quota-deck
cd /srv/quota-deck
```

如果你是从本地打包上传，也可以在本地项目目录运行：

```bash
tar \
  --exclude='./data/accounts.json' \
  --exclude='./data/users.json' \
  --exclude='./data/sessions.json' \
  --exclude='./node_modules' \
  --exclude='./.git' \
  --exclude='./caddy-data' \
  --exclude='./caddy-config' \
  -czf - . | ssh YOUR_SERVER 'mkdir -p /srv/quota-deck && tar -xzf - -C /srv/quota-deck'
```

### 3. 配置环境变量

```bash
cd /srv/quota-deck
cp .env.example .env
nano .env
```

示例：

```env
DOMAIN=quota.example.com
APP_SECRET=use-a-long-random-secret-here
ALLOW_REGISTRATION=1
```

`DOMAIN` 必须是你的真实域名。Caddy 会用它自动申请 HTTPS 证书。

### 4. 启动

```bash
docker compose up -d --build
```

打开：

```txt
https://quota.example.com
```

### 5. 创建自己的账号后关闭注册

公开网站强烈建议关闭注册。

```bash
cd /srv/quota-deck
sed -i 's/^ALLOW_REGISTRATION=.*/ALLOW_REGISTRATION=0/' .env
docker compose up -d
```

之后页面上不会再显示注册入口。

## 如何获取 Codex auth.json

在你的本机，也就是已经登录 Codex CLI 的电脑上找：

```txt
${CODEX_HOME:-$HOME/.codex}/auth.json
```

常见情况：

- Linux/macOS 默认路径：`~/.codex/auth.json`
- 如果你设置了 `CODEX_HOME`，就在 `$CODEX_HOME/auth.json`

可以用命令确认：

```bash
ls -l "${CODEX_HOME:-$HOME/.codex}/auth.json"
```

导入步骤：

1. 打开 QuotaDeck。
2. 登录你的 QuotaDeck 本地账号。
3. 在“账号名称”里填一个容易识别的名字，比如 `OpenAI Business`。
4. 选择本机的 `auth.json`。
5. 点击“导入”。
6. 导入后点击刷新。

不要把 `auth.json` 发到：

- GitHub Issue
- 公开聊天
- 论坛
- 不信任的人或服务器

## 页面怎么用

顶部按钮：

- “刷新”：刷新当前用户的所有账号。
- “退出”：退出 QuotaDeck 本地账号。

账号卡片按钮：

- `↻`：只刷新这个账号。
- `×`：删除这个账号配置，不会影响 Codex / ChatGPT 本身。

状态数字：

- “账号”：当前导入的账号数量。
- “正常”：最近一次刷新成功的账号数量。
- “更新”：最近一次成功或失败刷新返回的时间。

额度条：

- `5 小时额度`：Codex CLI TUI 里的 `5h limit`。
- `每周额度`：Codex CLI TUI 里的 `Weekly limit`。

## 更新项目

如果你是 git 部署：

```bash
cd /srv/quota-deck
git pull
docker compose up -d --build
```

如果你是本地打包上传，重新打包上传后运行：

```bash
cd /srv/quota-deck
docker compose up -d --build
```

## 备份和恢复

最重要的是 `data/` 和 `.env`。

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

## GitHub 开源发布

不要把 GitHub token 发到聊天里，也不要写进项目文件。

推荐用 GitHub CLI 的网页登录流程：

```bash
gh auth login
```

按提示选择：

1. `GitHub.com`
2. `HTTPS`
3. `Login with a web browser`
4. 复制终端显示的一次性 code，到浏览器里完成授权

检查登录状态：

```bash
gh auth status
```

创建公开仓库并推送：

```bash
gh repo create quota-deck --public --source=. --remote=origin --push
```

如果你已经在 GitHub 上手动创建了空仓库，也可以：

```bash
git remote add origin https://github.com/YOUR_NAME/quota-deck.git
git branch -M main
git push -u origin main
```

发布前检查：

```bash
git status --short
git log --oneline -5
git ls-files | grep -E '(^\\.env$|data/(accounts|users|sessions)\\.json)'
```

最后一条命令应该没有输出。如果有输出，说明敏感文件被纳入 git，需要先移除再发布。

## 常见问题

### 顶部刷新后显示等待刷新

先确认浏览器加载的是最新页面。可以强制刷新，或在 URL 后加版本参数：

```txt
https://quota.example.com/?v=latest
```

再看后端日志：

```bash
docker compose logs --tail=100 quota-deck
```

### 单个账号 401 Unauthorized

这通常说明上传的 Codex 登录状态失效了。

处理办法：

1. 在本机重新登录 Codex CLI。
2. 重新上传新的 `auth.json`。
3. 删除旧账号配置。

### 证书申请失败

检查：

- 域名 A 记录是否指向 VPS IP
- VPS 的 80 和 443 端口是否开放
- 是否有宿主机 nginx/apache 占用了 80/443
- `DOMAIN` 是否写错

查看 Caddy 日志：

```bash
docker compose logs -f quota-deck-proxy
```

### 修改 APP_SECRET 后账号无法刷新

这是预期行为。旧凭据是用旧 `APP_SECRET` 加密的。

处理办法：

1. 恢复旧 `APP_SECRET`；或
2. 删除旧账号，重新上传 `auth.json`。

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

## 免责声明

QuotaDeck 是非官方项目，不代表 OpenAI 或 Anthropic。它依赖 Codex CLI 当前可用的本地登录状态和 RPC 行为；如果 Codex CLI 或 ChatGPT 后端接口变化，项目可能需要更新。
