// ▼ Webブラウザで正しく動くSDKに変更
import { GoogleGenerativeAI } from "@google/generative-ai";

// キーがあれば読み込むが、なくても強制しない
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface PresentationScript {
  slides: {
    title: string;
    content: string;
    visualImage: string;
    script: string;
  }[];
}

export const generatePresentationScript = async (moyamoya: string): Promise<PresentationScript> => {
  // APIキーがない場合の安全策（アプリを落とさない）
  if (!apiKey) {
    console.warn("APIキーが設定されていません。デモデータを返します。");
    return {
      slides: [
        {
          title: "APIキー未設定",
          content: "APIキーが設定されていないため、デモを表示しています。",
          visualImage: "設定アイコン",
          script: "これはデモ用のプレビューです。AI生成を利用するには環境変数の設定が必要です。"
        }
      ]
    };
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
    return {
      slides: [
        {
          title: "エラーが発生しました",
          content: "生成に失敗しました。",
          visualImage: "エラー",
          script: "システムエラーが発生しました。"
        }
      ]
    };
  }
};
