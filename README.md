# works.mirai-study.com

村田飛翔（mrtb）のポートフォリオ「Works / やったこと」です。  
記事は Markdown（frontmatter 付き）で管理し、GitHub へ push すると Vercel 経由で公開する想定です。

旧サイト: [むらつばのやったこと](https://mrtb.challenge-lab.com/)（WordPress）— 本リポジトリへ移行中。

## 開発環境・起動

```bash
npm install
npm run dev
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | ローカル開発サーバ |
| `npm run build` | 型チェック + 本番ビルド（`dist/`） |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint` | oxlint |

## URL 構成

| パス | 内容 |
| --- | --- |
| `/` | 作品一覧（サイトの顔） |
| `/works/:slug` | 作品詳細 |
| `/about` | 自己紹介（著者: 村田飛翔 / mrtb） |
| `/contact` | お問い合わせ導線 |

公開 URL: `https://works.mirai-study.com`  
（`mirai-study.com/works` 配下や `tools` 配下には置きません）

## 記事の増やし方

新しい作品 = Markdown ファイルを追加して push するだけです。

### 1. ファイルを追加

`content/works/` に `{slug}.md` を作成します。  
ファイル名（拡張子除く）が URL の slug になります。

例: `content/works/my-project.md` → `/works/my-project`

### 2. frontmatter

ファイル先頭に YAML frontmatter を書きます。

```markdown
---
title: 作品タイトル
date: 2025-11-16
summary: 一覧カード用の短い説明
tags: [ロボコン, タイマー]
thumbnail: /images/works/my-project.svg
draft: false
---

本文を Markdown で書く。
```

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `title` | ○ | タイトル |
| `date` | ○ | `YYYY-MM-DD`（新しい順でソート） |
| `summary` | | 一覧用の短い説明 |
| `tags` | | タグ配列 |
| `thumbnail` | | `public/` からの絶対パス |
| `draft` | | `true` だと一覧・詳細から除外 |

`_` で始まるファイル名（例: `_draft-example.md`）も公開対象外です。

### 3. 画像の置き場所

| 用途 | 置き場所 | 参照方法 |
| --- | --- | --- |
| サムネイル・本文画像 | `public/images/works/` | `/images/works/ファイル名` |

例:

```text
public/images/works/my-project.jpg
```

frontmatter:

```yaml
thumbnail: /images/works/my-project.jpg
```

本文:

```markdown
![説明](/images/works/my-project-detail.jpg)
```

### 4. 公開

```bash
git add content/works public/images/works
git commit -m "Add work: my-project"
git push
```

Vercel がビルドするとサイトに反映されます。

サンプル記事:

- `content/works/robocon-timer-2025.md`
- `content/works/nazotoki-50cm.md`

## デプロイ

既存の `app-tools` などと同様の想定です。

1. GitHub リポジトリ: `rnrtb/app-works`
2. Vercel でリポジトリを Import（Framework Preset: Vite、出力: `dist`）
3. `vercel.json` で SPA フォールバック済み（直接 `/works/...` にアクセスしても `index.html` を返す）
4. カスタムドメイン: `works.mirai-study.com`
5. DNS は Cloudflare で Vercel 向けレコードを設定

## 旧サイトからの移行方針

- **今:** 枠とサンプル 1〜2 本。運用（MD 追加 → push）を先に固める
- **後で:** `mrtb.challenge-lab.com` の記事を順次 Markdown 化して `content/works/` へ移す
- **リダイレクト:** 旧ドメイン / 旧パーマリンクからの転送は後対応（Cloudflare または旧ホスト側で設定予定）

## 既存エコシステムとの関係

| リポジトリ | 公開 URL | 役割 |
| --- | --- | --- |
| `app-works`（本リポ） | `works.mirai-study.com` | ポートフォリオ |
| `app-tools` | `tools.mirai-study.com` | ブラウザ向けツール |
| `app-kanji` / `app-play` | 各サブドメイン | 別プロダクト |

`app-tools` フッター等からのリンク追加は、本リポジトリではなく `app-tools` 側で後から行います。

## 技術スタック

- React + TypeScript + Vite
- react-router-dom
- Markdown: `content/works/*.md` をビルド時に取り込み（`yaml` + `marked`）

## お問い合わせメール

Contact ページの mailto は仮です。運用アドレスが決まったら `src/pages/ContactPage.tsx` を更新してください。
