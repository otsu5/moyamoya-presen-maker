import { GoogleGenerativeAI } from "@google/generative-ai";

// 環境変数からキーを取得（なければ空文字）
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// ▼ 無料枠で十分使える高速モデルを指定
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface PresentationScript {
  slides: {
    title: string;
    content: string;
    visualImage: string;
    script: string;
  }[];
}

export const generatePresentationScript = async (moyamoya: string): Promise<PresentationScript> => {
  // キー未設定時の安全策
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。Cloud Runの変数設定を確認してください。");
  }

  try {
    const prompt = `
      あなたはプロのプレゼン構成作家です。
      以下の「もやもやした悩み」を元に、構成案をJSON形式でのみ出力してください。
      
      悩み: ${moyamoya}

      出力フォーマット:
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
    throw error;
  }
};
