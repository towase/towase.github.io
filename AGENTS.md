# AGENTS.md

このファイルは、AI Agent がこのリポジトリで作業する際のガイドラインです。

## コマンド

```bash
make build   # 静的HTMLを /docs/ に生成
make serve   # ローカルプレビューサーバー（mdbook serve のラッパー）
```

## アーキテクチャ

**mdBook** ベースの静的ポートフォリオサイトで、GitHub Pages にデプロイされています。

- `src/` — Markdownソースファイル。`SUMMARY.md` がナビゲーション構造を定義
- `docs/` — ビルド出力（生成されたHTML）。GitHub Pages 配信のためリポジトリにコミットする
- `book.toml` — mdBook設定。言語は `ja`（日本語）、出力先は `docs/`
- `index.html` — ルートから `./docs/index.html` へのリダイレクト

**ワークフロー:** `src/` のMarkdownを編集 → `make build` で `docs/` を再生成 → 両方をコミット。

**重要:** `src/` 配下のファイルを編集したら、必ず `make build` を実行して `docs/` を再生成すること。

`docs/` ディレクトリはビルド成果物だが、GitHub Pages がここから配信するためコミットが必要。
