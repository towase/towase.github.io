# AGENTS.md

このファイルは、AI Agent がこのリポジトリで作業する際のガイドラインです。

## コマンド

```bash
make build   # 静的HTMLを /docs/ に生成（ローカル確認用）
make serve   # ローカルプレビューサーバー（mdbook serve のラッパー）
```

## アーキテクチャ

**mdBook** ベースの静的ポートフォリオサイトで、GitHub Pages にデプロイされています。

- `src/` — Markdownソースファイル。`SUMMARY.md` がナビゲーション構造を定義
- `docs/` — ビルド出力（生成されたHTML）。`.gitignore` で除外済み
- `book.toml` — mdBook設定。言語は `ja`（日本語）、出力先は `docs/`
- `.github/workflows/deploy.yml` — GitHub Actions で mdbook build → GitHub Pages デプロイ

**ワークフロー:** `src/` のMarkdownを編集 → コミット・push → GitHub Actions が自動でビルド・デプロイ。

**重要:** `docs/` はコミット不要。GitHub Actions がビルドして直接 GitHub Pages にデプロイする。
