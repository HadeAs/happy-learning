"use client";
import { memo, useState } from "react";

interface ImageCardProps {
  image: string;
  word: string;
  slot: number;
  isMatched: boolean;
  isWrong: boolean;
  onClick: (slot: number) => void;
}

export const ImageCard = memo(function ImageCard({
  image,
  word,
  slot,
  isMatched,
  isWrong,
  onClick,
}: ImageCardProps) {
  const [imgError, setImgError] = useState(false);

  const cls = [
    "card",
    "image-card",
    isMatched && "matched",
    isWrong && "wrong",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} onClick={() => onClick(slot)}>
      {imgError ? (
        <span className="placeholder">{word}</span>
      ) : (
        <img
          src={image}
          alt={word}
          onError={() => setImgError(true)}
        />
      )}
      {isMatched ? <span className="image-card-check">✓</span> : null}
    </div>
  );
});
