# AGENTS.md

本文件适用于整个仓库。后续由 Codex 或其他自动化代理参与本项目时，必须遵守这里的约定。

## 项目概况

- 项目名：QuotaDeck
- 类型：自托管 Node.js Web 面板，通过 Codex CLI 读取账号额度。
- 运行要求：Node.js >= 20，生产部署优先使用 Docker Compose。
- 主要入口：
  - `server.js`：后端服务。
  - `public/`：前端静态资源。
  - `README.md`：简体中文主文档。
  - `docs/`：繁中、英文、日文文档。
  - `docker-compose.yml`、`Dockerfile`、`Caddyfile`：部署配置。

## 基本工作规则

- 默认使用中文和仓库维护者沟通。
- 称呼仓库维护者为“主人”。
- 与仓库维护者沟通时，每句话后面加“喵~”。
- 修改前先阅读相关文件，保持现有代码风格和项目结构。
- 不提交 `.env`、真实账号数据、Codex `auth.json`、token、密钥、Caddy 数据目录或任何敏感文件。
- 不覆盖用户未说明要修改的本地改动；提交前必须检查 `git status`。
- 变更应尽量小而明确，避免无关重构。

## 常用命令

```bash
npm start
npm run dev
docker compose up -d --build
```

本项目当前没有专门的测试脚本。涉及 JavaScript 修改时，至少执行语法检查：

```bash
node --check server.js
node --check public/app.js
```

如果修改了 Docker、Caddy 或部署相关配置，还应执行：

```bash
docker compose config
```

## 每次版本迭代后的强制收尾流程

每次完成一次功能、修复或发布版本迭代后，必须按顺序完成以下事项：

1. 整理文档
   - 根据实际变更更新 `README.md`。
   - 如果变更影响安装、部署、使用方式、界面文案、安全模型或常见问题，同步更新 `docs/README.zh-Hant.md`、`docs/README.en.md`、`docs/README.ja.md`。
   - 文档必须反映当前代码行为，不能只写计划中的功能。

2. 本地验证
   - 运行与本次修改相关的检查命令。
   - 检查 `git diff`，确认没有误提交敏感信息或无关文件。
   - 检查 `git status --short`，确认待提交内容只包含本次迭代需要的文件。

3. 上传 GitHub
   - 创建清晰的 commit。
   - 推送到 GitHub 远程仓库。
   - 默认远程为 `origin`，默认分支以当前分支为准，不要擅自切换分支。

   ```bash
   git status --short
   git add <changed-files>
   git commit -m "<clear change summary>"
   git push origin HEAD
   ```

4. 更新服务器版本
   - GitHub 推送成功后，更新服务器上的部署版本。
   - README 中约定的服务器目录为 `/srv/quota-deck`，更新命令如下：

   ```bash
   cd /srv/quota-deck
   git pull
   docker compose up -d --build
   ```

   - 如果需要通过 SSH 操作服务器，但当前环境没有服务器连接信息，必须向维护者索取 SSH 主机别名、用户名或连接命令。
   - 更新后检查容器状态，确认服务已重新启动：

   ```bash
   docker compose ps
   ```

## 发布前安全检查

- 确认 `.env` 没有被加入 Git。
- 确认 `data/accounts.json`、`caddy-data/`、`caddy-config/` 没有被加入 Git。
- 确认日志、截图、文档中没有出现 access token、refresh token、id token、`APP_SECRET` 或真实用户凭据。
- 涉及认证、加密、账号导入、额度刷新逻辑时，必须额外复查安全模型并更新文档。

## 服务器部署注意事项

- 不要在不知道服务器状态时执行破坏性命令。
- 不要删除服务器上的 `.env`、`data/`、`caddy-data/`、`caddy-config/`。
- 如果部署失败，先保留现场并收集：

```bash
docker compose ps
docker compose logs --tail=100 quota-deck
docker compose logs --tail=100 quota-deck-proxy
```

- 只有在维护者明确要求时，才执行清理镜像、删除数据卷、重建数据目录等高风险操作。
