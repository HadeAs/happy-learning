/** Web Speech API — 英语 TTS 朗读 */

let voice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

/** 挑选最高质量英语语音：优先 Google → 高品质系统语音 → 任意 en-US */
function pickBestVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // 1. Chrome: Google US English（最清晰）
  const google = voices.find((v) => v.name.includes("Google") && v.lang === "en-US");
  if (google) return google;

  // 2. macOS Safari: Siri / Alex（高品质）
  const siri = voices.find((v) => v.name.includes("Siri") && v.lang.startsWith("en"));
  if (siri) return siri;
  const alex = voices.find((v) => v.name === "Alex" && v.lang.startsWith("en"));
  if (alex) return alex;

  // 3. Microsoft Edge: Microsoft en-US
  const ms = voices.find((v) => v.name.toLowerCase().includes("microsoft") && v.lang === "en-US");
  if (ms) return ms;

  // 4. 任意高品质英文女声（通常更清晰）
  const premium = voices.find(
    (v) =>
      v.lang === "en-US" &&
      (v.name.includes("Premium") ||
        v.name.includes("Enhanced") ||
        v.name.includes("Natural") ||
        v.name.includes("Neural")),
  );
  if (premium) return premium;

  // 5. 回退：任意 en-US
  return voices.find((v) => v.lang === "en-US") ?? voices[0];
}

function loadVoices(): void {
  voice = pickBestVoice();
  voicesLoaded = true;
}

if (typeof window !== "undefined") {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
  // 某些浏览器 voices 立即可用
  setTimeout(() => {
    if (!voicesLoaded) loadVoices();
  }, 200);
}

/** 朗读英文单词 */
export function speak(word: string): void {
  if (typeof window === "undefined") return;
  const synth = speechSynthesis;

  if (!voicesLoaded) loadVoices();

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
  utterance.lang = "en-US";
  utterance.rate = 0.75;   // 稍慢更清晰
  utterance.pitch = 1.0;   // 自然音高
  utterance.volume = 1.0;

  if (voice) utterance.voice = voice;

  synth.speak(utterance);
}
