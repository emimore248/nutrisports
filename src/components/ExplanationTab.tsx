import React from "react";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  AlertOctagon,
  Cpu,
  CheckCircle2,
  Database,
  ArrowRight,
  EyeOff,
  Sparkles,
  Search,
  BookOpen,
  Utensils,
} from "lucide-react";

export const ExplanationTab: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-teal-50/40 to-emerald-50/30 border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" /> Arquitectura & Metodología de Funcionamiento
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Explicación del Funcionamiento del Asistente
          </h2>
          <p className="mt-2 text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl">
            Este sistema implementa un modelo de inteligencia artificial con <strong>Grounding Documental Estricto (Closed-Domain RAG)</strong>. 
            A continuación se desglosa el objetivo de cada directriz del prompt y cómo aseguramos que toda la información del Word/PDF (incluyendo nutrición y planificación) se responda de forma exhaustiva sin permitir el acceso al archivo en crudo.
          </p>
        </div>
      </div>

      {/* Reglas de la directriz explicadas paso a paso */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-600" />
          Análisis de las Directrices del Sistema
        </h3>

        {/* 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-teal-300 transition">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold shrink-0">
              1
            </div>
            <div className="space-y-2 flex-1">
              <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                Directriz: Rol de Especialista y Ámbito Cerrado
              </div>
              <div className="font-mono text-xs md:text-sm bg-slate-50 p-3 rounded-xl border border-slate-200 text-teal-900">
                &ldquo;Eres un asistente virtual especializado en responder consultas basándote de manera exclusiva y estricta en la documentación proporcionada en este contexto.&rdquo;
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Funcionamiento:</strong> Delimita el perímetro operativo del modelo. En lugar de actuar como un asistente general, se circunscribe como un <em>lector exhaustivo del corpus oficial de 64 páginas</em> (mitos, calentamiento, sobrecarga progresiva VBT, rutinas y descanso, nutrición pre/post, hidratación y suplementación).
              </p>
            </div>
          </div>
        </div>

        {/* 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-teal-300 transition">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold shrink-0">
              2
            </div>
            <div className="space-y-2 flex-1">
              <div className="text-xs font-semibold text-cyan-700 uppercase tracking-wide">
                Directriz: Criterio de Evidencia Explícita
              </div>
              <div className="font-mono text-xs md:text-sm bg-slate-50 p-3 rounded-xl border border-slate-200 text-cyan-900">
                &ldquo;Reglas: Responde únicamente utilizando la información explícita presente en los documentos subidos.&rdquo;
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Funcionamiento:</strong> Erradica suposiciones e interpretaciones libres. Cada recomendación (ej. el menú de desayuno, almuerzo y cena de la página 35, los 1,5 a 2 g de proteína por kg, la cocción de vegetales de Rivadeneira, o los 1,5 litros de agua por kg perdido de Loreto Manzano) proviene textualmente del texto original.
              </p>
            </div>
          </div>
        </div>

        {/* 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-amber-300 transition">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold shrink-0">
              3
            </div>
            <div className="space-y-2 flex-1">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                Directriz: Frase Canónica de Fallback Inalterable
              </div>
              <div className="font-mono text-xs md:text-sm bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-amber-900 font-semibold">
                &ldquo;Si la respuesta a una pregunta no se encuentra en el documento, responde exactamente: 'Lo siento, pero no dispongo de esa información en la base de datos proporcionada.'&rdquo;
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Funcionamiento:</strong> Previene la alucinación de datos inexistentes. Si el usuario pregunta por recetas no descritas en el documento, historia universal o finanzas, el bot activa estrictamente la misma frase formal sin rodeos.
              </p>
            </div>
          </div>
        </div>

        {/* 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-rose-300 transition">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 font-bold shrink-0">
              4
            </div>
            <div className="space-y-2 flex-1">
              <div className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                Directriz: Neutralización de Conocimiento Externo y Tono Profesional
              </div>
              <div className="font-mono text-xs md:text-sm bg-slate-50 p-3 rounded-xl border border-slate-200 text-rose-900">
                &ldquo;No utilices conocimientos externos, ni hagas suposiciones fuera del texto brindado. Mantén un tono claro, directo y profesional.&rdquo;
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Funcionamiento:</strong> Desactiva la memoria pública no verificada del modelo y asegura un estilo de comunicación asertivo, objetivo y fundamentado en la ciencia deportiva.
              </p>
            </div>
          </div>
        </div>

        {/* 5 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-indigo-300 transition">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shrink-0">
              5
            </div>
            <div className="space-y-2 flex-1">
              <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                Directriz: Confidencialidad de la Base de Datos (Zero-Leakage)
              </div>
              <div className="font-mono text-xs md:text-sm bg-slate-50 p-3 rounded-xl border border-slate-200 text-indigo-900">
                &ldquo;El usuario no debe tener acceso al archivo de base de datos.&rdquo;
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Funcionamiento en la Arquitectura:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500 mt-1">
                <li>El documento fuente reside de forma privada en el backend (Node.js/Express) y nunca se publica como archivo descargable.</li>
                <li>Los endpoints del servidor suministran respuestas sintetizadas al cliente sin volcar el documento en bruto.</li>
                <li>Cualquier intento de forzar la descarga o extracción del archivo activa de inmediato la frase canónica de corte.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Diagrama de Flujo Moderno */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-teal-600" />
          Flujo de Decisión y Verificación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              1
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">Pregunta del Usuario</h4>
            <p className="text-xs text-slate-500 mt-1">
              Consulta sobre nutrición, mitos, calentamiento o ejercicios.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">Filtro de Seguridad</h4>
            <p className="text-xs text-slate-500 mt-1">
              Verifica que no sea una solicitud para extraer el archivo crudo o manipular el sistema.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">Grounding Explícito</h4>
            <p className="text-xs text-slate-500 mt-1">
              Comprueba si la respuesta exacta se encuentra en el documento de 64 páginas.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              4
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">Respuesta o Fallback</h4>
            <p className="text-xs text-slate-500 mt-1">
              Si está: responde en detalle. Si no está: frase exacta estandarizada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
