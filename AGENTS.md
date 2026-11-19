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

- `content/` — Markdown ソース（index, about, career, principles, working-with-me）
- `src/routes/` — TanStack Router のファイルベースルート
- `src/components/` — React コンポーネント（NavBar, MarkdownRenderer）
- `src/lib/` — server function（loadMarkdown）
- `src/styles/` — グローバル CSS（PandaCSS の `@layer` 宣言）
- `src/router.tsx` — TanStack Router factory
- `panda.config.ts` — PandaCSS 設定（Park UI panda-preset、accent: blue, gray: slate）
- `vite.config.ts` — Vite 設定（tanstackStart の prerender 有効）
- `vitest.config.ts` — Vitest projects（node + browser/playwright）
- `.github/workflows/deploy.yml` — pnpm build → GitHub Pages デプロイ
- `.github/workflows/ci.yml` — PR と `main` push で lint → build → typecheck → test を実行
- `renovate.json` — Renovate 設定（依存関係の自動更新・自動マージ）

**ワークフロー:** `content/` の md か `src/` のコードを編集 → コミット・push → GitHub Actions が自動でビルド・デプロイ。

## Git 運用

- Pull Request は作成せず、`main` に直接コミットして `origin/main` へ push する（Renovate が作る依存更新 PR は例外）
- コミットメッセージは必ず英語で書く
- GitHub 上で公開されるタイトル・説明・コメントを作成する場合も英語で書く

## 依存関係の更新（Renovate）

- 毎週月曜 9:00 JST 前に Renovate が更新 PR を作成し、CI が通れば自動マージする（npm の minor/patch、GitHub Actions は全て）
- major 更新は PR のみ作成し、手動でレビュー・マージする
- `@pandacss/dev` と `@park-ui/panda-preset` の major 更新は無効（PandaCSS 1.x は Park UI 0.43.1 と非互換）
- 脆弱性の修正はスケジュールを無視して即時 PR が作られる
- `pnpm typecheck` は `pnpm build` が生成する `src/routeTree.gen.ts` に依存するため、CI では build → typecheck の順で実行する

## 主要技術スタック

- Framework: **TanStack Start**（prerender 専用構成）
- Router: **TanStack Router**（ファイルベース）
- Styling: **PandaCSS 0.48.1** + **Park UI panda-preset 0.43.1**（PandaCSS は 1.x 以降にしないこと、Park UI 0.43.1 と非互換）
- Markdown: react-markdown + remark-gfm + rehype-slug + rehype-external-links
- Markdown 体裁: github-markdown-css（dark dimmed）
- Package manager: pnpm 9
- Node: 22 LTS（`.nvmrc`）
- Linter/Formatter: Biome 2
- Test: Vitest 5（node + browser projects）、browser は `@vitest/browser-playwright` provider

## ルート設計

| パス               | コンテンツ                   | 備考             |
| ------------------ | ---------------------------- | ---------------- |
| `/`                | `content/index.md`           | ハブページ       |
| `/about`           | `content/about.md`           | 自己紹介         |
| `/career`          | `content/career.md`          | 職務経歴         |
| `/principles`      | `content/principles.md`      | 原則             |
| `/working-with-me` | `content/working-with-me.md` | 一緒に働くうえで |

`MarkdownRenderer` が `/` 始まりのリンクを `<Link>`（TanStack Router）に置換し、外部リンクは `rehype-external-links` で `target=_blank` を付与する。

## 職務経歴の2層管理

職務経歴は公開側（このリポジトリの `content/career.md`）と非公開側（private リポジトリ `towase/career-notes`）の2層で管理する。**2層管理ルールの正典は `career-notes/CLAUDE.md`**。成果の詳しい経緯・社内の実測値・面接想定問答は必ず非公開側に置く。公開側は下記の記述方針に応じた情報量にまとめ、重要な案件では公開できる範囲で背景・課題・判断も具体的に記載する。

職務経歴書の構成・詳細度・執筆・レビューは、[職務経歴書の記述方針](career-writing-policy.md)に従う。`content/career.md` を編集する前に必ず読む。GigaCastを詳細版・最重点、カミナシ レポートを詳細版とし、その他の案件は同方針の分類を基準にする。詳細度は応募先に応じて調整してよい。

`content/career.md` を編集する際のルール:

- 応募先に伝えたい経験や強みに応じて案件ごとの情報量にメリハリをつけ、文字数を減らすこと自体を目的にしない
- 各成果の文数・テーマ数・セクション構成は、記述方針の「詳細版」「中程度」「簡略版」に従う
- **背景・課題 → 技術的な判断 → 実施内容 → 結果** は、詳細版の重要な成果を具体的に伝える観点とする。すべての成果に同じ書式を強制しない。詳しい経緯は非公開ノートに残す
- **社内の生数値・顧客名・パートナー名・社内 issue 番号を書かない**。実測値は比率・倍率に丸める（例: 「約9割削減」「実質2倍化」）
- 固有名詞は一般名詞メインで、技術の具体性が伝わる箇所のみ公開技術名（OSS・SaaS 名等）を残す
- 「主導」は自分がオーナーだった範囲にのみ使い、チーム決定は「チームで意思決定」「担当領域を完遂」と書く
- 各成果の末尾に、対応する career-notes の詳細ノートへのリンクを HTML コメントで張る（レンダリングには出ず、対応関係の維持が目的。private リポジトリなので第三者には 404）
- 新しい成果をまとめるときは career-notes（詳細）を先に書き、公開側はそこから要約して同期する。逆方向にしない
- 公開側を更新する前に、社内数値・顧客名が混入していないかを必ず確認する
