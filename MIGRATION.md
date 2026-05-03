# TanStack Start 移行ノート（WIP）

> このファイルは移行作業中の引き継ぎ用 WIP ファイル。**移行完了時に削除する**。

mdBook ベースの towase.github.io を React + TanStack Start に移行中。grill-me で設計合意 → 環境構築 + ファイル移動まで完了 → 中断（別 PC で再開予定）。

## 🚀 別セッションでの再開プロンプト

別 PC・別セッションで Claude Code を起動し、下記をそのまま貼って指示してください。

```
mdBook → TanStack Start 移行の続きをやってほしい。
ブランチ feat/migrate-to-tanstack-start の WIP commit からの再開。
リポジトリルートの MIGRATION.md に設計・進捗・残タスク・遭遇した問題が全部書いてある。

最初にやること:
1. git status で working tree がクリーンか確認
2. pnpm install で node_modules を整える
3. pnpm exec panda codegen で styled-system を生成
4. MIGRATION.md を最初から最後まで読む（設計の why と残タスクが全部入っている）
5. MIGRATION.md の「Phase A: 骨組みを動かす」から作業着手

守ること:
- PandaCSS は 0.48.0 のまま（1.x にしない。Park UI 0.43.1 と非互換）
- TDD（探索 → Red → Green → Refactor）で進める
- main 直コミット禁止、feat/migrate-to-tanstack-start ブランチ上で作業
- ローカルの post-tool-use hook が make build (mdBook) を走らせて失敗するが、
  tool 自体は成功する。気になるなら Phase F を前倒しして
  book.toml と Makefile を先に削除してもよい

終わるとき:
- MIGRATION.md を削除
- 旧 mdBook 関連（book.toml, Makefile, deploy.yml の mdBook ステップ）を削除
- PR を作る（PR Template があれば従う）

まず MIGRATION.md を読んでから着手してください。
```

## ゴール & 動機

- **主動機**: TanStack ファミリーを実戦投入する **学習目的の遊び場**
- **副動機**: 将来的にリッチな機能を足す余地を残す
- **非ゴール**: 採用文脈での見せ場 / 業務サイトとしての完成度

## 設計サマリ

| レイヤ | 採用 |
|-------|------|
| フレームワーク | **TanStack Start**（Nitro ベース、prerender 専用構成） |
| ルーティング | **TanStack Router**（ファイルベース、5 ルート明示列挙 prerender） |
| スタイリング | **PandaCSS 0.48.0** + **Park UI panda-preset 0.43.1** |
| マークダウン | **react-markdown** + `remark-gfm` / `rehype-slug` / `rehype-external-links` |
| md 体裁付け | **`github-markdown-css`** ベース + PandaCSS でトーン上書き |
| デザイン | **GitHub Dark Dimmed** 風、ダーク固定（`data-theme="dark"`） |
| パッケージマネージャ | **pnpm 9** |
| Node | **22 LTS** |
| Linter/Formatter | **Biome 2** |
| テスト | **Vitest 4 Browser Mode** + `vitest-browser-react` + Playwright provider（`@testing-library/react` は不採用） |
| ホスティング | **GitHub Pages**（`towase.github.io` ルート配信、base = `/`）。将来 Cloudflare Pages 等への移行余地あり |

## TanStack 採用範囲

- ✅ **TanStack Router / Start**
- ⛔ **TanStack Query / Form / Table / Virtual** ほか不採用（学習目的でも無理に入れると保守コストだけ残るため）
- ✅ **TanStack Devtools** は Router/Query 採用時に自動的に dev 専用で

## IA / ルート

```
/         content/index.md   現 README + ハブ
/about    content/about.md
/career   content/career.md  ページ内 TOC あり（唯一）
/behavior content/behavior.md
/manual   content/manual.md
```

- 上部ナビバーから 4 ページに直接リンク
- 検索・前後ナビ・サイドバー・印刷専用ページは **不採用**（将来余地）
- `<a>` の差し替え: 内部リンクは `<Link>`（Router）、外部リンクは `rehype-external-links` で `target=_blank`
- trailing slash なしを canonical（`/about`）

## 完了した作業（このコミットの内容）

### 設定ファイル

