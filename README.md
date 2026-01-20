# もやもや→プレゼンメーカー

あなたのもやもやした考えを、伝わるプレゼンテーションに変換するWebアプリケーションです。

## 機能

- もやもやした考えや悩みをテキストで入力
- Gemini AIが自動的にプレゼンテーション構成を生成
- スライド形式で結果を表示

## ローカル開発

### 前提条件

- Node.js 18以上
- Gemini API Key ([Google AI Studio](https://makersuite.google.com/app/apikey)で取得)

### セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local を編集して VITE_GEMINI_API_KEY を設定
npm run dev
```

## Cloud Runへのデプロイ

1. Cloud Run → 「サービスを作成」
2. 「ソースリポジトリから継続的にデプロイ」を選択
3. **ビルドタイプ: 「Dockerfile」を選択**
4. 置換変数: `_VITE_GEMINI_API_KEY` を設定
5. リージョン: asia-northeast1 (Tokyo)

## 技術スタック

- React 18 / TypeScript / Vite
- Tailwind CSS (CDN)
- Google Generative AI (@google/generative-ai)
