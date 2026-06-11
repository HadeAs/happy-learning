"use client";
import { useRef, useState } from "react";

interface ImageCardProps {
  image: string;
  word: string;
  slot: number;
  isMatched: boolean;
  isWrong: boolean;
  onClick: (slot: number) => void;
  onImageDone?: () => void;
  roundKey?: number;
}

const THROTTLE_MS = 300;

export function ImageCard({
  image,
  word,
  slot,
  isMatched,
  isWrong,
  onClick,
  onImageDone,
  roundKey = 0,
}: ImageCardProps) {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const lastClick = useRef(0);
  const prevRound = useRef(roundKey);

  // 新一轮开始时重置加载状态
  if (prevRound.current !== roundKey) {
    prevRound.current = roundKey;
    setLoaded(false);
    setImgError(false);
  }

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

  const handleLoad = () => {
    if (!loaded) {
      setLoaded(true);
      onImageDone?.();
    }
  };

  const handleError = () => {
    setImgError(true);
    if (!loaded) {
      setLoaded(true);
      onImageDone?.();
    }
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
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {isMatched ? <span className="image-card-check">✓</span> : null}
    </div>
  );
}
