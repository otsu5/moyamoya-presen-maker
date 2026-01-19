
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Question, PresentationData } from './types';
import { GeminiService } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'moyamoya_v3_draft';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    moyamoya: '',
    script: '',
    questions: [],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isGenerating: false,
    error: null,
    apiKey: '',
  });

  const [activeStep, setActiveStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初回ロード
  useEffect(() => {
    const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as PresentationData;
        setState(prev => ({ ...prev, ...parsed }));
        if (parsed.script) setActiveStep(2);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  // 保存
  useEffect(() => {
    const { moyamoya, script, questions, version, createdAt, updatedAt } = state;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      moyamoya, script, questions, version, createdAt, updatedAt
    }));
  }, [state.moyamoya, state.script, state.questions]);

  const handleError = (msg: string) => {
    setState(prev => ({ ...prev, error: msg }));
    setTimeout(() => setState(prev => ({ ...prev, error: null })), 5000);
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const generateInitial = async () => {
    if (!state.moyamoya.trim()) {
      handleError("今の「もやもや」を教えてくださいね。");
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const gemini = new GeminiService();
      const script = await gemini.generateInitialScript(state.moyamoya);
      const questions = await gemini.generateQuestions(state.moyamoya, script);
      
      setState(prev => ({
        ...prev,
        script,
        questions,
        updatedAt: new Date().toISOString(),
        isGenerating: false
      }));
      setActiveStep(2);
      showToast("原稿ができました！");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      handleError("原稿の生成に失敗しました。もう一度試してみてください。");
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleUpdate = async () => {
    const hasAnyAnswer = state.questions.some(q => q.answer.trim() !== "");
    if (!hasAnyAnswer) {
      handleError("質問に回答を入力してから「磨き上げる」を押してください。");
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const gemini = new GeminiService();
      const updatedScript = await gemini.updateScript(state.script, state.questions);
      
      setState(prev => ({
        ...prev,
        script: updatedScript,
        updatedAt: new Date().toISOString(),
        isGenerating: false
      }));
      showToast("内容を反映して、原稿がさらに進化しました！");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      handleError("原稿の更新に失敗しました。");
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleAnswerChange = (id: number, value: string) => {
    setState(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, answer: value } : q)
    }));
  };

  const handleDownload = () => {
    const { script } = state;
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `プレゼン原稿_${new Date().toLocaleDateString()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-white pb-32 text-slate-800">
      {/* Notifications */}
      {state.error && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-rose-50 text-rose-600 px-8 py-4 rounded-2xl shadow-xl border border-rose-100 font-bold animate-in fade-in zoom-in">
          ⚠️ {state.error}
        </div>
      )}
      {successMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-50 text-emerald-600 px-8 py-4 rounded-2xl shadow-xl border border-emerald-100 font-bold animate-in fade-in zoom-in">
          ✅ {successMessage}
        </div>
      )}

      {/* Header */}
      <header className="max-w-4xl mx-auto pt-20 pb-16 px-6 text-center">
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
          もやもや → プレゼン
        </h1>
        <p className="text-2xl text-slate-400 font-medium">
          あなたの想いを、心に届くストーリーへ。
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-6 space-y-20">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center max-w-sm mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 bg-white border-2 ${activeStep >= s ? 'border-blue-500 text-blue-500 shadow-md scale-110' : 'border-slate-100 text-slate-300'}`}>
              {s}
            </div>
          ))}
        </div>

        {/* STEP 1: MoyaMoya Input */}
        <section className={`transition-all duration-500 ${activeStep === 1 ? 'opacity-100' : 'opacity-30 pointer-events-none grayscale'}`}>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-blue-500">01.</span> もやもやを書き出す
            </h2>
            <textarea
              value={state.moyamoya}
              onChange={(e) => setState(prev => ({ ...prev, moyamoya: e.target.value }))}
              placeholder="あなたの頭の中にあるアイディアや、解決したい課題を、箇条書きでもなんでも良いので自由に書いてください..."
              className="w-full min-h-[300px] p-8 text-2xl leading-relaxed bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none placeholder:text-slate-300"
            />
            <button 
              onClick={generateInitial}
              disabled={state.isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white text-2xl font-bold py-8 rounded-[2rem] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-4 active:scale-95"
            >
              {state.isGenerating ? <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"></div> : "原稿を自動生成する"}
            </button>
          </div>
        </section>

        {/* STEP 2: Script Result */}
        {state.script && (
          <section className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-emerald-500">02.</span> 生成された原稿案
              </h2>
              <button 
                onClick={handleDownload}
                className="text-slate-400 hover:text-blue-500 font-bold transition-colors"
              >
                📥 原稿をダウンロード
              </button>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-2xl shadow-slate-200/50 space-y-12">
              {state.script.split('■').filter(s => s.trim()).map((part, i) => (
                <div key={i} className="group">
                  <div className="text-blue-500 font-black text-xl mb-4 tracking-wider">
                    ■ {part.split('\n')[0]}
                  </div>
                  <p className="text-2xl leading-[1.8] text-slate-700 font-medium whitespace-pre-wrap">
                    {part.split('\n').slice(1).join('\n').trim()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STEP 3: Improvement Q&A */}
        {state.questions.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-amber-500">03.</span> 原稿をより具体的に磨く
            </h2>
            <div className="bg-amber-50 rounded-[3rem] p-10 border border-amber-100 space-y-10">
              <p className="text-xl text-amber-800 font-medium">以下の質問に答えると、AIがあなたの回答を原稿の中に具体的に反映させ、より説得力のある内容に修正します。</p>
              
              <div className="space-y-12">
                {state.questions.map((q) => (
                  <div key={q.id} className="space-y-4">
                    <div className="text-2xl font-bold text-slate-800 flex items-start gap-4">
                      <span className="text-amber-400 font-black shrink-0">Q.</span>
                      {q.question}
                    </div>
                    <input 
                      type="text"
                      value={q.answer}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="回答を入力..."
                      className="w-full p-6 text-2xl bg-white border-2 border-amber-100 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-50 outline-none transition-all shadow-sm"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={handleUpdate}
                disabled={state.isGenerating}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white text-2xl font-bold py-8 rounded-[2rem] shadow-xl shadow-amber-200 transition-all active:scale-95 flex items-center justify-center gap-4"
              >
                {state.isGenerating ? "更新中..." : "回答を反映して原稿を磨き上げる"}
              </button>
            </div>
          </section>
        )}

        {/* Reset Button */}
        <div className="flex justify-center pt-10">
          <button 
            onClick={() => {
              if (confirm('最初からやり直しますか？（入力した内容は消去されます）')) {
                setState(prev => ({ ...prev, moyamoya: '', script: '', questions: [] }));
                setActiveStep(1);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
              }
            }}
            className="text-slate-300 hover:text-rose-400 font-bold transition-colors text-lg"
          >
            データをリセットして最初から
          </button>
        </div>
      </main>

      <footer className="py-20 text-center text-slate-200 font-bold tracking-widest uppercase text-sm">
        Moyamoya Presentation Maker
      </footer>
    </div>
  );
};

export default App;
