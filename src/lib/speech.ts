/** Web Speech API — 英语 TTS 朗读 */

let voice: SpeechSynthesisVoice | null = null;

if (typeof window !== "undefined") {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => {
    const voices = speechSynthesis.getVoices();
    voice =
      voices.find((v) => v.name.includes("Google") && v.lang === "en-US") ??
      voices.find((v) => v.name === "Samantha") ??
      voices.find((v) => v.localService && v.lang === "en-US") ??
      voices.find((v) => v.lang.startsWith("en")) ??
      null;
  };
}

export function speak(word: string): void {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(word.toLowerCase());
  u.lang = "en-US";
  u.rate = 0.8;
  u.pitch = 1;
  u.volume = 1;
  if (voice) u.voice = voice;
  synth.speak(u);
}
