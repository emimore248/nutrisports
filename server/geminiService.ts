/**
 * Servicio de Inteligencia Artificial en Servidor con Grounding Estricto
 * Conecta con @google/genai y provee motor documental de respaldo anti-alucinaciones.
 */
import { GoogleGenAI } from "@google/genai";
import { KNOWLEDGE_BASE_DOCUMENT, CANONICAL_FALLBACK_MESSAGE } from "./knowledgeBase.ts";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

// Intentos prohibidos de acceso o descarga del archivo de base de datos
const FILE_SECURITY_KEYWORDS = [
  "archivo",
  "base de datos",
  "descarg",
  "prompt",
  "system",
  "documento crudo",
  "raw",
  "extraer",
  "imprime todo",
  "muéstrame todo",
  "código fuente",
  "database",
];

// Base de conocimiento estructurada para evaluación exacta
interface GroundedEntry {
  patterns: RegExp[];
  answer: string;
}

const DOCUMENTED_KNOWLEDGE: GroundedEntry[] = [
  {
    patterns: [/sudar/i, /sudor/i, /transpirar/i],
    answer:
      "No. El sudor es un mecanismo de autorregulación térmica (pérdida de agua y minerales) para enfriar el cuerpo cuando sube la temperatura, no indica quema directa de grasa. La grasa corporal se oxida mediante déficit calórico y ejercicio regular, no a través de la sudoración.",
  },
  {
    patterns: [/solo cardio/i, /únicamente cardio/i, /cardio para bajar/i, /cardio quema músculo/i],
    answer:
      "No necesariamente. El ejercicio cardiovascular quema calorías durante la actividad, pero combinarlo con entrenamiento de fuerza preserva la masa muscular y mantiene el metabolismo activo. Depender únicamente de cardio sin trabajo de fuerza puede llevar a la pérdida de tejido muscular en lugar de tejido adiposo.",
  },
  {
    patterns: [/demasiado musculosa/i, /mucho peso me voy a volver/i, /mujer.*pesas/i, /volumen muscular/i],
    answer:
      "No. Desarrollar un gran volumen muscular requiere años de entrenamiento pesado específico, superávit calórico continuo y altos niveles hormonales. En las mujeres, los niveles de testosterona son naturalmente más bajos, por lo que el levantamiento de peso promueve un físico firme, definido y fuerte, no desproporcionado.",
  },
  {
    patterns: [/abdominales.*quema.*grasa/i, /grasa del abdomen/i, /grasa de la panza/i, /grasa localizada/i],
    answer:
      "No. Es fisiológicamente imposible reducir grasa de forma localizada mediante ejercicios específicos. La pérdida de grasa ocurre de manera generalizada en todo el cuerpo a través del balance energético global y el déficit calórico. Los ejercicios abdominales fortalecen el músculo subyacente, pero no eliminan la capa de grasa superficial.",
  },
  {
    patterns: [/sentir dolor/i, /no pain no gain/i, /quedar exhausto/i, /agujetas/i],
    answer:
      "No. El dolor agudo o extremo no es un indicador de eficacia del entrenamiento y puede señalar un riesgo de lesión. La clave del progreso físico radica en el estímulo constante y adecuado, combinado con una recuperación óptima. Una ligera molestia muscular tardía es normal, pero el dolor intenso no debe ser la meta.",
  },
  {
    patterns: [/estiramiento.*estático/i, /estirar antes/i, /estiramientos antes/i],
    answer:
      "Se deben evitar los estiramientos estáticos antes de entrenar. Las investigaciones muestran consistentemente que realizar estiramientos estáticos previos reduce la potencia y la fuerza muscular entre un 2% y un 5%, ya que vuelve los músculos temporalmente más débiles y menos responsivos. Los estiramientos estáticos deben reservarse para después del entrenamiento o para sesiones de movilidad separadas.",
  },
  {
    patterns: [/fases.*calentamiento/i, /protocolo.*calentamiento/i, /etapas.*calentamiento/i],
    answer:
      "El protocolo de calentamiento para levantamiento de pesas toma entre 10 y 15 minutos y se divide en 3 fases:\n\n1. Fase 1: Calentamiento General (3-5 minutos): Actividad ligera para elevar la temperatura corporal y la frecuencia cardíaca (remo, bicicleta estática, caminata con inclinación o saltos de cuerda ligeros).\n2. Fase 2: Movilidad Dinámica (3-5 minutos): Preparación basada en movimiento para las articulaciones involucradas (10-15 repeticiones de balanceos, rotaciones o sentadillas con peso corporal).\n3. Fase 3: Series de Calentamiento Específicas (5-10 minutos): Progresión de series del ejercicio principal (Serie 1: barra vacía x 10-15 reps; Serie 2: 40-50% x 5-8 reps; Serie 3: 60-70% x 3-5 reps; Serie 4: 80-85% x 1-2 reps; y finalmente series de trabajo al 100%).",
  },
  {
    patterns: [/8 ejercicios/i, /ejercicios.*calentamiento dinámico/i, /ejercicios dinámicos/i],
    answer:
      "Los 8 ejercicios de calentamiento dinámico indicados en el documento son:\n1. Sentadilla y posición de pie (10 repeticiones).\n2. El estiramiento más grande del mundo (10 repeticiones en total).\n3. Balanceo de piernas (10-15 por pierna).\n4. Gusanos medidores u orugas (5-10 repeticiones).\n5. Elevación de cadera o puente de glúteos (10 a 20 repeticiones).\n6. Abrelibros (10 por lado).\n7. Zancadas laterales (5 a 10 por lado).\n8. Saltos de pogo (1-2 repeticiones de 20-30 segundos).",
  },
  {
    patterns: [/estiramiento más grande del mundo/i],
    answer:
      "El estiramiento más grande del mundo comienza en posición de plancha, llevando un pie hacia las manos y luego levantando el brazo contrario para rotar el pecho hacia el techo. Ayuda a mejorar la movilidad de la cadera a la vez que añade rotación a la columna torácica y trabaja caderas e isquiotibiales (se realizan 10 repeticiones en total).",
  },
  {
    patterns: [/schoenfeld/i, /cuántas series.*semana/i, /volumen semanal/i, /series por grupo/i],
    answer:
      "Según el metaanálisis de Schoenfeld en el Journal of Sports Sciences, se recomienda alrededor de 10 series semanales por grupo muscular para maximizar el crecimiento. El estudio halló que realizar menos de 5 series por semana produjo una ganancia media de 5,4%, entre 5 y 9 series un 6,6%, y 10 o más series un 9,8%. Sin embargo, con 4 series semanales o menos ya se consiguen ganancias sustanciales.",
  },
  {
    patterns: [/frecuencia.*semanal/i, /una o dos veces por semana/i, /entrenar cada músculo/i],
    answer:
      "Entrenar cada músculo dos veces por semana suele dar mayores resultados. Un metaanálisis de Schoenfeld demostró que una frecuencia doble produce un 6,8% de ganancia media frente a un 3,7% al entrenarlo una sola vez, manteniendo igual el volumen total.",
  },
  {
    patterns: [/orden de ejercicios/i, /regla.*acsm/i, /compuestos o aislados/i, /multiarticulares/i],
    answer:
      "La regla de oro del Colegio Americano de Medicina del Deporte (ACSM) establece realizar primero los ejercicios multiarticulares y grandes grupos musculares (sentadillas, peso muerto, press de banca, remo, dominadas), y dejar para el final los ejercicios monoarticulares y pequeños grupos aislados (curls, extensiones, elevaciones), priorizando siempre de mayor a menor exigencia técnica e intensidad.",
  },
  {
    patterns: [/sin añadir peso/i, /sobrecarga.*mismo peso/i, /aumentar la dificultad/i],
    answer:
      "Existen diversas formas de aplicar sobrecarga progresiva sin aumentar el peso:\n• Aumentar el volumen (más repeticiones por serie o series por entrenamiento).\n• Aumentar el rango de movimiento (por ejemplo, realizando peso muerto con déficit sobre una superficie elevada).\n• Combinar atributos de resistencia (usar una mancuerna combinada con una banda elástica para alterar la curva de resistencia).\n• Reducir el impulso (añadir una pausa de control en los puntos de mayor dificultad).\n• Reducir el tiempo de descanso entre series.",
  },
  {
    patterns: [/vbt/i, /velocidad.*barra/i, /cuándo aumentar el peso/i, /fuerza-velocidad/i],
    answer:
      "En el entrenamiento basado en la velocidad (VBT), se debe aumentar el peso en cuanto la velocidad media de la barra aumente un 10% para una carga determinada, lo cual es el indicador objetivo de mejora de la fuerza. Si se busca desarrollar fuerza de aceleración, el objetivo es mantenerse dentro de la zona de 0,75 a 0,5 m/s.",
  },
  {
    patterns: [/fuerza frente a.*hipertrofia/i, /fuerza vs hipertrofia/i, /ganancias de fuerza/i],
    answer:
      "Para hipertrofia se busca acumular tensión muscular y volumen (pudiendo subir hasta 25 repeticiones por serie), reduciendo descansos y entrenando cerca del fallo muscular de forma segura. En cambio, para fuerza máxima se busca mantener alta calidad técnica levantando cargas pesadas por debajo de 8 repeticiones por serie, con descanso suficiente entre series y evitando el fallo muscular.",
  },
  {
    patterns: [/progresión.*flexiones/i, /flexiones.*paso/i],
    answer:
      "La progresión para flexiones comprende:\n• Paso 1: Flexiones contra la pared (3 series diarias aumentando repeticiones).\n• Paso 2: Flexiones de rodillas (reduciendo el número de repeticiones iniciales y aumentando volumen gradualmente).\n• Paso 3: Flexiones normales en el suelo.\n• Paso 4: Aumentar el rango de movimiento usando agarres para flexiones o mancuernas hexagonales.",
  },
  {
    patterns: [
      /alimentaci[oó]n/i,
      /nutrici[oó]n/i,
      /dieta/i,
      /qu[eé] comer/i,
      /plan.*aliment/i,
      /comidas/i,
    ],
    answer:
      "De acuerdo con la documentación oficial suministrada, la nutrición es el soporte esencial de tus resultados. Los lineamientos completos son:\n\n1. Principios Generales para Principiantes y Composición Corporal:\n• Déficit calórico moderado si el objetivo es perder grasa corporal (en principiantes es posible ganar músculo y perder grasa simultáneamente).\n• Proteínas: entre 1,5 y 2 g por kg de peso corporal al día.\n• Hidratos y grasas saludables: arroz integral, avena, frutos secos, aceite de oliva, boniato y palta.\n• Hidratación constante durante toda la jornada.\n\n2. Ejemplo de Distribución de Comidas:\n• Desayuno: avena con fruta y yogur griego.\n• Almuerzo: pollo a la plancha con arroz integral y verduras.\n• Cena: salmón al horno con ensalada.\n• Snack: frutas, frutos secos o batido de proteína.\n\n3. Alimentación para Ganar Masa Muscular (Hipertrofia):\n• Se requiere una dieta nutritiva basada en alimentos naturales pero hipercalórica (con un extra de calorías sobre el gasto mínimo para construir nuevos tejidos).\n\n4. Las 3 Fases Alrededor del Entrenamiento:\n• Antes (Pre-entreno): Carbohidratos (tu combustible) + proteína magra. Comida completa 2-3 horas antes (arroz o fideos con pollo, clara de huevo o queso, verduras cocidas bajas en fibra); o snack ligero 30-60 minutos antes (plátano, dátiles, tostada con membrillo/miel y queso fresco, yogur con cereales).\n• Durante: En sesiones de menos de 60 minutos solo agua a sorbos; en sesiones de más de 60-90 minutos o intensas, agua con electrolitos y carbohidratos rápidos (fruta deshidratada, plátano, bebida isotónica o barrita).\n• Después (Post-entreno): Combinación de carbohidratos (reponer glucógeno) + proteínas (reparar músculo). Ejemplos: batido de proteína con avena y plátano, salmón con boniato o pollo con arroz integral. No es necesario cronometrar los 30 minutos exactos; lo fundamental es el total del día.",
  },
  {
    patterns: [/desayuno/i, /almuerzo/i, /cena/i, /snack/i, /distribuci[oó]n.*comida/i, /men[uú]/i],
    answer:
      "El ejemplo oficial de distribución de comidas presentado en el documento es:\n• Desayuno: Avena con fruta y yogur griego.\n• Almuerzo: Pollo a la plancha, arroz integral y verduras.\n• Cena: Salmón al horno con ensalada.\n• Snack: Frutas, frutos secos o batido de proteína.\n\nComo desayuno post-entreno completo alternativo, el servicio de nutrición NEXT recomienda tortilla o huevo con tostada y una pieza de fruta.",
  },
  {
    patterns: [/vegetales.*pre/i, /verduras.*pre/i, /fibra.*pre/i, /rivadeneira/i],
    answer:
      "El licenciado en nutrición Sebastián Rivadeneira (Servicio de Nutrición del hospital Centro de Salud) aclara que en la comida pre-entreno no es conveniente incorporar vegetales en grandes cantidades por su aporte de fibra, ya que esta disminuye y ralentiza la absorción de los hidratos de carbono. Se pueden incorporar verduras en poca cantidad siempre y cuando estén cocidas, lo cual reduce significativamente su contenido de fibra.",
  },
  {
    patterns: [/errores.*nutrici[oó]n/i, /saltarse comidas/i],
    answer:
      "Los errores más comunes señalados en el documento son:\n1. Saltarse comidas o no consumir suficiente proteína: limita severamente los resultados.\n2. Exceso de cardio sin entrenamiento de fuerza: produce pérdida de masa muscular en lugar de grasa.\n3. Creer que por hacer ejercicio se puede comer cualquier cosa: los abdominales se consiguen en la cocina y el entrenamiento no compensa una mala nutrición.",
  },
  {
    patterns: [/2 a 3 horas antes/i, /pre.*entreno/i, /qué comer antes/i, /comida pre-entreno/i],
    answer:
      "Para una comida completa de 2 a 3 horas antes de entrenar se recomiendan carbohidratos complejos (fuente de energía para reponer glucógeno) acompañados de proteínas de fácil digestión: por ejemplo arroz integral o fideos con pollo, clara de huevo o queso fresco, con porción moderada de grasas saludables (palta, frutos secos, aceite de oliva) y vegetales cocidos bajos en fibra para no ralentizar la digestión.",
  },
  {
    patterns: [/30.*60 minutos antes/i, /snack pre/i, /poco tiempo.*entrenar/i],
    answer:
      "Si dispones de solo 30 a 60 minutos antes del entrenamiento, debes priorizar carbohidratos de rápida absorción y fácil digestión como un plátano, dátiles con nueces, un batido de proteínas con fruta, una tostada de pan blanco con miel o membrillo y queso fresco, o yogur con cereales. Si dispones de menos de 30 minutos, se sugieren líquidos azucarados como un jugo de frutas.",
  },
  {
    patterns: [/durante el entrenamiento.*comer/i, /qué comer.*durante/i, /bebida isotónica.*durante/i],
    answer:
      "En sesiones de menos de 60 minutos y de intensidad baja o moderada solo se necesita agua a sorbos. En entrenamientos prolongados o muy intensos (más de 60 a 90 minutos), se recomienda incorporar bebidas con electrolitos y carbohidratos de rápida absorción (fruta deshidratada, un plátano, una barrita o bebida isotónica).",
  },
  {
    patterns: [/después de entrenar/i, /post.*entreno/i, /ventana anabólica/i],
    answer:
      "Después de entrenar se recomienda combinar carbohidratos y proteínas para reponer las reservas de glucógeno gastadas y reparar las fibras musculares (por ejemplo: salmón con boniato y verduras, pollo a la plancha con arroz, o un batido de proteína con avena y plátano). El documento destaca que no hay que obsesionarse con los 30 minutos exactos de la ventana anabólica, ya que lo determinante es el aporte total de nutrientes durante todo el día.",
  },
  {
    patterns: [/nitratos/i, /remolacha/i],
    answer:
      "El consumo de alimentos ricos en nitratos en los días previos a una competición aporta una mayor oxigenación a los músculos y ayuda a retrasar la aparición de la fatiga. El documento recomienda opciones como gazpacho de remolacha, hummus de remolacha, batido de remolacha con naranja, zanahoria y manzana, o verduras de hoja verde como espinacas y rúcula.",
  },
  {
    patterns: [/ayun/i, /entrenar en ayunas/i],
    answer:
      "Para considerarse entrenamiento en ayunas se requiere un mínimo de 12 horas sin ingerir alimentos. Ni el agua ni el café solo sin azúcar rompen el ayuno. Durante el ejercicio en ayunas el cuerpo recurre a la grasa como combustible al descender el glucógeno (cuyas reservas pueden durar hasta 16 horas y no se agotan de noche), pero esto no implica adelgazar más, ya que la pérdida de peso está supeditada al balance calórico global del día. Al finalizar la sesión es muy importante ingerir proteínas para frenar la degradación muscular.",
  },
  {
    patterns: [/cuánta agua/i, /pautas de hidratación/i, /hidratación deportiva/i, /litros de agua/i],
    answer:
      "Las pautas oficiales de hidratación deportiva según el documento son:\n• Consumo base diario: Entre 2 y 2,5 litros de agua al día (o de 2 a 3 litros).\n• Antes de entrenar: Beber entre 400 y 600 ml en las 2 a 3 horas previas (o 30 a 60 minutos antes).\n• Durante el entrenamiento: Pequeños sorbos de 150 a 250 ml cada 15 a 20 minutos (sin esperar a tener sed).\n• Después de entrenar: Beber entre 500 y 1000 ml en la primera hora. Si se conoce el peso corporal perdido, reponer aproximadamente 1,5 litros de líquido por cada kilogramo perdido.",
  },
  {
    patterns: [/deshidratación/i, /síntomas.*deshidrat/i, /orina/i, /2% del peso/i],
    answer:
      "Una pérdida de tan solo el 2% del peso corporal en líquidos ya disminuye el rendimiento físico. Los signos de deshidratación son sed intensa, orina oscura, calambres musculares, mareos, dolor de cabeza, fatiga extrema y disminución del rendimiento. El color claro de la orina es el indicador directo de una adecuada hidratación.",
  },
  {
    patterns: [/hiponatremia/i, /sobrehidratación/i, /demasiada agua/i],
    answer:
      "La sobrehidratación o hiponatremia se produce al beber volúmenes excesivos de agua sola en poco tiempo sin reponer sales minerales (especialmente sodio). Sus síntomas incluyen náuseas, hinchazón, dolor de cabeza, confusión, desorientación y calambres musculares, pudiendo ser una condición peligrosa si no se equilibra el sodio.",
  },
  {
    patterns: [/proteína en polvo/i],
    answer:
      "La proteína en polvo es comida en polvo deshidratada extraída de alimentos reales (como leche, huevo, soja o guisantes), no una sustancia química artificial ni mágica. Su función es reparar las fibras musculares rotas durante el ejercicio, facilitar la recuperación, estimular el aumento de masa muscular y aportar saciedad en planes de pérdida de peso.",
  },
  {
    patterns: [/creatina/i, /monohidratada/i],
    answer:
      "La creatina (especialmente en formato de creatina monohidratada) es un compuesto formado por aminoácidos que el cuerpo sintetiza y que se halla en carnes rojas y pescados. Funciona como una reserva celular que ayuda a regenerar con rapidez el ATP (la energía que utiliza el músculo) durante esfuerzos cortos, intensos y explosivos como el levantamiento de pesas.",
  },
  {
    patterns: [/combinar.*creatina/i, /creatina.*proteína/i],
    answer:
      "Sí, la proteína en polvo y la creatina se pueden combinar perfectamente. No compiten entre sí ya que cumplen funciones diferentes y complementarias: la creatina suministra la energía para entrenar con mayor intensidad, mientras que la proteína proporciona los aminoácidos para recuperar y reparar el tejido muscular tras el esfuerzo.",
  },
  {
    patterns: [/días de descanso/i, /descansar/i, /sobreentrenamiento/i, /recuperación/i],
    answer:
      "Los expertos recomiendan incluir entre uno y dos días de descanso a la semana. El descanso permite reparar tejidos musculares, recargar glucógeno y evitar la sobrecarga del sistema nervioso central (SNC). Se sugiere el descanso activo (caminar 15-20 minutos, bicicleta suave, yoga relajante o rodillo de espuma) y dormir más de 7 horas por noche (según los CDC).",
  },
];

