# AGENTS.md

このファイルは、AI Agent がこのリポジトリで作業する際のガイドラインです。

## コマンド

```bash
pnpm install         # 依存関係インストール
pnpm dev             # 開発サーバ起動（http://localhost:3000）
pnpm build           # 本番ビルド（prerender → dist/client/、postbuild で .nojekyll 配置）
pnpm preview         # build 結果のローカル確認
pnpm test            # テスト（watch mode）
pnpm test:run        # テスト 1 回実行
pnpm typecheck       # TypeScript 型検査
pnpm lint            # Biome lint
pnpm format          # Biome format
```

## アーキテクチャ

TanStack Start（prerender 専用）ベースの静的ポートフォリオサイトで、GitHub Pages にデプロイされています。

- `content/` — Markdown ソース（index, about, career, behavior, manual）
- `src/routes/` — TanStack Router のファイルベースルート
- `src/components/` — React コンポーネント（NavBar, MarkdownRenderer）
- `src/lib/` — server function（loadMarkdown）
- `src/styles/` — グローバル CSS（PandaCSS の `@layer` 宣言）
- `src/router.tsx` — TanStack Router factory
- `panda.config.ts` — PandaCSS 設定（Park UI panda-preset、accent: blue, gray: slate）
- `vite.config.ts` — Vite 設定（tanstackStart の prerender 有効）
- `vitest.config.ts` — Vitest projects（node + browser/playwright）
- `.github/workflows/deploy.yml` — pnpm build → GitHub Pages デプロイ

**ワークフロー:** `content/` の md か `src/` のコードを編集 → コミット・push → GitHub Actions が自動でビルド・デプロイ。

## Git 運用

- Pull Request は作成せず、`main` に直接コミットして `origin/main` へ push する
- コミットメッセージは必ず英語で書く
- GitHub 上で公開されるタイトル・説明・コメントを作成する場合も英語で書く

## 主要技術スタック

- Framework: **TanStack Start**（prerender 専用構成）
- Router: **TanStack Router**（ファイルベース）
- Styling: **PandaCSS 0.48.0** + **Park UI panda-preset 0.43.1**（PandaCSS は 1.x にしないこと、Park UI 0.43.1 と非互換）
- Markdown: react-markdown + remark-gfm + rehype-slug + rehype-external-links
- Markdown 体裁: github-markdown-css（dark dimmed）
- Package manager: pnpm 9
- Node: 22 LTS（`.nvmrc`）
- Linter/Formatter: Biome 2
- Test: Vitest 4（node + browser projects）、browser は `@vitest/browser-playwright` provider

## ルート設計

| パス | コンテンツ | 備考 |
|------|-----------|------|
| `/` | `content/index.md` | ハブページ |
| `/about` | `content/about.md` | 自己紹介 |
| `/career` | `content/career.md` | 職務経歴 |
| `/behavior` | `content/behavior.md` | スタンス |
| `/manual` | `content/manual.md` | ワークスタイル |

`MarkdownRenderer` が `/` 始まりのリンクを `<Link>`（TanStack Router）に置換し、外部リンクは `rehype-external-links` で `target=_blank` を付与する。

## 職務経歴の2層管理

職務経歴は公開側（このリポジトリの `content/career.md`）と非公開側（private リポジトリ `towase/career-notes`）の2層で管理する。**ルールの正典は `career-notes/CLAUDE.md`**。成果の詳細（課題の背景・意思決定の経緯・実測値・面接想定問答）は必ず非公開側に置き、公開側には凝縮版のみを書く。

`content/career.md` を編集する際のルール:

- 各成果は **課題 → 意思決定 → 効果** の構成で書く。網羅より選別を優先する
- **社内の生数値・顧客名・パートナー名・社内 issue 番号を書かない**。実測値は比率・倍率に丸める（例: 「約9割削減」「実質2倍化」）
- 固有名詞は一般名詞メインで、技術の具体性が伝わる箇所のみ公開技術名（OSS・SaaS 名等）を残す
- 「主導」は自分がオーナーだった範囲にのみ使い、チーム決定は「チームで意思決定」「担当領域を完遂」と書く
- 各成果の末尾に、対応する career-notes の詳細ノートへのリンクを HTML コメントで張る（レンダリングには出ず、対応関係の維持が目的。private リポジトリなので第三者には 404）
- 新しい成果をまとめるときは career-notes（詳細）を先に書き、公開側はそこから要約して同期する。逆方向にしない
- 公開側を更新する前に、社内数値・顧客名が混入していないかを必ず確認する
