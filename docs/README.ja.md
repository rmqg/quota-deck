# QuotaDeck

**言語**：[简体中文](../README.md) | [繁體中文](README.zh-Hant.md) | [English](README.en.md) | 日本語

QuotaDeck は、OpenAI Codex CLI TUI に表示される次の 2 つの制限を確認するためのセルフホスト型 Web ダッシュボードです。

- `5h limit`
- `Weekly limit`

`codex app-server --listen stdio://` を実行し、JSON-RPC メソッド `account/rateLimits/read` を呼び出して同じ制限データを読み取ります。

## 対象ユーザー

向いている用途：

- 複数の Codex / ChatGPT ログインアカウントがあり、制限をまとめて確認したい
- 自分の VPS にデプロイしたい
- ホスト環境を汚さず Docker でサービスを管理したい
- 各ユーザーが自分で登録し、自分の Codex ログインファイルをアップロードできるようにしたい

向いていない用途：

- OpenAI API の請求や API token 使用量の確認
- Claude Pro の制限確認
- 信頼していないサーバーへの Codex ログイン状態の保存

## セキュリティモデル

QuotaDeck は機密性の高い Codex ログインファイルを扱います。使用前に次のルールを理解してください。

- QuotaDeck のローカルアカウントはローカルのデータディレクトリに保存されます。
- パスワードは `scrypt` ハッシュとして保存されます。平文パスワードは保存されません。
- アップロードされた Codex `auth.json` は検証後、`APP_SECRET` から派生した鍵で AES-256-GCM 暗号化されて保存されます。
- 制限を更新するときだけ、サーバーは対象アカウントの認証情報を `/tmp` 配下の一時 `CODEX_HOME` に一時的に復号し、Codex CLI を呼び出した後すぐに一時ディレクトリを削除します。
- ブラウザー API は access token、refresh token、id token を返しません。
- インポートされた各アカウントは QuotaDeck ユーザーに紐づきます。ユーザーは自分がインポートしたアカウントだけを表示できます。
- 管理者ロールはありません。ユーザーロールは 1 種類だけです。
- 登録を許可するかどうかは `ALLOW_REGISTRATION` で制御します。

重要な制限：

- `auth.json` をサーバーにアップロードする以上、そのサーバーと管理者を信頼する必要があります。
- `APP_SECRET` は長期的に維持する必要があります。変更すると既存の暗号化済み認証情報は復号できません。
- サーバーを信頼しなくなった場合は、Codex に再ログインするか ChatGPT/Codex のログイン状態をローテーションして、古い認証情報を無効化してください。

## クイックスタート

Docker の利用を推奨します。

```bash
cp .env.example .env
```

`.env` を編集します：

```env
DOMAIN=quota.example.com
APP_SECRET=replace-with-a-long-random-secret
ALLOW_REGISTRATION=1
```

強い `APP_SECRET` を生成する例：

```bash
openssl rand -base64 48
```

起動：

```bash
docker compose up -d --build
```

開く：

```txt
https://quota.example.com
```

ローカルで試すだけなら、Node を直接実行することもできます。

```bash
APP_SECRET='dev-secret-change-me' \
ALLOW_REGISTRATION=1 \
npm start
```

ローカル URL：

```txt
http://127.0.0.1:8787
```

## VPS デプロイ

必要なもの：

- Docker と Docker Compose がインストールされた VPS
- VPS の IP を指す A レコードを持つドメイン
- VPS の 80 番と 443 番ポートの開放

デプロイ手順：

```bash
git clone https://github.com/rmqg/quota-deck.git /srv/quota-deck
cd /srv/quota-deck
cp .env.example .env
nano .env
docker compose up -d --build
```

`.env` の例：

```env
DOMAIN=quota.example.com
APP_SECRET=use-a-long-random-secret-here
ALLOW_REGISTRATION=1
```

`DOMAIN` には実際のドメインを設定してください。Caddy はこのドメインを使って HTTPS 証明書を自動取得します。

自分のアカウントを作成した後は、公開登録を無効化することを推奨します。

```bash
cd /srv/quota-deck
sed -i 's/^ALLOW_REGISTRATION=.*/ALLOW_REGISTRATION=0/' .env
docker compose up -d
```

