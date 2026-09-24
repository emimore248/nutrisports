import React, { useState } from "react";
import {
  Bot,
  BookOpen,
  Terminal,
  Database,
  ShieldCheck,
  Lock,
  Sparkles,
  Layers,
  Cpu,
  Utensils,
} from "lucide-react";
import { ChatTab } from "./components/ChatTab.tsx";
import { ExplanationTab } from "./components/ExplanationTab.tsx";
import { TestingLabTab } from "./components/TestingLabTab.tsx";
import { TopicsTab } from "./components/TopicsTab.tsx";

type ActiveTab = "chat" | "explanation" | "lab" | "topics";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [chatInitialQuery, setChatInitialQuery] = useState<string | null>(null);

  const handleSelectTopicQuery = (query: string) => {
    setChatInitialQuery(query);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base md:text-lg text-slate-900 tracking-tight">
                  DocuBot
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  RAG Documental
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Especialista en Entrenamiento, Nutrición Deportiva, Mitos e Hidratación
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-2 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-medium">Base de Datos Protegida</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold">Grounding Estricto</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-start md:justify-center border-b border-slate-200 mb-6 overflow-x-auto gap-2 pb-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition shrink-0 cursor-pointer ${
              activeTab === "chat"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Chat del Asistente</span>
          </button>

          <button
            onClick={() => setActiveTab("explanation")}
            className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition shrink-0 cursor-pointer ${
              activeTab === "explanation"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Explicación del Funcionamiento</span>
          </button>

          <button
            onClick={() => setActiveTab("lab")}
            className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition shrink-0 cursor-pointer ${
              activeTab === "lab"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Laboratorio de Pruebas & Fallback</span>
          </button>

          <button
            onClick={() => setActiveTab("topics")}
            className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition shrink-0 cursor-pointer ${
              activeTab === "topics"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Temario de la Base de Datos</span>
          </button>
        </div>

        {/* Tab Views */}
        <div className="flex-1">
          {activeTab === "chat" && <ChatTab />}
          {activeTab === "explanation" && <ExplanationTab />}
          {activeTab === "lab" && <TestingLabTab />}
          {activeTab === "topics" && <TopicsTab onSelectQuery={handleSelectTopicQuery} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <p>
          DocuBot AI — Sistema de Consulta Basado Exclusivamente en la Documentación Oficial. Cero Alucinaciones.
        </p>
      </footer>
    </div>
  );
}
