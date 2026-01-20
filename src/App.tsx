import React, { useState } from 'react';
import { GeneratedPresentation, Slide } from './types';
import { generatePresentation } from './services/geminiService';

function App() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [presentation, setPresentation] = useState<GeneratedPresentation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError('もやもやを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPresentation(null);

    try {
      const result = await generatePresentation(userInput);
      setPresentation(result);
      setCurrentSlideIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    if (presentation && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          もやもや→プレゼンメーカー
        </h1>
        <p className="text-white/80 text-center mb-8">
          あなたのもやもやを、伝わるプレゼンに変換します
        </p>

        {/* 入力エリア */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            あなたのもやもやを教えてください
          </label>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="例：新しいプロジェクトを提案したいけど、どう説明すればいいかわからない..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            className={`mt-4 w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 active:scale-98'
            }`}
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                プレゼン作成中...
              </span>
            ) : (
              'プレゼンを作成する ✨'
            )}
          </button>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* プレゼンテーション表示 */}
        {presentation && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* タイトル */}
            <div className="bg-gray-800 text-white p-4">
              <h2 className="text-xl font-bold">{presentation.title}</h2>
              <p className="text-gray-300 text-sm">
                スライド {currentSlideIndex + 1} / {presentation.slides.length}
              </p>
            </div>

            {/* スライド表示 */}
            <div className="p-8 min-h-[300px] flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {presentation.slides[currentSlideIndex].title}
              </h3>
              <div className="text-gray-600 whitespace-pre-wrap">
                {presentation.slides[currentSlideIndex].content}
              </div>
            </div>

            {/* ナビゲーション */}
            <div className="bg-gray-100 p-4 flex justify-between items-center">
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentSlideIndex === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
              >
                ← 前へ
              </button>
              <div className="flex gap-2">
                {presentation.slides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlideIndex
                        ? 'bg-purple-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => setCurrentSlideIndex(index)}
                  />
                ))}
              </div>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentSlideIndex === presentation.slides.length - 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                onClick={nextSlide}
                disabled={currentSlideIndex === presentation.slides.length - 1}
              >
                次へ →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
