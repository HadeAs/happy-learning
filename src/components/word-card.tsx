"use client";

interface WordCardProps {
  word: string;
  slot: number;
  isSelected: boolean;
  isMatched: boolean;
  isWrong: boolean;
  onClick: (slot: number) => void;
}

export function WordCard({
  word,
  slot,
  isSelected,
  isMatched,
  isWrong,
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
        console.log("[TTS] WordCard clicked, slot:", slot, "isMatched:", isMatched);
        if (!isMatched) onClick(slot);
      }}
    >
      {word.toLowerCase()}
      {isMatched ? <span className="match-check">✓</span> : null}
    </div>
  );
}
