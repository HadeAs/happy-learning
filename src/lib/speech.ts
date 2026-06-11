/** 英语 TTS 朗读 — HTML Audio + Google TTS */

export function speak(word: string): void {
  if (typeof window === "undefined") return;

  const q = encodeURIComponent(word.toLowerCase());
  const audio = new Audio(
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${q}`,
  );

  // 不需要 preload，直接播放
  audio.play().catch(() => {
    // 某些浏览器禁止从 Google 拉取音频，回退到 speechSynthesis
    const u = new SpeechSynthesisUtterance(word.toLowerCase());
    u.lang = "en-US";
    u.rate = 0.8;
    speechSynthesis.speak(u);
  });
}
