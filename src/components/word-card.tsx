"use client";
import { speak } from "@/lib/speech";

interface WordCardProps {
  word: string;
  slot: number;
  isSelected: boolean;
  isMatched: boolean;
  isWrong: boolean;
  audioOn: boolean;
  onClick: (slot: number) => void;
}

export function WordCard({
  word,
  slot,
  isSelected,
  isMatched,
  isWrong,
  audioOn,
  onClick,
}: WordCardProps) {
  const cls = [
    "card",
    "word-card",
    "entering",
    isSelected && "selected",
    isMatched && "matched",
    isWrong && "wrong",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cls}
      style={{ animationDelay: `${50 + slot * 90}ms` }}
      onClick={() => {
        if (isMatched) return;
        // 在原生点击事件中同步调用 speak，紧贴用户手势
        if (audioOn && !isSelected) speak(word);
        onClick(slot);
      }}
    >
      {word.toLowerCase()}
      {isMatched ? <span className="match-check">✓</span> : null}
    </div>
  );
}
