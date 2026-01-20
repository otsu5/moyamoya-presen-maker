import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedPresentation } from '../types';

// 環境変数から API キーを取得（VITE_ プレフィックス必須）
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Warning: VITE_GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function generatePresentation(userInput: string): Promise<GeneratedPresentation> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
あなたはプレゼンテーション作成のプロフェッショナルです。
以下のもやもやした考えや悩みを、明確で説得力のあるプレゼンテーションに変換してください。

ユーザーの入力:
"""
${userInput}
"""

以下のJSON形式で出力してください（JSONのみ、他の説明は不要）:
{
  "title": "プレゼンテーションのタイトル",
  "slides": [
    {
      "title": "スライド1のタイトル",
      "content": "スライド1の内容（箇条書きや説明文）"
    },
    {
      "title": "スライド2のタイトル",
      "content": "スライド2の内容"
    }
  ]
}

スライドは3〜7枚程度で、以下の構成を意識してください：
1. タイトルスライド（問題提起）
2. 現状・背景
3. 課題・問題点
4. 解決策・提案
5. 期待される効果
6. まとめ・次のステップ
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSONを抽出してパース
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as GeneratedPresentation;
    }
    throw new Error('レスポンスからJSONを抽出できませんでした');
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('プレゼンテーションの生成に失敗しました。もう一度お試しください。');
  }
}
