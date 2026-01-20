// ★ 修正ポイント1: @google/genai → @google/generative-ai
// ★ 修正ポイント2: GoogleGenAI → GoogleGenerativeAI
import { GoogleGenerativeAI } from '@google/generative-ai';

// ★ 修正ポイント3: process.env → import.meta.env
// ★ 修正ポイント4: GEMINI_API_KEY → VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ★ 修正ポイント5: インスタンス生成方法
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generatePresentation(userInput: string) {
  // ★ 修正ポイント6: モデル取得方法
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
あなたはプレゼンテーション作成のプロです。
以下のもやもやした考えを、明確で説得力のあるプレゼンテーションに変換してください。

ユーザーの入力:
${userInput}

以下のJSON形式で出力してください:
{
  "title": "プレゼンテーションのタイトル",
  "slides": [
    {
      "title": "スライドのタイトル",
      "content": "スライドの内容（箇条書き可）"
    }
  ]
}
`;

  try {
    // ★ 修正ポイント7: API呼び出し方法
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSONをパース
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse response');
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
