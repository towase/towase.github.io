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
