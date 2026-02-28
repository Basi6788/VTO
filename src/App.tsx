import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, User, ShoppingBag, Sparkles, Download, RefreshCw, CheckCircle2, AlertCircle, Zap, Activity, Timer, Menu, X, Palette, Layout, FileSearch, Image as ImageIcon, Video, Music, Send, Terminal, CheckCircle, ServerCrash, Network, Clock, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { processVTO, generateLogo, generateUIDesign, analyzeMedia, logService, LogEntry } from './services/geminiService';

export default function App() {
  const [currentApp, setCurrentApp] = useState<'vto' | 'logo' | 'ui' | 'analyzer'>('vto');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isApiOpen, setIsApiOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logTab, setLogTab] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    const unsubscribe = logService.subscribe(setLogs);
    return unsubscribe;
  }, []);

  const selectApp = (app: 'vto' | 'logo' | 'ui' | 'analyzer') => {
    setCurrentApp(app);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Decorative background bubbles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-300/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-violet-300/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[20%] w-72 h-72 bg-blue-300/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Header */}
      <header className="puffy-card mx-6 mt-6 px-8 py-4 flex items-center justify-between z-10 relative bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="bubble-icon bg-gradient-to-br from-pink-400 to-violet-500 text-white p-2 rounded-full shadow-lg border-2 border-white/50">
            {currentApp === 'vto' && <Sparkles className="w-6 h-6" />}
            {currentApp === 'logo' && <Palette className="w-6 h-6" />}
            {currentApp === 'ui' && <Layout className="w-6 h-6" />}
            {currentApp === 'analyzer' && <FileSearch className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight gradient-text">
              {currentApp === 'vto' && 'VTO BUBBLE'}
              {currentApp === 'logo' && 'LOGO FORGE'}
              {currentApp === 'ui' && 'UI DESIGNER'}
              {currentApp === 'analyzer' && 'MEDIA ANALYZER'}
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">AI Studio Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsApiOpen(true)}
            className="pill-btn bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-3 flex items-center gap-2 shadow-lg border-4 border-indigo-400"
          >
            <Code className="w-5 h-5" />
            <span className="font-bold hidden sm:inline">API</span>
          </button>
          <button 
            onClick={() => setIsLogsOpen(true)}
            className="pill-btn bg-slate-800 text-white hover:bg-slate-700 px-4 py-3 flex items-center gap-2 shadow-lg border-4 border-slate-700"
          >
            <Terminal className="w-5 h-5" />
            <span className="font-bold hidden sm:inline">Network Flow</span>
          </button>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="pill-btn bg-white text-slate-700 border-4 border-slate-100 hover:border-pink-200 hover:text-pink-500 px-4 py-3 flex items-center gap-2"
          >
            <Menu className="w-5 h-5" />
            <span className="font-bold hidden sm:inline">Menu</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {currentApp === 'vto' && <motion.div key="vto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><VTOEngine /></motion.div>}
          {currentApp === 'logo' && <motion.div key="logo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><LogoEngine /></motion.div>}
          {currentApp === 'ui' && <motion.div key="ui" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><UIEngine /></motion.div>}
          {currentApp === 'analyzer' && <motion.div key="analyzer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><AnalyzerEngine /></motion.div>}
        </AnimatePresence>
      </main>

      {/* Puffy Menu Overlay Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="w-full max-w-lg p-8 relative flex flex-col gap-4 bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl border-4 border-white/50"
            >
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-pink-500 shadow-sm border-2 border-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-slate-700">Bubble Menu</h2>
                <p className="text-sm font-bold text-slate-400 mt-1">Select an AI Engine</p>
              </div>
              
              <MenuButton icon={<Sparkles/>} title="VTO Bubble" desc="Virtual Try-On Engine (Super Fast)" onClick={() => selectApp('vto')} active={currentApp === 'vto'} color="pink" />
              <MenuButton icon={<Palette/>} title="Logo Forge" desc="Iterative AI Logo Generator" onClick={() => selectApp('logo')} active={currentApp === 'logo'} color="violet" />
              <MenuButton icon={<Layout/>} title="UI/UX Designer" desc="App & Website Mockups" onClick={() => selectApp('ui')} active={currentApp === 'ui'} color="blue" />
              <MenuButton icon={<FileSearch/>} title="Media Analyzer" desc="Extract Prompts from Video/Audio/Image" onClick={() => selectApp('analyzer')} active={currentApp === 'analyzer'} color="emerald" />
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logs Overlay Modal */}
      <AnimatePresence>
        {isLogsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="w-full max-w-4xl h-[85vh] flex flex-col bg-slate-900 text-slate-300 rounded-[3rem] shadow-2xl border-4 border-slate-700 overflow-hidden relative"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 text-emerald-400">
                    <Network className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Network Flow</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live API Requests & Status</p>
                  </div>
                </div>
                <button onClick={() => setIsLogsOpen(false)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 p-4 bg-slate-800/50 border-b border-slate-800">
                <button onClick={() => setLogTab('all')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${logTab === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>All Flow</button>
                <button onClick={() => setLogTab('success')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${logTab === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Success (Req/Res)</button>
                <button onClick={() => setLogTab('failed')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${logTab === 'failed' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Failed & Crashes</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950">
                {logs.filter(l => logTab === 'all' || (logTab === 'success' && l.status === 'success') || (logTab === 'failed' && l.status === 'error')).length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600">
                    <Terminal className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-bold">No network logs yet.</p>
                  </div>
                ) : (
                  logs.filter(l => logTab === 'all' || (logTab === 'success' && l.status === 'success') || (logTab === 'failed' && l.status === 'error')).map(log => (
                    <div key={log.id} className={`p-5 rounded-3xl border-2 ${log.status === 'success' ? 'border-emerald-500/20 bg-emerald-500/5' : log.status === 'error' ? 'border-red-500/20 bg-red-500/5' : 'border-blue-500/20 bg-blue-500/5'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {log.status === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : log.status === 'error' ? <ServerCrash className="w-5 h-5 text-red-500" /> : <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
                          <span className="font-black text-white">{log.engine}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : log.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{log.status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleTimeString()}
                          {log.duration && <span className="ml-2 text-slate-400">{log.duration}ms</span>}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm font-mono">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider">Request Payload:</span>
                          <span className="text-blue-300 break-words">{JSON.stringify(log.requestData, null, 2)}</span>
                        </div>
                        {log.responseData && (
                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider">Response:</span>
                            <span className="text-emerald-300 break-words">{JSON.stringify(log.responseData, null, 2)}</span>
                          </div>
                        )}
                        {log.errorMessage && (
                          <div className="bg-slate-900 p-3 rounded-xl border border-red-900/30">
                            <span className="text-red-500 block mb-1 text-xs uppercase tracking-wider">Crash / Error:</span>
                            <span className="text-red-400 break-words">{log.errorMessage}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Endpoints Overlay Modal */}
      <AnimatePresence>
        {isApiOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900/60 backdrop-blur-xl p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="w-full max-w-3xl max-h-[85vh] flex flex-col bg-white text-slate-700 rounded-[3rem] shadow-2xl border-4 border-indigo-200 overflow-hidden relative"
            >
              <div className="p-6 border-b border-indigo-100 flex items-center justify-between bg-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-indigo-200 text-white shadow-lg">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-indigo-900">API Endpoints</h2>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Connect from other apps</p>
                  </div>
                </div>
                <button onClick={() => setIsApiOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors shadow-sm border-2 border-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
                <div className="puffy-card p-6 bg-white">
                  <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-500" /> Virtual Try-On (VTO)
                  </h3>
                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-sm overflow-x-auto mb-4">
                    POST {window.location.origin}/api/vto
                  </div>
                  <div className="bg-slate-100 p-4 rounded-2xl font-mono text-xs text-slate-600 overflow-x-auto">
                    <span className="text-slate-400 block mb-2">// Request Body (JSON)</span>
                    {`{
  "personImage": "data:image/png;base64,...",
  "productImage": "data:image/png;base64,...",
  "prompt": "Make the shirt oversized" // Optional
}`}
                  </div>
                </div>

                <div className="puffy-card p-6 bg-white">
                  <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-violet-500" /> Logo Generator
                  </h3>
                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-sm overflow-x-auto mb-4">
                    POST {window.location.origin}/api/logo
                  </div>
                  <div className="bg-slate-100 p-4 rounded-2xl font-mono text-xs text-slate-600 overflow-x-auto">
                    <span className="text-slate-400 block mb-2">// Request Body (JSON)</span>
                    {`{
  "prompt": "A modern tech startup named 'Aero'"
}`}
                  </div>
                </div>

                <div className="puffy-card p-6 bg-white">
                  <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-blue-500" /> UI/UX Designer
                  </h3>
                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-sm overflow-x-auto mb-4">
                    POST {window.location.origin}/api/ui
                  </div>
                  <div className="bg-slate-100 p-4 rounded-2xl font-mono text-xs text-slate-600 overflow-x-auto">
                    <span className="text-slate-400 block mb-2">// Request Body (JSON)</span>
                    {`{
  "prompt": "A modern e-commerce store for sneakers",
  "type": "Website", // or "App"
  "device": "Desktop" // or "Mobile"
}`}
                  </div>
                </div>

                <div className="puffy-card p-6 bg-white">
                  <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-emerald-500" /> Media Analyzer
                  </h3>
                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-sm overflow-x-auto mb-4">
                    POST {window.location.origin}/api/analyze
                  </div>
                  <div className="bg-slate-100 p-4 rounded-2xl font-mono text-xs text-slate-600 overflow-x-auto">
                    <span className="text-slate-400 block mb-2">// Request Body (JSON)</span>
                    {`{
  "file": "data:video/mp4;base64,...",
  "mimeType": "video/mp4"
}`}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Menu Button Component ---
function MenuButton({ icon, title, desc, onClick, active, color }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, active: boolean, color: string }) {
  const colorClasses: Record<string, string> = {
    pink: 'from-pink-400 to-pink-500 border-pink-200 text-pink-600 bg-pink-50',
    violet: 'from-violet-400 to-violet-500 border-violet-200 text-violet-600 bg-violet-50',
    blue: 'from-blue-400 to-blue-500 border-blue-200 text-blue-600 bg-blue-50',
    emerald: 'from-emerald-400 to-emerald-500 border-emerald-200 text-emerald-600 bg-emerald-50',
  };

  const activeClass = active ? `border-4 shadow-lg ${colorClasses[color].split(' ')[0]} bg-gradient-to-r text-white` : `border-4 border-transparent hover:border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100`;
  const iconBg = active ? 'bg-white/20 text-white' : `bg-white shadow-sm ${colorClasses[color].split(' ')[2]}`;

  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-[2rem] flex items-center gap-4 text-left transition-all ${activeClass}`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-black text-lg ${active ? 'text-white' : 'text-slate-700'}`}>{title}</h3>
        <p className={`text-sm font-bold ${active ? 'text-white/80' : 'text-slate-400'}`}>{desc}</p>
      </div>
      {active && <CheckCircle2 className="w-6 h-6 ml-auto text-white" />}
    </button>
  );
}

// --- VTO Engine Component ---
function VTOEngine() {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turboMode, setTurboMode] = useState(false);
  const [activeThreads, setActiveThreads] = useState(0);

  const personInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const simulateTurboQueue = async () => {
    const totalSimulated = 100000000;
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 5000000);
      if (current >= totalSimulated) {
        clearInterval(interval);
        setActiveThreads(totalSimulated);
      } else {
        setActiveThreads(current);
      }
    }, 100);
  };

  const handleProcess = async () => {
    if (!personImage || !productImage) {
      setError("Please upload both a person image and a product image.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setResultImage(null);
    
    if (turboMode) simulateTurboQueue();

    try {
      const result = await processVTO({ personImage, productImage, prompt: prompt.trim() || undefined });
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || "An error occurred during processing.");
    } finally {
      setIsProcessing(false);
      setActiveThreads(0);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `vto-result-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5 space-y-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-black text-slate-700">Inputs</h2>
          <button 
            onClick={() => setTurboMode(!turboMode)}
            className={`pill-btn px-4 py-2 text-xs flex items-center gap-2 ${turboMode ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-4 border-white/30' : 'bg-white text-slate-600 border-4 border-white/60'}`}
          >
            <Zap className="w-3 h-3" />
            {turboMode ? 'Turbo: ON' : 'Turbo: OFF'}
          </button>
        </div>

        <section className="puffy-card p-8 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500"><User className="w-5 h-5" /></div>
            <h2 className="text-xl font-extrabold text-slate-700">1. Character</h2>
          </div>
          <div onClick={() => personInputRef.current?.click()} className={`relative aspect-[3/4] rounded-[2.5rem] border-4 border-dashed transition-all cursor-pointer overflow-hidden group ${personImage ? 'border-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.3)]' : 'border-pink-200 hover:border-pink-400 bg-white/40'}`}>
            {personImage ? <img src={personImage} className="w-full h-full object-cover" alt="Person" /> : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Upload className="w-8 h-8 text-pink-400" /></div>
                <p className="text-base font-bold text-slate-600">Upload person photo</p>
              </div>
            )}
            <input type="file" ref={personInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setPersonImage)} />
          </div>
        </section>

        <section className="puffy-card p-8 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-500"><ShoppingBag className="w-5 h-5" /></div>
            <h2 className="text-xl font-extrabold text-slate-700">2. Product</h2>
          </div>
          <div onClick={() => productInputRef.current?.click()} className={`relative aspect-square rounded-[2.5rem] border-4 border-dashed transition-all cursor-pointer overflow-hidden group ${productImage ? 'border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.3)]' : 'border-violet-200 hover:border-violet-400 bg-white/40'}`}>
            {productImage ? <img src={productImage} className="w-full h-full object-contain p-4" alt="Product" /> : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Upload className="w-8 h-8 text-violet-400" /></div>
                <p className="text-base font-bold text-slate-600">Upload product photo</p>
              </div>
            )}
            <input type="file" ref={productInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setProductImage)} />
          </div>
        </section>

        <section className="puffy-card p-8 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-700">3. Magic Prompt</h2>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="E.g., Make the shirt look slightly oversized..." className="puffy-input w-full p-6 resize-none h-32 text-base font-medium text-slate-700 placeholder:text-slate-400" />
        </section>

        <button onClick={handleProcess} disabled={isProcessing || !personImage || !productImage} className="pill-btn pill-btn-primary w-full py-6 text-xl disabled:opacity-50 disabled:cursor-not-allowed">
          {isProcessing ? <><RefreshCw className="w-6 h-6 animate-spin" /> Generating Magic...</> : <><Sparkles className="w-6 h-6" /> Create Try-On</>}
        </button>
      </div>

      <div className="lg:col-span-7">
        <div className="sticky top-28 space-y-8">
          <AnimatePresence>
            {turboMode && isProcessing && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="puffy-card p-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white border-white/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><Activity className="w-6 h-6 animate-pulse" /><h3 className="font-black text-lg">Turbo Threading Engine</h3></div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">100M Req/10s Target</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold"><span>Simulated Requests Processed:</span><span>{activeThreads.toLocaleString()} / 100,000,000</span></div>
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden p-1"><div className="bg-white h-full rounded-full transition-all duration-100" style={{ width: `${(activeThreads / 100000000) * 100}%` }} /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-3xl font-black text-slate-700">Result Preview</h2>
            {resultImage && <button onClick={downloadResult} className="pill-btn pill-btn-secondary px-6 py-3 text-sm"><Download className="w-4 h-4" /> Download</button>}
          </div>

          <div className="puffy-card relative aspect-[3/4] flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div key="loading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center gap-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-8 border-pink-200 rounded-full" />
                    <div className="absolute inset-0 border-8 border-pink-500 rounded-full border-t-transparent animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-pink-400 animate-pulse" />
                  </div>
                  <p className="text-pink-500 font-extrabold text-xl animate-pulse">Tailoring your outfit super fast...</p>
                </motion.div>
              ) : resultImage ? (
                <motion.img key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} src={resultImage} className="w-full h-full object-cover rounded-[2.5rem] shadow-inner" alt="Result" />
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white"><Sparkles className="w-10 h-10 text-pink-300" /></div>
                  <h3 className="text-2xl font-black text-slate-400 mb-3">Ready for Magic</h3>
                  <p className="text-base font-bold text-slate-400 max-w-xs mx-auto">Upload your photos and let the AI detect and apply the product automatically.</p>
                </motion.div>
              )}
            </AnimatePresence>
            {error && <div className="absolute bottom-8 left-8 right-8 p-6 bg-red-50 border-4 border-red-200 rounded-[2rem] flex items-center gap-4 text-red-600 shadow-xl"><AlertCircle className="w-8 h-8 shrink-0" /><p className="text-sm font-extrabold">{error}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Logo Engine Component ---
function LogoEngine() {
  const [logos, setLogos] = useState<{url: string, prompt: string}[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    const currentPrompt = prompt;
    setPrompt(''); // Clear input like a chat

    try {
      const url = await generateLogo(currentPrompt);
      setLogos(prev => [{url, prompt: currentPrompt}, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to generate logo.");
      setPrompt(currentPrompt); // Restore on error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white">
          <Palette className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-black text-slate-700">Logo Forge</h2>
        <p className="text-lg font-bold text-slate-400 max-w-xl mx-auto">Iterative AI Logo Generator. Describe your business, and we'll craft a professional, meaningful logo.</p>
      </div>

      <div className="puffy-card p-6 bg-white/80 backdrop-blur-md">
        <form onSubmit={handleGenerate} className="flex gap-4">
          <input 
            type="text" 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            placeholder="E.g., A modern tech startup named 'Aero', blue colors, minimalist bird icon..." 
            className="puffy-input flex-1 px-6 py-4 text-lg font-medium text-slate-700 placeholder:text-slate-400"
            disabled={isProcessing}
          />
          <button type="submit" disabled={isProcessing || !prompt.trim()} className="pill-btn bg-violet-500 text-white hover:bg-violet-600 border-4 border-violet-200 px-8 py-4 disabled:opacity-50">
            {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </form>
        {error && <p className="text-red-500 font-bold mt-4 text-center">{error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <AnimatePresence>
          {isProcessing && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="puffy-card aspect-square flex flex-col items-center justify-center p-8 border-4 border-dashed border-violet-200">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-violet-200 rounded-full" />
                <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin" />
                <Palette className="absolute inset-0 m-auto w-6 h-6 text-violet-400 animate-pulse" />
              </div>
              <p className="text-violet-500 font-extrabold text-center animate-pulse">Forging Logo...</p>
            </motion.div>
          )}
          {logos.map((logo, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="puffy-card aspect-square relative group overflow-hidden">
              <img src={logo.url} className="w-full h-full object-cover" alt="Generated Logo" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <p className="text-white font-bold text-sm line-clamp-3 mb-4">{logo.prompt}</p>
                <button onClick={() => {
                  const link = document.createElement('a'); link.href = logo.url; link.download = `logo-${Date.now()}.png`; link.click();
                }} className="pill-btn bg-white text-slate-800 py-2 text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- UI Engine Component ---
function UIEngine() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'Website' | 'App'>('Website');
  const [device, setDevice] = useState<'Desktop' | 'Mobile'>('Desktop');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setError(null);
    setResultImage(null);
    try {
      const url = await generateUIDesign(prompt, type, device);
      setResultImage(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate UI design.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5 space-y-8">
        <div className="text-left space-y-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-inner border-4 border-white">
            <Layout className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-700">UI/UX Designer</h2>
          <p className="text-base font-bold text-slate-400">Generate beautiful image mockups for your next app or website project.</p>
        </div>

        <section className="puffy-card p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest">Project Type</label>
            <div className="flex gap-4">
              <button onClick={() => setType('Website')} className={`flex-1 py-4 rounded-2xl font-bold border-4 transition-all ${type === 'Website' ? 'bg-blue-500 text-white border-blue-400' : 'bg-slate-50 text-slate-500 border-transparent hover:border-blue-200'}`}>Website</button>
              <button onClick={() => setType('App')} className={`flex-1 py-4 rounded-2xl font-bold border-4 transition-all ${type === 'App' ? 'bg-blue-500 text-white border-blue-400' : 'bg-slate-50 text-slate-500 border-transparent hover:border-blue-200'}`}>App</button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest">Device Format</label>
            <div className="flex gap-4">
              <button onClick={() => setDevice('Desktop')} className={`flex-1 py-4 rounded-2xl font-bold border-4 transition-all ${device === 'Desktop' ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-500 border-transparent hover:border-cyan-200'}`}>Desktop</button>
              <button onClick={() => setDevice('Mobile')} className={`flex-1 py-4 rounded-2xl font-bold border-4 transition-all ${device === 'Mobile' ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-500 border-transparent hover:border-cyan-200'}`}>Mobile</button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest">Project Description</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="E.g., A modern e-commerce store for sneakers, dark mode, neon green accents..." className="puffy-input w-full p-6 resize-none h-32 text-base font-medium text-slate-700 placeholder:text-slate-400" />
          </div>

          <button onClick={handleGenerate} disabled={isProcessing || !prompt.trim()} className="pill-btn bg-blue-500 text-white hover:bg-blue-600 border-4 border-blue-200 w-full py-6 text-xl disabled:opacity-50">
            {isProcessing ? <><RefreshCw className="w-6 h-6 animate-spin" /> Designing...</> : <><Sparkles className="w-6 h-6" /> Generate Mockup</>}
          </button>
          {error && <p className="text-red-500 font-bold text-center">{error}</p>}
        </section>
      </div>

      <div className="lg:col-span-7">
        <div className="sticky top-28">
          <div className={`puffy-card relative flex items-center justify-center p-4 overflow-hidden ${device === 'Mobile' ? 'aspect-[9/16] max-w-sm mx-auto' : 'aspect-[16/9] w-full'}`}>
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-8 border-blue-200 rounded-full" />
                    <div className="absolute inset-0 border-8 border-blue-500 rounded-full border-t-transparent animate-spin" />
                    <Layout className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                  <p className="text-blue-500 font-extrabold text-xl animate-pulse">Crafting UI...</p>
                </motion.div>
              ) : resultImage ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full relative group">
                  <img src={resultImage} className="w-full h-full object-cover rounded-[2rem] shadow-inner" alt="UI Mockup" />
                  <button onClick={() => {
                    const link = document.createElement('a'); link.href = resultImage; link.download = `ui-mockup-${Date.now()}.png`; link.click();
                  }} className="absolute bottom-6 right-6 pill-btn bg-white text-slate-800 py-3 px-6 text-sm flex items-center gap-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-4 h-4" /> Download Design
                  </button>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white"><Layout className="w-8 h-8 text-blue-300" /></div>
                  <h3 className="text-xl font-black text-slate-400 mb-2">Design Canvas</h3>
                  <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto">Your generated mockup will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Analyzer Engine Component ---
function AnalyzerEngine() {
  const [file, setFile] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [resultText, setResultText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
        setMimeType(selectedFile.type);
        setResultText('');
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const text = await analyzeMedia(file, mimeType);
      setResultText(text);
    } catch (err: any) {
      setError(err.message || "Failed to analyze media.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getIcon = () => {
    if (mimeType.startsWith('video/')) return <Video className="w-12 h-12 text-emerald-400" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-12 h-12 text-emerald-400" />;
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-12 h-12 text-emerald-400" />;
    return <FileSearch className="w-12 h-12 text-emerald-400" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5 space-y-8">
        <div className="text-left space-y-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-inner border-4 border-white">
            <FileSearch className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-700">Media Analyzer</h2>
          <p className="text-base font-bold text-slate-400">Upload an image, video, or audio file. AI will extract a detailed prompt to recreate it.</p>
        </div>

        <section className="puffy-card p-8 space-y-6">
          <div onClick={() => fileInputRef.current?.click()} className={`relative aspect-video rounded-[2.5rem] border-4 border-dashed transition-all cursor-pointer overflow-hidden group ${file ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)] bg-emerald-50' : 'border-emerald-200 hover:border-emerald-400 bg-white/40'}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {file ? getIcon() : <Upload className="w-10 h-10 text-emerald-400" />}
              </div>
              <p className="text-lg font-black text-slate-600">{file ? 'File Uploaded' : 'Upload Media'}</p>
              <p className="text-sm text-slate-400 mt-1 font-bold">{file ? mimeType : 'Video, Audio, or Image'}</p>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="video/*,audio/*,image/*" onChange={handleFileUpload} />
          </div>

          <button onClick={handleAnalyze} disabled={isProcessing || !file} className="pill-btn bg-emerald-500 text-white hover:bg-emerald-600 border-4 border-emerald-200 w-full py-6 text-xl disabled:opacity-50">
            {isProcessing ? <><RefreshCw className="w-6 h-6 animate-spin" /> Analyzing...</> : <><Sparkles className="w-6 h-6" /> Extract Prompt</>}
          </button>
          {error && <p className="text-red-500 font-bold text-center">{error}</p>}
        </section>
      </div>

      <div className="lg:col-span-7">
        <div className="sticky top-28">
          <div className="puffy-card min-h-[500px] p-8 bg-white/80 backdrop-blur-md flex flex-col">
            <h3 className="text-2xl font-black text-slate-700 mb-6 flex items-center gap-3">
              <FileSearch className="w-6 h-6 text-emerald-500" /> Extracted Prompt
            </h3>
            
            <div className="flex-1 bg-slate-50 rounded-[2rem] p-6 border-4 border-slate-100 overflow-y-auto max-h-[600px]">
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full gap-4 py-12">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
                      <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
                    </div>
                    <p className="text-emerald-500 font-extrabold animate-pulse">Deep scanning media...</p>
                  </motion.div>
                ) : resultText ? (
                  <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 font-medium leading-relaxed">
                      {resultText}
                    </pre>
                    <button onClick={() => navigator.clipboard.writeText(resultText)} className="mt-6 pill-btn bg-emerald-100 text-emerald-700 hover:bg-emerald-200 py-3 px-6 text-sm flex items-center gap-2">
                      Copy to Clipboard
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-12 opacity-50">
                    <FileSearch className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-slate-400 font-bold">Upload media and analyze to see the extracted prompt here.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
