# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## 参加申込

トップページの「参加する」と「LOVOTオフ会に参加する」は、公開済みの
Googleフォームへ直接遷移します。回答管理はGoogleフォームに接続した
回答先スプレッドシートで行います。

## NFCでの当日チェックイン

受付ページ: `https://neginasu.github.io/ochakai/checkin`

受付に置く共通NFCタグに、このURLをWebリンクとして書き込みます。
参加者はスマートフォンでタグを読み取り、申し込み時のオーナー名だけを入力します。
トップページのフッターからも開けます。

GitHub Pages内にApps Scriptの受付フォームを埋め込みます。
参加者名簿やGoogleの認証情報をブラウザやリポジトリに配置せず、
照合・更新はApps Script側だけで行います。シート自体の一般公開は不要です。

### 初回の接続設定

1. Google Apps Scriptの受付プロジェクトに `apps-script/Code.gs` を保存します。
   `SETTINGS.spreadsheetId` と `SETTINGS.sheetId` が受付用シートと一致することを確認します。
   必要に応じて、プロジェクト設定でマニフェストを表示して
   `apps-script/appsscript.json` の設定を反映します。
2. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選び、
   実行ユーザーを「自分」、アクセスできるユーザーを「全員」にして公開します。
   公開者によるGoogleの権限承認が必要です。
   `openById` 用の権限は、そのアカウントのスプレッドシート全体を対象とするものですが、
   このコードは設定したシートのA列だけを更新します。
3. 公開結果の `https://script.google.com/macros/s/…/exec` をコピーし、
   GitHubの Settings → Secrets and variables → Actions → Variables に
   **CHECKIN_WEB_APP_URL** というリポジトリ変数で登録します。
   このURLは公開フォームの場所です。認証トークンや秘密鍵は登録しません。
4. Actionsの「Deploy Nuxt to GitHub Pages」を手動実行するか、mainへ変更を反映します。
   変数の変更だけでは、既存の静的ページは再生成されません。
5. `/ochakai/checkin` をログアウト状態のスマートフォンで確認します。
   初回の書き込みテストには、受付シートに管理者が用意したテスト用の名前を使います。
   実在の参加者を事前に受付済みにしないでください。

接続URLが未設定または不正な場合、受付ページは「受付の準備中です」と表示し、
入力・受付完了の表示は行いません。端末が埋め込み表示を制限する場合に備え、
設定後はフォームを別画面で開くリンクも表示します。
Apps Script更新時は「デプロイを管理」から既存デプロイを新しいバージョンに更新すると、
GitHub側に設定したURLを維持できます。

### 受付の動作

- 「シート1」（sheetId: `533590447`）のB列をオーナー名として照合します。先頭行もデータです。
- 空白・全角半角・英字の大文字小文字の差を吸収し、一致する行が1つのときだけA列のチェックを入れます。
- 同名が複数行ある場合は、チェック済みの有無にかかわらず更新せず、スタッフ確認を案内します。
- 登録なし・二重受付・設定不整合・通信エラーを区別します。参加者一覧は表示しません。
- 標準のTRUE/FALSEチェックボックスのみ更新し、数式セルは上書きしません。
- スクリプトロックで同時送信を制御し、ページを開くだけでは受付しません。
- 名前のみの照合のため、本人確認や会場への物理的な来場の証明を行う仕組みではありません。

動作確認: `npm run test:checkin`（実際のGoogleシートへの書き込みなし）

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