## Codex auth.json の取得方法

Codex CLI にログイン済みのコンピューターで、次のファイルを探します。

```txt
${CODEX_HOME:-$HOME/.codex}/auth.json
```

一般的なパス：

- Linux/macOS のデフォルトパス：`~/.codex/auth.json`
- `CODEX_HOME` を設定している場合：`$CODEX_HOME/auth.json`

次のコマンドで確認できます。

```bash
ls -l "${CODEX_HOME:-$HOME/.codex}/auth.json"
```

インポート手順：

1. QuotaDeck を開きます。
2. QuotaDeck のローカルアカウントを登録またはログインします。
3. 「アカウント名」に識別しやすい名前を入力します。例：`OpenAI Business`
4. ローカルの `auth.json` を選択します。
5. 「インポート」をクリックします。
6. インポート後に更新します。

`auth.json` を公開チャット、Issue、フォーラム、信頼していないサーバーに送らないでください。

## ページの使い方

上部ボタン：

- 「更新」：現在のユーザーの全アカウントを更新します。
- 「ログアウト」：QuotaDeck のローカルアカウントからログアウトします。

アカウントカードのボタン：

- `↻`：このアカウントだけを更新します。
- `×`：このアカウント設定を削除します。Codex / ChatGPT 本体には影響しません。

ステータス数値：

- 「アカウント」：現在インポートされているアカウント数。
- 「正常」：直近の更新に成功したアカウント数。
- 「更新」：直近の更新が返した時刻。

制限バー：

- `5時間制限`：Codex CLI TUI の `5h limit`。
- `週間制限`：Codex CLI TUI の `Weekly limit`。

## 更新、バックアップ、復元

更新：

```bash
cd /srv/quota-deck
git pull
docker compose up -d --build
```

バックアップ：

```bash
cd /srv/quota-deck
tar -czf quota-deck-backup-$(date +%Y%m%d-%H%M%S).tar.gz .env data
```

復元：

```bash
cd /srv/quota-deck
tar -xzf quota-deck-backup-YYYYMMDD-HHMMSS.tar.gz
docker compose up -d
```

注意：`.env` の `APP_SECRET` を失うと、`data/accounts.json` が残っていても既存の Codex 認証情報は復号できません。

## FAQ

### 単一アカウントが 401 Unauthorized を表示する

通常は、アップロードした Codex ログイン状態が失効しています。

対処方法：

1. ローカル環境で Codex CLI に再ログインします。
2. 新しい `auth.json` を再アップロードします。
3. 古いアカウント設定を削除します。

### 証明書の取得に失敗する

確認項目：

- ドメインの A レコードが VPS の IP を指しているか
- VPS の 80 番と 443 番ポートが開いているか
- ホスト上の nginx/apache が 80/443 を使用していないか
- `.env` の `DOMAIN` が間違っていないか

Caddy ログの確認：

```bash
docker compose logs -f quota-deck-proxy
```

### APP_SECRET を変更した後にアカウントを更新できない

これは想定された動作です。既存の認証情報は古い `APP_SECRET` で暗号化されています。

対処方法：

1. 古い `APP_SECRET` を復元する；または
2. 古いアカウントを削除し、`auth.json` を再アップロードする。

### Cloudflare または他の CDN を使う場合

`/api/*` はキャッシュしないでください。制限データとログイン状態は動的コンテンツです。API レスポンスをキャッシュすると、ページに古いデータが表示される可能性があります。

## 開発コマンド

構文チェック：

```bash
node --check server.js
node --check public/app.js
```

開発モード：

```bash
APP_SECRET='dev-secret-change-me' ALLOW_REGISTRATION=1 npm run dev
```

Docker ビルド：

```bash
docker compose up -d --build
```

## ライセンス

このプロジェクトは `GPL-3.0-or-later` を使用しています。全文は [LICENSE](../LICENSE) を参照してください。

## 免責事項

QuotaDeck は非公式プロジェクトであり、OpenAI または Anthropic を代表するものではありません。Codex CLI で現在利用可能なローカルログイン状態と RPC 動作に依存しています。Codex CLI または ChatGPT のバックエンドインターフェイスが変更された場合、このプロジェクトにも更新が必要になる可能性があります。
