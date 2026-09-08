import { isWasteKind, labelFor, WASTE_KINDS, type WasteKind } from "@/lib/catalog/kinds";

export const LOW_CONFIDENCE = 0.6;

export type GeminiIdentify = {
  wasteKind?: string;
  label?: string;
  confidence?: number;
};

export type IdentifyResult = {
  wasteKind: WasteKind;
  label: string;
  confidence: number;
};

const ALIASES: Record<string, WasteKind> = {
  smartphone: "phones",
  phone: "phones",
  cellphone: "phones",
  mobile: "phones",
  celular: "phones",
  laptop: "laptops",
  notebook: "laptops",
  portatil: "laptops",
  desktop: "computers",
  pc: "computers",
  computer: "computers",
  tablet: "tablets",
  charger: "chargers",
  cargador: "chargers",
  battery: "batteries",
  bateria: "batteries",
  cell: "cells",
  pila: "cells",
  headphone: "headphones",
  headphones: "headphones",
  earbuds: "headphones",
  audifonos: "headphones",
  tv: "tvs",
  television: "tvs",
  televisor: "tvs",
  printer: "printers",
  impresora: "printers",
  cable: "cables",
  cables: "cables",
  mouse: "peripherals",
  keyboard: "peripherals",
  peripheral: "peripherals",
  appliance: "small_appliances",
};

function unknown(confidence: number): IdentifyResult {
  return { wasteKind: "unknown", label: labelFor("unknown"), confidence };
}

export function mapGeminiResult(input: GeminiIdentify): IdentifyResult {
  const confidence = Number(input.confidence);
  const score = Number.isFinite(confidence) ? confidence : 0;
  if (score < LOW_CONFIDENCE) return unknown(score);

  const raw = (input.wasteKind ?? "").toLowerCase().trim().replace(/\s+/g, "_");
  const kind = isWasteKind(raw) ? raw : ALIASES[raw.replace(/_/g, "")] ?? ALIASES[raw];
  if (!kind || kind === "unknown") return unknown(score);

  return { wasteKind: kind, label: labelFor(kind), confidence: score };
}

const KIND_LIST = WASTE_KINDS.map((k) => k.id).join(", ");

const PROMPT = `Classify this e-waste photo. JSON only: {"wasteKind":"<id>","confidence":0-1}. wasteKind MUST be one of: ${KIND_LIST}. Use unknown if it is not electronics or you are unsure. Never invent a name.`;

export async function identifyFromBytes(
  bytes: ArrayBuffer,
  mimeType: string,
): Promise<IdentifyResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return unknown(0);

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: Buffer.from(bytes).toString("base64"),
                },
              },
              { text: PROMPT },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json", temperature: 0 },
      }),
    },
  );
  if (!res.ok) return unknown(0);

  const body = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return unknown(0);

  try {
    return mapGeminiResult(JSON.parse(text) as GeminiIdentify);
  } catch {
    return unknown(0);
  }
}
