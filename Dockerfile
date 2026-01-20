FROM node:20-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# ビルド時に環境変数を受け取る（重要！）
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# ビルド実行
RUN npm run build

# ポート8080で起動
EXPOSE 8080
CMD ["npm", "run", "start"]
