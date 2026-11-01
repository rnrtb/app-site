# mirai-study.com

みらい教育システム（代表 村田 飛翔 / むらつば）の公式サイトです。  
記事は Markdown（frontmatter 付き）で管理し、GitHub へ push すると Vercel 経由で公開する想定です。

旧ポートフォリオ: [むらつばのやったこと](https://mrtb.challenge-lab.com/)（WordPress）— Works へ移行中。

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
| `/` | トップ（事業の顔） |
| `/about` | みらい教育システムについて |
| `/works` | 作品一覧（Works / やったこと） |
| `/works/:slug` | 作品詳細 |
| `/people/:personId` | 人物ページ（紹介 + 関わった作品） |
| `/contact` | お問い合わせ導線 |

公開 URL: `https://mirai-study.com`  
（`academy.mirai-study.com` など塾・ツール系サブドメインとは役割を分けます）

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
categories: [ガジェット, ロボット競技]
credits:
  - id: mrtb
    role: コンセプト／回路
  - id: noa
    role: 設計／加工
thumbnail: /images/works/my-project.jpg
draft: false
---

本文を Markdown で書く。
```

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `title` | ○ | タイトル |
| `date` | ○ | `YYYY-MM-DD`（新しい順でソート） |
| `summary` | | 一覧用の短い説明 |
| `categories` | | カテゴリ（複数可。一覧表示・どれか選ぶと絞り込み） |
| `credits` | | 関わった人・ユニット（詳細ページ末尾で表示） |
| `thumbnail` | | `public/` からの絶対パス |
| `draft` | | `true` だと一覧・詳細から除外 |

トップのカテゴリボタン、または `/works?category=ガジェット` で絞り込めます。

### クレジット（人・ユニット）

`credits` の `id` は [`src/lib/people.ts`](src/lib/people.ts) に定義します。  
表示名はメインの呼び方（`name`）に統一され、別名は `aliases` で解決します。

名前を押すと `/people/{id}` へ移動します（例: `/people/mrtb`）。

作品ページでは、本文の `<!-- credits -->` の位置にクレジットを差し込みます（受賞歴のあと・リンクの前が基本）。

```markdown
---

受賞の一文

---

<!-- credits -->

---

- [関連リンク](https://example.com)
```

#### 人物ページを書く

1. `people.ts` に `id` / `name` / `aliases` を追加
2. 任意で `content/people/{id}.md` に紹介文を書く
3. 任意で写真を `public/images/people/` に置き、frontmatter の `image` で指定

例: `content/people/mrtb.md` → `/people/mrtb`（写真 + 紹介 + 関わった作品）

```markdown
---
title: むらつば
image: /images/people/mrtb.png
---
```

| id | 表示名 | 別名 |
| --- | --- | --- |
| `mrtb` | むらつば（ページ見出し: 村田 飛翔） | muratsuba, 村田 飛翔 |
| `hanachan` | はなちゃん | |
| `noa` | のあ | |
| `wakamesoup` | わかめすうぷ | |

`_` で始まる作品ファイル名（例: `_memo.md`）は公開対象外です。

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

### 動画埋め込み

本文に HTML を書けます。

YouTube（iframe）:

```html
<div class="embed-frame">
<iframe title="タイトル" src="https://www.youtube.com/embed/VIDEO_ID" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
</div>
```

ニコニコ（iframe。WordPress の script 埋め込みは SPA と相性が悪いので iframe を使う）:

```html
<div class="embed-frame">
<iframe title="タイトル" src="https://embed.nicovideo.jp/watch/smXXXXXXX" allowfullscreen loading="lazy"></iframe>
</div>
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

1. GitHub リポジトリ: `rnrtb/app-site`
2. Vercel でリポジトリを Import（Framework Preset: Vite、出力: `dist`）
3. `vercel.json` で SPA フォールバック済み（直接 `/works/...` にアクセスしても `index.html` を返す）
4. カスタムドメイン: `mirai-study.com`（および `www` があれば寄せる）
5. DNS は Cloudflare で Vercel 向けレコードを設定

### お問い合わせフォームの環境変数

`/api/contact`（Vercel Function）が Resend でメールを送ります。Turnstile の検証と、Upstash Redis による送信回数制限（同一接続元から 10 分間に 3 回まで、slidingWindow）を行います。
Vercel の Environment Variables（Production / Preview）に設定してください。

| 名前 | 内容 | 備考 |
| --- | --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile の Site Key | 公開値。ビルド時に埋め込まれるため、変更後は再デプロイ |
| `TURNSTILE_SECRET_KEY` | Turnstile の Secret Key | 秘密 |
| `RESEND_API_KEY` | Resend の API キー | 秘密 |
| `CONTACT_TO_EMAIL` | 受信先（`info@mirai-study.com`） | |
| `CONTACT_FROM_EMAIL` | 送信元（Resend で認証済みドメイン） | |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis | Marketplace 連携が自動設定。`KV_REST_API_URL` / `KV_REST_API_TOKEN` でも可 |
| `RATE_LIMIT_SECRET` | 接続元 IP を HMAC 化する秘密値 | 秘密。十分に長いランダム文字列 |

- 環境変数が欠けている場合は、送信せず 500 を返します（Redis の一時障害とは別扱い）。
- Redis に一時的に接続できない場合は、Turnstile 検証を通ったリクエストに限り回数制限だけをスキップします。
- ローカルで API まで確認するときは `vercel dev` を使います（`npm run dev` では `/api` は動きません）。

## 旧サイトからの移行方針

- **今:** 公式サイトの枠 + Works の記事運用を固める
- **後で:** `mrtb.challenge-lab.com` の記事を順次 Markdown 化して `content/works/` へ移す
- **リダイレクト:** 旧ドメイン / 旧パーマリンクからの転送は後対応（Cloudflare または旧ホスト側で設定予定）

## 既存エコシステムとの関係

| リポジトリ | 公開 URL | 役割 |
| --- | --- | --- |
| `app-site`（本リポ） | `mirai-study.com` | 公式サイト（About / Works / Contact） |
| `app-tools` | `tools.mirai-study.com` | ブラウザ向けツール |
| academy 系 | `academy.mirai-study.com` | みらい教育ラボ |
| `app-kanji` / `app-play` | 各サブドメイン | 別プロダクト |

`app-tools` フッター等からのリンク追加は、本リポジトリではなく `app-tools` 側で後から行います。

## 技術スタック

- React + TypeScript + Vite
- react-router-dom
- Markdown: `content/works/*.md` をビルド時に取り込み（`yaml` + `marked`）

## お問い合わせメール

Contact ページの mailto は仮です。運用アドレスが決まったら `src/pages/ContactPage.tsx` を更新してください。