- `package.json` (pnpm scripts: dev, build, preview, test, typecheck, lint, format。`prepare`: `panda codegen`)
- `tsconfig.json` (strict + noUncheckedIndexedAccess + baseUrl + paths "~/*" → src/*)
- `biome.json` (Biome 2.4.14 schema、styled-system / routeTree.gen.ts 等を ignore)
- `.gitignore` 更新（node_modules, .output, styled-system, routeTree.gen.ts, docs 等を追加）
- `.nvmrc` (22)
- `.npmrc` (auto-install-peers, strict-peer-dependencies=false)
- `panda.config.ts` (Park UI preset 統合、accentColor: blue、grayColor: slate、radius: sm)
- `postcss.config.cjs` (panda init で自動生成)
- `vite.config.ts` (tanstackStart + viteReact プラグイン、prerender { enabled, autoSubfolderIndex, crawlLinks, failOnError } すべて true、alias `~` → src/)

### 依存関係（pnpm-lock.yaml に固定）

主要 dep: react 19.2.5 / react-dom 19.2.5 / react-markdown 10.1.0 / @tanstack/react-router 1.169.1 / @tanstack/react-start 1.167.61 / remark-gfm 4.0.1 / rehype-slug 6.0.0 / rehype-external-links 3.0.0 / github-markdown-css 5.9.0 / @ark-ui/react 5.36.2 / lucide-react 1.14.0

開発 dep: vite 8.0.10 / @vitejs/plugin-react 6.0.1 / typescript 6.0.3 / @types/react 19.2.14 / @types/react-dom 19.2.3 / @types/node 25.6.0 / **@pandacss/dev 0.48.0**（重要、下記参照）/ @park-ui/cli 1.0.1 / @park-ui/panda-preset 0.43.1 / @biomejs/biome 2.4.14 / vitest 4.1.5 / @vitest/browser 4.1.5 / vitest-browser-react 2.2.0 / playwright 1.59.1

### ファイル構造の移行

- `src/about.md` → `content/about.md`
- `src/behavior.md` → `content/behavior.md`
- `src/career.md` → `content/career.md`
- `src/manual.md` → `content/manual.md`
- `src/README.md` → `content/index.md`
- `src/SUMMARY.md` → 削除
- `src/assets/*.png` → `public/assets/*.png`
- 空ディレクトリ作成: `src/routes/` `src/components/` `src/lib/`
- `src/styles/index.css` 作成（`@layer reset, base, tokens, recipes, utilities;`）

## 遭遇した問題と解決（重要：忘れると同じ罠を踏む）

### 問題 1: PandaCSS 1.10.0 と Park UI preset 0.43.1 の非互換

- 当初 `@pandacss/dev@1.10.0` を install したが `createPreset` が `Cannot read properties of undefined (reading 'replace')` で codegen 失敗
- **解決**: PandaCSS を `0.48.0` にダウングレード（Park UI 0.43.1 が dev-dep として使うバージョン）
- ⚠️ **PandaCSS を latest に戻さないこと**。Park UI が PandaCSS 1.x 対応版を出すまで 0.48.x 系で固定

### 問題 2: Park UI `createPreset` の API は文字列ではなくオブジェクト

```ts
// ❌ 動かない
createPreset({ accentColor: 'blue', grayColor: 'slate' })

// ✅ 正解
import blue from '@park-ui/panda-preset/colors/blue'
import slate from '@park-ui/panda-preset/colors/slate'
createPreset({ accentColor: blue, grayColor: slate, radius: 'sm' })
```

- 公式ドキュメントには古い情報が混ざるので、`node_modules/@park-ui/panda-preset/dist/options-*.d.ts` の型定義を信頼
- 有効な grayColor: `neutral / mauve / olive / sage / sand / slate`
- 有効な accentColor: `neutral / tomato / red / ruby / crimson / pink / plum / purple / violet / iris / indigo / blue / cyan / teal / jade / green / grass / bronze / gold / brown / orange / amber / yellow / lime / mint / sky`

### 問題 3: `@park-ui/cli init` は対話的で stdin pipe に対応せず

- @clack/prompts 系は raw TTY 必須。`printf '\n\n' | park-ui init` でプロンプト通過できない
- **解決**: CLI を使わず、`@park-ui/panda-preset` を install して `panda.config.ts` に直接 preset を書く方式に切替
- `npx @park-ui/cli add <component>` も同様に対話的。必要なコンポーネントは手動で書くか、ユーザー側ターミナルで実行する

### 問題 4: tsconfig.json で `paths` を使うなら `baseUrl` も必須

- Park UI が要求。`"baseUrl": "."` を追加済み

## 残タスク（再開時のチェックリスト）

### Phase A: 骨組みを動かす

1. `src/router.tsx` 作成（`createRouter` のエクスポート + `Register` interface 拡張）
2. `src/routes/__root.tsx` 作成（`createRootRoute` + html shell + `<HeadContent />` + `<Scripts />` + `data-theme="dark"`）
3. `src/routes/index.tsx` 作成（最小、"Hello" 程度）
4. `pnpm dev` 起動確認 → `routeTree.gen.ts` が自動生成されるはず
5. `localhost:3000` で `/` が表示されれば OK

### Phase B: md ローダ + 5 ルート

1. `src/lib/loadMarkdown.ts` 作成
   - 候補 1: `createServerFn` + `node:fs/promises.readFile`（**推奨**：plan の動機「loader 学習」に忠実）
   - 候補 2: `import.meta.glob('/content/*.md', { query: '?raw', eager: true })`（簡単だが loader 学習要素薄）
   - 最新 `createServerFn` API は WebFetch で確認: `https://tanstack.com/start/latest/docs/framework/react/server-functions`
2. `src/components/MarkdownRenderer.tsx` 作成
   - `react-markdown` + `remark-gfm` + `rehype-slug` + `rehype-external-links`
   - `components.a` で内部リンク（`/` 始まり）は `<Link to>`、外部リンクは素の `<a>` + `target=_blank`
3. 5 ルートファイル作成
   - `src/routes/index.tsx`（既存を置き換え、`content/index.md` ロード）
   - `src/routes/about.tsx` / `career.tsx` / `behavior.tsx` / `manual.tsx`
   - 各 loader で対応する md を読み、`MarkdownRenderer` に渡す

### Phase C: ナビバー + スタイル

1. `src/components/NavBar.tsx`（5 ルートへのリンク）
2. `src/routes/__root.tsx` でナビバーを描画
3. `github-markdown-css/github-markdown-dark.css` をどこかで import
4. PandaCSS で GitHub Dark Dimmed トーンの調整（必要なら semanticTokens 上書き）

### Phase D: テスト

1. `vitest.config.ts` 作成（browser mode + playwright provider）
2. `pnpm exec playwright install chromium` でブラウザバイナリ取得
3. テスト対象:
   - md ローダの正常系（content/about.md が読める）
   - 内部リンク差し替え（`/about` → `<Link>`）
   - 外部リンク差し替え（`https://...` → `target=_blank`）
   - 5 ルートが描画される

### Phase E: デプロイ + .nojekyll

1. `.github/workflows/deploy.yml` を新ワークフローに書き換え
   - `actions/checkout@v4`
   - `actions/setup-node@v4` (`node-version-file: .nvmrc`, `cache: pnpm`)
   - `pnpm/action-setup@v4`
   - `pnpm install --frozen-lockfile`
   - `pnpm build`
   - **`.nojekyll` を出力ディレクトリに生成**（postbuild script で `touch .output/public/.nojekyll` 等）
   - `actions/upload-pages-artifact@v3` (path: ビルド出力先)
   - `actions/deploy-pages@v4`
2. ビルド出力先は `.output/public/` の想定（要確認、`pnpm build` 後に `ls .output/` で確認）
3. prerender が 5 ルート全てを HTML 化しているか確認

### Phase F: ドキュメント + 旧 mdBook 削除

1. `book.toml` 削除
2. `Makefile` 削除
3. `README.md` 更新（mdBook 文言 → React/TanStack）
4. `AGENTS.md` 更新（pnpm コマンド、`docs/` 言及削除）
5. `CLAUDE.md` は `@AGENTS.md` 参照のままで OK
6. **この `MIGRATION.md` を削除**

### PR

- 1 PR で big bang、もしくは 4 サブ PR（骨組み / md ローダ + 1 ルート / 残り 4 ルート / deploy.yml）
- PR Template があるか確認、あれば従う

## 設計上の主要トレードオフ（記録）

- TanStack Start を GitHub Pages 静的縛りで使う: SSR/サーバー関数を学べないが、`loader` とファイルベースルーティングは触れる
- TanStack Query/Form/Table を入れない: 「TanStack 積極採用」と言いつつ実は Router/Start 中心。無理に入れて保守コストを払うより筋が良い判断
- Park UI + PandaCSS: Tailwind より学習コスト高、ただし zero-runtime と型安全のメリット
- `github-markdown-css` 流用: recipe 自作の学習機会は減るが、デザイントーン実現コストは桁違いに低い

## 将来余地（明示的に「今やらない」）

ダークモード切替 / 検索（Pagefind 等）/ TanStack Query / Form / Table / MDX 化 / 独自ドメイン / Cloudflare Pages 移行 / `career.md` の TanStack Table 化
