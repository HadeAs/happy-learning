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
    "entering",
    isMatched && "matched",
    isWrong && "wrong",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cls}
      style={{ animationDelay: `${50 + slot * 90}ms` }}
      onClick={() => !isMatched && onClick(slot)}
    >
      {imgError ? (
        <span className="placeholder">{word.toLowerCase()}</span>
      ) : (
        <img
          src={image}
          alt={word.toLowerCase()}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
      {isMatched ? <span className="image-card-check">✓</span> : null}
    </div>
  );
});
