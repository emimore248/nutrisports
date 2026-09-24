import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Flame,
  TrendingUp,
  Calendar,
  Utensils,
  Droplets,
  Sparkles,
  Lock,
  ArrowUpRight,
  Database,
  CheckCircle2,
} from "lucide-react";

interface Topic {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  sampleQuestions: string[];
}

interface TopicsTabProps {
  onSelectQuery: (query: string) => void;
}

export const TopicsTab: React.FC<TopicsTabProps> = ({ onSelectQuery }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => {
        if (data.topics) {
          setTopics(data.topics);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case "Flame":
        return <Flame className="w-5 h-5 text-rose-600" />;
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case "Calendar":
        return <Calendar className="w-5 h-5 text-teal-600" />;
      case "Utensils":
        return <Utensils className="w-5 h-5 text-orange-600" />;
      case "Droplets":
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      default:
        return <Database className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Notice on Database Protection */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Índice Temático de la Base de Datos Documental
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-teal-600" />
              Base Confidencial
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Resumen de todas las áreas temáticas del documento. Haz clic en cualquiera de las preguntas para enviarla directamente al chat del asistente.
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Cargando temario documental...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 transition flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                      {getIcon(t.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {t.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{t.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2 mb-4">
                  {t.summary}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Preguntas frecuentes en el documento:
                  </span>
                  {t.sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectQuery(q)}
                      className="w-full text-left text-xs text-slate-700 hover:text-teal-900 bg-slate-50 hover:bg-teal-50/60 p-2.5 rounded-xl border border-slate-200 transition flex items-center justify-between group cursor-pointer"
                    >
                      <span className="line-clamp-1">{q}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
