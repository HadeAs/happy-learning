"use client";
import { useRef } from "react";
import { useState } from "react";

interface ImageCardProps {
  image: string;
  word: string;
  slot: number;
  isMatched: boolean;
  isWrong: boolean;
  onClick: (slot: number) => void;
}

const THROTTLE_MS = 300;

export function ImageCard({
  image,
  word,
  slot,
  isMatched,
  isWrong,
  onClick,
}: ImageCardProps) {
  const [imgError, setImgError] = useState(false);
  const lastClick = useRef(0);

  const cls = [
    "card",
    "image-card",
    "entering",
    isMatched && "matched",
    isWrong && "wrong",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (isMatched) return;
    const now = Date.now();
    if (now - lastClick.current < THROTTLE_MS) return;
    lastClick.current = now;
    onClick(slot);
  };

  return (
    <div
      className={cls}
      style={{ animationDelay: `${50 + slot * 90}ms` }}
      onClick={handleClick}
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
}
