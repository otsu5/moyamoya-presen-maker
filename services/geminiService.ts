import { GoogleGenerativeAI } from "@google/generative-ai";

// Vite標準の方法で環境変数を取得
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// キーがない場合は空文字で初期化（エラーは実行時にキャッチ）
const genAI = new GoogleGenerativeAI(apiKey || "");

// ▼▼▼ ご指定の最新モデル（Gemini 2.0 Flash）を設定 ▼▼▼
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface PresentationScript {
  slides: {
    title: string;
    content: string;
    visualImage: string;
    script: string;
  }[];
}

export const generatePresentationScript = async (moyamoya: string): Promise<PresentationScript> => {
  // 実行時にキーがない場合の明確なエラーハンドリング
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。環境変数 VITE_GEMINI_API_KEY を確認してください。");
  }

  try {
    const prompt = `
      あなたはプロのプレゼン構成作家です。
      以下の「もやもやした悩み」を元に、心を動かすプレゼンテーションの構成案を作成してください。
      出力は必ずJSON形式のみにしてください。
      
      悩み内容: ${moyamoya}

      JSONフォーマット:
      {
        "slides": [
          {
            "title": "タイトル",
            "content": "内容",
            "visualImage": "画像イメージ",
            "script": "セリフ"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSONが見つかりませんでした");
    
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("生成エラー:", error);
    throw error; // エラーをそのまま呼び出し元に伝え、画面に表示させる
  }
};
