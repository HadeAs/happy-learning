/** Web Speech API — 英语 TTS 朗读 */

let voice: SpeechSynthesisVoice | null = null;

/** 预加载英语语音 */
function findVoice(): SpeechSynthesisVoice | null {
  if (voice) return voice;
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  // 优先 US English
  voice =
    voices.find((v) => v.lang === "en-US") ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0];
  return voice;
}

// 确保语音列表在加载后才能获取
if (typeof window !== "undefined") {
  speechSynthesis.getVoices(); // 触发加载
  speechSynthesis.onvoiceschanged = () => {
    voice = findVoice();
  };
}

/** 朗读英文单词 */
export function speak(word: string): void {
  if (typeof window === "undefined") return;
  const synth = speechSynthesis;
  // 取消正在播放的语音
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  utterance.volume = 0.9;

  const v = findVoice();
  if (v) utterance.voice = v;

  synth.speak(utterance);
}
