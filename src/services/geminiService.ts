import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- Logging System ---
export type LogEntry = {
  id: string;
  timestamp: number;
  engine: string;
  status: 'pending' | 'success' | 'error';
  requestData: any;
  responseData?: any;
  errorMessage?: string;
  duration?: number;
};

type LogListener = (logs: LogEntry[]) => void;
let logs: LogEntry[] = [];
const listeners: Set<LogListener> = new Set();

export const logService = {
  subscribe: (fn: LogListener) => {
    listeners.add(fn);
    fn(logs);
    return () => listeners.delete(fn);
  },
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog = { ...entry, id: Math.random().toString(36).substring(7), timestamp: Date.now() };
    logs = [newLog, ...logs];
    listeners.forEach(l => l(logs));
    return newLog;
  },
  updateLog: (id: string, updates: Partial<LogEntry>) => {
    logs = logs.map(l => l.id === id ? { ...l, ...updates } : l);
    listeners.forEach(l => l(logs));
  }
};

// Concurrency Limiter (Throttling Engine)
class ConcurrencyLimiter {
  private limit: number;
  private activeCount: number = 0;
  private queue: Array<() => void> = [];

  constructor(limit: number) {
    this.limit = limit;
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.activeCount >= this.limit) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }
    this.activeCount++;
    try {
      return await fn();
    } finally {
      this.activeCount--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) next();
      }
    }
  }
}

// Limit to 3 concurrent requests to avoid hitting API rate limits
export const throttler = new ConcurrencyLimiter(3);

export interface VTORequest {
  personImage: string; // base64
  productImage: string; // base64
  prompt?: string;
}

export async function processVTO({ personImage, productImage, prompt }: VTORequest): Promise<string> {
  const log = logService.addLog({ engine: 'VTO Bubble', status: 'pending', requestData: { prompt, hasPerson: !!personImage, hasProduct: !!productImage } });
  const startTime = Date.now();

  try {
    const result = await throttler.run(async () => {
      const model = "gemini-2.5-flash-image";
      const defaultPrompt = `Virtual Try-On (VTO) request. 
Image 1: The target person (character).
Image 2: The product (clothing/accessory). NOTE: This image might be a standalone product OR a model wearing the product. If it's a model, identify the primary clothing item they are wearing.

Task: Edit Image 1 so the person is realistically wearing the exact product shown in Image 2.

CRITICAL INSTRUCTIONS:
1. MAINTAIN FRAMING: You MUST keep the exact same camera distance, crop, and framing as Image 1. Do NOT zoom in, crop the head, or let the person go out of frame. The person must remain fully visible exactly as they are in Image 1.
2. PRESERVE IDENTITY: Keep the person's face, body shape, pose, and background exactly the same as Image 1.
3. REALISM: Ensure the lighting, shadows, and fabric folds of the new clothing match the environment of Image 1 perfectly.
${prompt ? `User instructions: ${prompt}` : ""}`;

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { mimeType: "image/png", data: personImage.split(',')[1] || personImage } },
            { inlineData: { mimeType: "image/png", data: productImage.split(',')[1] || productImage } },
            { text: defaultPrompt },
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("Failed to generate VTO image.");
    });
    
    logService.updateLog(log.id, { status: 'success', responseData: 'Image Generated Successfully', duration: Date.now() - startTime });
    return result;
  } catch (error: any) {
    logService.updateLog(log.id, { status: 'error', errorMessage: error.message, duration: Date.now() - startTime });
    throw error;
  }
}

export async function generateLogo(prompt: string): Promise<string> {
  const log = logService.addLog({ engine: 'Logo Forge', status: 'pending', requestData: { prompt } });
  const startTime = Date.now();

  try {
    const result = await throttler.run(async () => {
      const model = "gemini-2.5-flash-image";
      const fullPrompt = `A professional, highly designed, and meaningful business logo. Description: ${prompt}. Clean background, vector art style, modern, scalable, premium corporate identity.`;
      
      const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("Failed to generate logo.");
    });
    
    logService.updateLog(log.id, { status: 'success', responseData: 'Logo Generated Successfully', duration: Date.now() - startTime });
    return result;
  } catch (error: any) {
    logService.updateLog(log.id, { status: 'error', errorMessage: error.message, duration: Date.now() - startTime });
    throw error;
  }
}

export async function generateUIDesign(prompt: string, type: string, device: string): Promise<string> {
  const log = logService.addLog({ engine: 'UI Designer', status: 'pending', requestData: { prompt, type, device } });
  const startTime = Date.now();

  try {
    const result = await throttler.run(async () => {
      const model = "gemini-2.5-flash-image";
      const fullPrompt = `A high-quality, modern UI/UX design mockup for a ${type}. Device format: ${device}. Project description: ${prompt}. Clean, beautiful, dribbble style, professional UI design, vibrant colors, modern typography.`;
      const aspectRatio = device === 'Mobile' ? '9:16' : '16:9';
      
      const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
        config: {
          imageConfig: { aspectRatio }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("Failed to generate UI design.");
    });
    
    logService.updateLog(log.id, { status: 'success', responseData: 'UI Mockup Generated Successfully', duration: Date.now() - startTime });
    return result;
  } catch (error: any) {
    logService.updateLog(log.id, { status: 'error', errorMessage: error.message, duration: Date.now() - startTime });
    throw error;
  }
}

export async function analyzeMedia(base64Data: string, mimeType: string): Promise<string> {
  const log = logService.addLog({ engine: 'Media Analyzer', status: 'pending', requestData: { mimeType, dataSize: base64Data.length } });
  const startTime = Date.now();

  try {
    const result = await throttler.run(async () => {
      const model = "gemini-3-flash-preview";
      const prompt = `Analyze this media carefully. Provide a highly detailed prompt that could be used to recreate it using generative AI. 
If it's a video or image: Describe the scenes, environment, lighting, camera angles, subjects, colors, and mood in extreme detail.
If it's audio or a video with sound: Describe the lyrics, background sound type, voice pitch, instruments, tempo, and audio atmosphere.
Format the output clearly with bullet points so the user can easily copy-paste it as a prompt.`;

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Data.split(',')[1] || base64Data } },
            { text: prompt }
          ]
        }
      });
      return response.text || "No analysis generated.";
    });
    
    logService.updateLog(log.id, { status: 'success', responseData: 'Analysis Completed', duration: Date.now() - startTime });
    return result;
  } catch (error: any) {
    logService.updateLog(log.id, { status: 'error', errorMessage: error.message, duration: Date.now() - startTime });
    throw error;
  }
}
