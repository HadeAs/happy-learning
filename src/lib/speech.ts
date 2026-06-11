/** Web Speech API — 英语 TTS 朗读 */

let voice: SpeechSynthesisVoice | null = null;
let warmedUp = false;

function loadVoices(): void {
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return;

  const g = voices.find((v) => v.name.includes("Google") && v.lang === "en-US");
  if (g) { voice = g; return; }

  const sam = voices.find((v) => v.name === "Samantha" && v.lang.startsWith("en"));
  if (sam) { voice = sam; return; }

  const local = voices.find((v) => v.localService && v.lang === "en-US");
  if (local) { voice = local; return; }

  const en = voices.find((v) => v.lang.startsWith("en"));
  if (en) { voice = en; }
}

function warmUp(): void {
  if (warmedUp) return;
  const u = new SpeechSynthesisUtterance("");
  u.volume = 0;
  speechSynthesis.speak(u);
  warmedUp = true;
}

if (typeof window !== "undefined") {
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

export function speak(word: string): void {
  if (typeof window === "undefined") return;

  const synth = window.speechSynthesis;

  // Chrome: 每次 speak 前 cancel 确保之前的真正停止
  synth.cancel();

  // 首次 speak 时预热引擎 + 加载语音
  if (!warmedUp) warmUp();
  if (!voice) loadVoices();

  const u = new SpeechSynthesisUtterance(word.toLowerCase());
  u.lang = "en-US";
  u.rate = 0.75;
  u.pitch = 1;
  u.volume = 1;
  if (voice) u.voice = voice;

  synth.speak(u);
}