export async function askGroundedAssistant(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<{ reply: string; isFallback: boolean }> {
  const normalizedQuery = userQuery.toLowerCase().trim();

  // 1. REGLA DE SEGURIDAD: El usuario NO debe tener acceso al archivo de base de datos
  const isSecurityAttempt =
    FILE_SECURITY_KEYWORDS.some((kw) => normalizedQuery.includes(kw)) &&
    (normalizedQuery.includes("dame") ||
      normalizedQuery.includes("descarg") ||
      normalizedQuery.includes("muest") ||
      normalizedQuery.includes("imprim") ||
      normalizedQuery.includes("bruto") ||
      normalizedQuery.includes("crudo") ||
      normalizedQuery.includes("archivo") ||
      normalizedQuery.includes("system") ||
      normalizedQuery.includes("prompt"));

  if (isSecurityAttempt) {
    return {
      reply: CANONICAL_FALLBACK_MESSAGE,
      isFallback: true,
    };
  }

  // 2. Intentar llamar a Gemini API primero
  try {
    const systemInstruction = `
Eres un asistente virtual especializado en responder consultas basándote de manera exclusiva y estricta en la documentación proporcionada en este contexto.

Reglas: Responde únicamente utilizando la información explícita presente en los documentos subidos. Si la respuesta a una pregunta no se encuentra en el documento, responde exactamente: '${CANONICAL_FALLBACK_MESSAGE}'
No utilices conocimientos externos, ni hagas suposiciones fuera del texto brindado.
Mantén un tono claro, directo y profesional.

El usuario no debe tener acceso al archivo de base de datos.

=== DOCUMENTACIÓN SUMINISTRADA ===
${KNOWLEDGE_BASE_DOCUMENT}
=== FIN DOCUMENTACIÓN ===
`;

    const contents = [
      ...history.slice(-4).map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
      {
        role: "user",
        parts: [{ text: userQuery }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.0,
      },
    });

    const reply = response.text?.trim();
    if (reply) {
      const isFallback =
        reply.includes("no dispongo de esa información en la base de datos proporcionada") ||
        reply.includes(CANONICAL_FALLBACK_MESSAGE);
      return { reply, isFallback };
    }
  } catch (apiError: any) {
    // Si Gemini API experimenta 503 spike o error temporal, pasamos al evaluador documental determinístico
    console.log("Gemini API spike o indisponibilidad temporal. Aplicando motor de grounding determinístico.");
  }

  // 3. Motor de Grounding Documental Determinístico (Evaluación estricta sin alucinaciones)
  for (const entry of DOCUMENTED_KNOWLEDGE) {
    const isMatch = entry.patterns.some((pattern) => pattern.test(normalizedQuery));
    if (isMatch) {
      return {
        reply: entry.answer,
        isFallback: false,
      };
    }
  }

  // 4. Si la consulta NO coincide con ningún contenido explícito del documento:
  return {
    reply: CANONICAL_FALLBACK_MESSAGE,
    isFallback: true,
  };
}
