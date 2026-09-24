import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  Flame,
  HelpCircle,
  Utensils,
  Droplets,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  isFallback?: boolean;
}

const TOPIC_CHIPS = [
  {
    category: "Alimentación",
    icon: Utensils,
    query: "¿Cómo debe ser la alimentación según el documento?",
  },
  {
    category: "Menú y Comidas",
    icon: Utensils,
    query: "¿Cuál es el ejemplo de distribución de comidas (desayuno, almuerzo, cena y snack)?",
  },
  {
    category: "Timing Pre-Entreno",
    icon: Activity,
    query: "¿Qué comer 2 a 3 horas antes frente a 30 a 60 minutos antes de entrenar?",
  },
  {
    category: "Vegetales & Fibra",
    icon: Utensils,
    query: "¿Qué explica Sebastián Rivadeneira sobre los vegetales en la comida pre-entreno?",
  },
  {
    category: "Ayuno & Glucógeno",
    icon: Flame,
    query: "¿Qué efectos tiene el entrenamiento en ayunas y cuántas horas se requieren?",
  },
  {
    category: "Nitratos & Remolacha",
    icon: Sparkles,
    query: "¿Para qué sirven los nitratos como la remolacha antes de competir?",
  },
  {
    category: "Calentamiento Pesas",
    icon: Flame,
    query: "¿Cuáles son las 3 fases del protocolo de calentamiento para pesas?",
  },
  {
    category: "Mito del Sudor",
    icon: HelpCircle,
    query: "¿Sudar mucho significa que estoy quemando grasa?",
  },
  {
    category: "Prueba Fallback",
    icon: AlertTriangle,
    query: "¿Cuál es la capital de Australia y qué clima hace allí?",
  },
];

export const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "¡Hola! Soy tu asistente virtual especializado en la documentación sobre entrenamiento, mitos del fitness, nutrición deportiva e hidratación.\n\nTengo registradas todas las directrices oficiales: pautas de alimentación completa, distribución de comidas (desayuno, almuerzo, cena, snacks), timing pre/post entreno, ayuno, nitratos, calentamiento y suplementación.\n\n¿Qué consulta deseas realizar sobre la documentación?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, text: m.text }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      const data = await response.json();

      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.reply || "Lo siento, pero no dispongo de esa información en la base de datos proporcionada.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: "model",
          text: "Lo siento, pero no dispongo de esa información en la base de datos proporcionada.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isFallback: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "model",
        text: "Conversación reiniciada. Puedes consultar cualquier tema del documento oficial (alimentación, recetas, calentamiento, mitos, etc.).",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-4">
      {/* Top Notification / Rule Pill */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600 shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 text-sm">
                Base Documental Completa Cargada
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Grounding Estricto
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cubre las 64 páginas: alimentación detallada, menús, calentamiento, sobrecarga y mitos.
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition border border-slate-200 cursor-pointer self-end md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Limpiar conversación
        </button>
      </div>

      {/* Suggested Quick Question Cards */}
      <div className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-2xl p-3.5 shadow-xs">
        <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Consultas directas recomendadas (Nutrición, Calentamiento y Mitos):</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {TOPIC_CHIPS.map((chip, idx) => {
            const Icon = chip.icon;
            const isFallbackTest = chip.category === "Prueba Fallback";
            return (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                disabled={isLoading}
                className={`text-xs px-3 py-2 rounded-xl border text-left transition flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 ${
                  isFallbackTest
                    ? "bg-amber-50/70 border-amber-200 text-amber-900 hover:bg-amber-100/80"
                    : "bg-slate-50/90 border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-900 shadow-2xs"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isFallbackTest ? "text-amber-600" : "text-teal-600"}`} />
                <span className="font-medium">{chip.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto bg-slate-100/50 border border-slate-200/90 rounded-3xl p-4 md:p-6 space-y-4 min-h-[440px] max-h-[580px] shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                  isUser
                    ? "bg-teal-600 text-white"
                    : msg.isFallback
                    ? "bg-amber-100 text-amber-700 border border-amber-300"
                    : "bg-white text-teal-700 border border-slate-200"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] md:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs relative group ${
                  isUser
                    ? "bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-tr-xs"
                    : msg.isFallback
                    ? "bg-amber-50/90 border border-amber-300/80 text-amber-950 rounded-tl-xs font-medium"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-sm"
                }`}
              >
                {msg.isFallback && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Respuesta Canónica de Fallback (Información no documentada)</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-normal">{msg.text}</div>

                {/* Bubble Footer */}
                <div
                  className={`flex items-center justify-between mt-2.5 pt-2 border-t text-[11px] ${
                    isUser
                      ? "border-white/20 text-white/80"
                      : "border-slate-100 text-slate-400"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition hover:text-teal-600 flex items-center gap-1 cursor-pointer font-medium"
                      title="Copiar texto"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-teal-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 text-sm text-slate-600 flex items-center gap-2 shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
              <span className="text-xs text-slate-500 ml-1">Consultando documentación oficial...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta sobre alimentación, comidas pre/post, calentamiento, mitos..."
            disabled={isLoading}
            className="w-full bg-white border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-2xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition shadow-xs disabled:opacity-50"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none hidden sm:block">
            Presiona Enter
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-semibold px-6 py-3.5 rounded-2xl transition flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm hover:shadow"
        >
          <span>Consultar</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
