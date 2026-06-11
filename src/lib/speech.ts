/** Web Speech API — 英语 TTS 朗读 */

let voice: SpeechSynthesisVoice | null = null;

function refreshVoice(): void {
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return;

  // Chrome: Google US English
  const g = voices.find((v) => v.name.includes("Google") && v.lang === "en-US");
  if (g) { voice = g; return; }

  // macOS Safari: Samantha
  const sam = voices.find((v) => v.name === "Samantha" && v.lang.startsWith("en"));
  if (sam) { voice = sam; return; }

  // 本地 en-US
  const local = voices.find((v) => v.localService && v.lang === "en-US");
  if (local) { voice = local; return; }

  // 任意英文
  const any = voices.find((v) => v.lang.startsWith("en"));
  if (any) { voice = any; return; }
}

if (typeof window !== "undefined") {
  speechSynthesis.onvoiceschanged = () => refreshVoice();
  refreshVoice();
}

export function speak(word: string): void {
  if (typeof window === "undefined") return;

  const synth = window.speechSynthesis;

  // 每次确保语音列表是最新的
  refreshVoice();

  // 如果正在朗读，先停止再播新的
  if (synth.speaking) synth.cancel();

  const u = new SpeechSynthesisUtterance(word.toLowerCase());
  u.lang = "en-US";
  u.rate = 0.75;
  u.pitch = 1;
  u.volume = 1;
  if (voice) u.voice = voice;

  synth.speak(u);
}
