
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  private model = 'gemini-3-flash-preview';

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async generateInitialScript(moyamoya: string): Promise<string> {
    const prompt = `あなたはプロのプレゼン構成ライターです。
ユーザーの断片的なメモ（もやもや）を読み解き、聴衆を惹きつける「5分間」のプレゼン原稿を作成してください。

【もやもやメモ】
${moyamoya}

【構成ルール】
以下の5セクション構成を厳守してください。話し言葉で、自然なトーンにしてください。

■ 導入（30秒）
聴衆の興味を引くフックから始めてください。
■ 背景・課題（1分）
なぜこの話をするのか、現在どんな問題があるのかを伝えてください。
■ 提案・解決策（2分30秒）
核心となるアイディアや提案を、最も時間をかけて説明してください。
■ 根拠・期待効果（1分）
なぜその提案が正しいのか、どんな良いことが起きるのかを説明してください。
■ 結び（30秒）
印象的なメッセージと共に、聴衆に取ってほしいアクションを伝えてください。`;

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
    });
    return response.text || "";
  }

  async generateQuestions(moyamoya: string, script: string): Promise<Question[]> {
    const prompt = `このプレゼン原稿をもっと「具体的」で「説得力のある」ものにするために、書き手（ユーザー）に聞くべき深掘り質問を3つから5つ作成してください。

【現在の原稿】
${script}

【質問のコツ】
- 数字、具体的な場所、固有名詞などを聞き出す。
- 聴衆が疑問に思いそうなポイントを突く。
- 過去の失敗談や成功体験など、ストーリーに深みが出る要素を聞く。

【出力形式】
JSON配列形式で出力してください。`;

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
            required: ["id", "question", "reason"]
          }
        }
      }
    });

    const questions: any[] = JSON.parse(response.text || "[]");
    return questions.map(q => ({ ...q, answer: "" }));
  }

  async updateScript(currentScript: string, qaPairs: Question[]): Promise<string> {
    const qaContext = qaPairs
      .filter(q => q.answer.trim() !== "")
      .map(q => `質問：${q.question}\n回答：${q.answer}`)
      .join("\n\n");

    const prompt = `以下の「追加情報（ユーザーの回答）」を、現在のプレゼン原稿の適切な場所に「具体的」に組み込んで、原稿を大幅に進化させてください。

【現在の原稿】
${currentScript}

【追加情報】
${qaContext}

【アップデートの指示】
1. 追加された情報を単に並べるのではなく、自然な文脈として原稿の中に溶け込ませてください。
2. 数字や具体的な名称がある場合は、必ず原稿内に明記してください。
3. 5セクションの構成（■の見出し）はそのまま維持してください。
4. 全体の長さは5分（約1500〜1800文字程度）をキープしてください。`;

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
    });
    return response.text || "";
  }
}
