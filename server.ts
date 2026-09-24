/**
 * Servidor Full-Stack Express con Vite Middleware
 * Proporciona el backend seguro para el Asistente RAG con Grounding Estricto.
 */
import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { askGroundedAssistant, ChatMessage } from "./server/geminiService.ts";
import { KNOWLEDGE_TOPICS, CANONICAL_FALLBACK_MESSAGE } from "./server/knowledgeBase.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === "production";

  app.use(express.json());

  // Endpoint de Salud
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "online",
      model: "gemini-3.8-flash",
      databaseSecured: true,
      canonicalFallback: CANONICAL_FALLBACK_MESSAGE,
    });
  });

  // Endpoint para obtener temas y resúmenes de la base de datos (sin dar el archivo fuente)
  app.get("/api/topics", (_req: Request, res: Response) => {
    res.json({
      topics: KNOWLEDGE_TOPICS,
      count: KNOWLEDGE_TOPICS.length,
      userAccessToRawDatabase: false,
      protectionNotice: "El archivo fuente original está protegido en el servidor y no es accesible de forma directa.",
    });
  });

  // Endpoint informativo sobre las reglas del sistema
  app.get("/api/rules", (_req: Request, res: Response) => {
    res.json({
      rules: [
        {
          id: "role",
          name: "Especialización Estricta",
          description: "Actúa únicamente como especialista que responde con base documental cerrada.",
          implementation: "System instruction contextualizada con el conocimiento de entrenamiento y nutrición.",
        },
        {
          id: "explicit_info",
          name: "Información Explícita Exclusiva",
          description: "Solo responde si el dato está expresamente redactado en el texto provisto.",
          implementation: "Prohibición de deducciones, inferencias no contrastadas o especulaciones.",
        },
        {
          id: "canonical_fallback",
          name: "Respuesta de Fallback Canónica",
          description: "Si no está en el documento, responde textualmente: 'Lo siento, pero no dispongo de esa información en la base de datos proporcionada.'",
          implementation: "Restricción exacta de cadena de texto sin variaciones conversacionales.",
        },
        {
          id: "zero_external",
          name: "Cero Conocimiento Externo",
          description: "Desactiva conocimientos generales previos del LLM que no estén en la documentación.",
          implementation: "Baja temperatura (0.1) y directiva de confinamiento estricto.",
        },
        {
          id: "database_confidentiality",
          name: "Confidencialidad de la Base de Datos",
          description: "El usuario nunca debe tener acceso al archivo de base de datos ni a los volcados en bruto.",
          implementation: "Aislamiento backend seguro: la IA consulta en memoria; no existen rutas de descarga del archivo.",
        },
      ],
      canonicalFallbackMessage: CANONICAL_FALLBACK_MESSAGE,
    });
  });

  // Endpoint de Chat Grounded
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body as {
        message: string;
        history?: ChatMessage[];
      };

      if (!message || typeof message !== "string" || !message.trim()) {
        res.status(400).json({ error: "El mensaje no puede estar vacío." });
        return;
      }

      const result = await askGroundedAssistant(message.trim(), history || []);
      res.json({
        reply: result.reply,
        isFallback: result.isFallback,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Error en /api/chat:", err);
      res.status(500).json({
        reply: CANONICAL_FALLBACK_MESSAGE,
        isFallback: true,
        error: "Error interno procesando la consulta.",
      });
    }
  });

  // Integración con Vite
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error iniciando servidor:", err);
});
