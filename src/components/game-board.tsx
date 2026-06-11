"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { Word, GameMode } from "@/types";
import { useGameState } from "@/lib/useGameState";
import { usePickGame } from "@/lib/usePickGame";
import { speak } from "@/lib/speech";
import { WordCard } from "./word-card";
import { ImageCard } from "./image-card";
import { EmptyState } from "./empty-state";
import { ManagePanel } from "./manage-panel";
import {
  BalloonIcon,
  SettingsIcon,
  MatchIcon,
  ImagePickIcon,
  WordPickIcon,
  RefreshIcon,
  CheckIcon,
  CrossIcon,
  SwapIcon,
  SpeakerOnIcon,
  SpeakerOffIcon,
  MenuIcon,
} from "./icons";

const Celebration = dynamic(
  () => import("./celebration").then((m) => ({ default: m.Celebration })),
  { ssr: false },
);

const MIN_WORDS = 4;

const MODES: { key: GameMode; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "match", label: "单词配对", Icon: MatchIcon },
  { key: "image-pick", label: "看词选图", Icon: ImagePickIcon },
  { key: "word-pick", label: "看图选词", Icon: WordPickIcon },
];

function CardConnector() {
  return (
    <div className="card-connector">
      <span className="connector-dot" />
      <span className="connector-dot" />
      <span className="connector-dot" />
      <span className="connector-dot" />
    </div>
  );
}

interface GameBoardProps {
  initialWords: Word[];
}

export function GameBoard({ initialWords }: GameBoardProps) {
  const [words, setWords] = useState<Word[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wordMatchGame_words");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length >= MIN_WORDS) return parsed;
        } catch { /* ignore */ }
      }
    }
    return initialWords;
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [mode, setMode] = useState<GameMode>("match");
  const [audioOn, setAudioOn] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);

  // ---- 图片加载追踪 ----
  const [imagesPending, setImagesPending] = useState(0);
  const [roundKey, setRoundKey] = useState(0);
  const imageCountRef = useRef(0);

  const advanceRound = useCallback(() => {
    setRoundKey((k) => k + 1);
    // 配对模式：4 张图片；看词选图：4 张图片；看图选词：1 张提示图
    const count = mode === "word-pick" ? 1 : 4;
    setImagesPending(count);
  }, [mode]);

  // 每轮 / 每次模式切换重置加载计数
  useEffect(() => { advanceRound(); }, [advanceRound]);

  // Pick 模式：答对自动进入下一轮时重置加载
  const pickRoundRef = useRef(0);
  useEffect(() => {
    if (pickState.correctCount > pickRoundRef.current) {
      pickRoundRef.current = pickState.correctCount;
      advanceRound();
    }
    if (pickState.correctCount === 0) pickRoundRef.current = 0;
  }, [pickState.correctCount, advanceRound]);

  const onImageDone = useCallback(() => {
    setImagesPending((p) => Math.max(0, p - 1));
  }, []);

  // ---- 游戏状态 ----
  const handleComplete = useCallback(() => {
    setShowCelebration(true);
  }, []);
  const { state: matchState, clickImage, newGame: newMatch, selectWord: rawSelectWord } = useGameState(words, handleComplete);
  const { state: pickState, select: rawPickSelect, newGame: newPick } = usePickGame(words);

  // ---- 音频：仅在匹配正确时朗读 ----

  // 配对模式：监听 matchedSlots 增加
  const prevMatchedRef = useRef(matchState.matchedSlots.size);
  useEffect(() => {
    if (!audioOn) { prevMatchedRef.current = matchState.matchedSlots.size; return; }
    if (matchState.matchedSlots.size <= prevMatchedRef.current) {
      prevMatchedRef.current = matchState.matchedSlots.size;
      return;
    }
    // 新增了一个配对 → 朗读
    const newMatched = [...matchState.matchedSlots].pop();
    if (newMatched !== undefined) {
      const w = matchState.roundWords[newMatched];
      if (w) speak(w.word);
    }
    prevMatchedRef.current = matchState.matchedSlots.size;
  }, [audioOn, matchState.matchedSlots, matchState.roundWords]);

  // Pick 模式：答对时朗读
  useEffect(() => {
    if (!audioOn) return;
    if (!pickState.justCorrect) return;
    speak(pickState.correct.word);
  }, [audioOn, pickState.justCorrect, pickState.correct.word]);

  // ---- 操作回调 ----
  const handlePlayAgain = useCallback(() => {
    setShowCelebration(false);
    if (mode === "match") newMatch(); else newPick();
    advanceRound();
  }, [mode, newMatch, newPick, advanceRound]);

  const handleWordsChange = useCallback((nextWords: Word[]) => {
    setWords(nextWords);
  }, []);

  const openManage = useCallback(() => setShowManage(true), []);
  const closeManage = useCallback(() => setShowManage(false), []);

  const topButtons = (
    <div className="top-actions">
      <button className="btn-audio" onClick={() => setAudioOn((prev) => !prev)} title={audioOn ? "关闭发音" : "开启发音"}>
        {audioOn ? <SpeakerOnIcon size={18} /> : <SpeakerOffIcon size={18} />}
      </button>
      <button className="btn-menu-toggle" onClick={() => setShowModeMenu(true)} title="切换模式">
        <MenuIcon size={18} />
      </button>
      <button className="btn-manage" onClick={openManage}>
        <SettingsIcon size={16} />
        <span style={{ marginLeft: 6 }}>管理单词库</span>
      </button>
    </div>
  );

  // ---- 渲染 ----
  const isLoading = imagesPending > 0;

  if (words.length < MIN_WORDS) {
    return (
      <div className="container">
        {topButtons}
        <div className="game-area" style={{ justifyContent: "center" }}>
          <EmptyState onGoManage={openManage} />
        </div>
        {showManage ? (
          <div className="manage-modal-overlay" onClick={closeManage}>
            <div onClick={(e) => e.stopPropagation()}>
              <ManagePanel words={words} onWordsChange={handleWordsChange} onClose={closeManage} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const isReady = mode === "match" ? matchState.initialized : pickState.initialized;
  if (!isReady) {
    return (
      <div className="container">
        {topButtons}
        <div className="header">
          <h1><BalloonIcon size={28} /> 快乐学英语</h1>
        </div>
        <div className="game-area" style={{ justifyContent: "center", alignItems: "center" }}>
          <p style={{ color: "var(--slate)", fontSize: 18, fontWeight: 600 }}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {topButtons}

      <div className="header">
        <h1><BalloonIcon size={30} /> 快乐学英语</h1>
      </div>

      <div className="mode-tabs">
        {MODES.map((m) => {
          const Icon = m.Icon;
          return (
            <button
              key={m.key}
              className={`mode-tab${mode === m.key ? " active" : ""}`}
              onClick={() => {
                setMode(m.key);
                setShowCelebration(false);
              }}
            >
              <Icon size={18} />
              <span style={{ marginLeft: 5 }} className="tab-label">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---- 模式 A：单词配对 ---- */}
      {mode === "match" && (
        <div className="game-area" style={{ position: "relative" }}>
          {isLoading && <div className="loading-overlay" />}
          <div className="card-row">
            {matchState.wordOrder.map((slot) => {
              const w = matchState.roundWords[slot];
              return (
                <WordCard
                  key={w.origIdx}
                  word={w.word}
                  slot={slot}
                  isSelected={matchState.selectedWordSlot === slot}
                  isMatched={matchState.matchedSlots.has(slot)}
                  isWrong={matchState.wrongWordSlot === slot}
                  audioOn={audioOn}
                  onClick={rawSelectWord}
                />
              );
            })}
          </div>
          <CardConnector />
          <div className="card-row">
            {matchState.imageOrder.map((slot) => {
              const w = matchState.roundWords[slot];
              return (
                <ImageCard
                  key={w.origIdx}
                  image={w.image}
                  word={w.word}
                  slot={slot}
                  isMatched={matchState.matchedSlots.has(slot)}
                  isWrong={matchState.wrongImageSlot === slot}
                  onClick={clickImage}
                  onImageDone={onImageDone}
                  roundKey={roundKey}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ---- 模式 B：看词选图 ---- */}
      {mode === "image-pick" && (
        <>
          <div className="game-area" style={{ position: "relative" }}>
            {isLoading && <div className="loading-overlay" />}
            <div className="card-row">
              <div className="prompt-card">
                <div className="card word-card" style={{ pointerEvents: "none", background: "var(--coral-light)", transform: "scale(1.05)" }}>
                  {pickState.correct.word.toLowerCase()}
                </div>
              </div>
            </div>
            <CardConnector />
            <div className="card-row">
              {pickState.order.map((candIdx, displayPos) => {
                const w = pickState.candidates[candIdx];
                const isCorrectPick = pickState.justCorrect && w.word === pickState.correct.word;
                const isWrongPick = pickState.wrong === displayPos;
                return (
                  <ImageCard
                    key={displayPos}
                    image={w.image}
                    word={w.word}
                    slot={displayPos}
                    isMatched={isCorrectPick}
                    isWrong={isWrongPick}
                    onClick={rawPickSelect}
                    onImageDone={onImageDone}
                    roundKey={roundKey}
                  />
                );
              })}
            </div>
          </div>
          <div className="status-bar">
            <span>
              <CheckIcon size={18} /> {pickState.correctCount} · <CrossIcon size={18} /> {pickState.errorCount} 次
            </span>
            <button className="btn-play-again" onClick={handlePlayAgain}>
              <SwapIcon size={18} /> 换一个
            </button>
          </div>
        </>
      )}

      {/* ---- 模式 C：看图选词 ---- */}
      {mode === "word-pick" && (
        <>
          <div className="game-area" style={{ position: "relative" }}>
            {isLoading && <div className="loading-overlay" />}
            <div className="card-row">
              <div className="prompt-card">
                <div className="card image-card" style={{ pointerEvents: "none", background: "var(--coral-light)", transform: "scale(1.05)", width: 160, height: 160 }}>
                  <PromptImage
                    src={pickState.correct.image}
                    alt={pickState.correct.word}
                    onDone={onImageDone}
                    roundKey={roundKey}
                  />
                </div>
              </div>
            </div>
            <CardConnector />
            <div className="card-row">
              {pickState.order.map((candIdx, displayPos) => {
                const w = pickState.candidates[candIdx];
                const isCorrectPick = pickState.justCorrect && w.word === pickState.correct.word;
                const isWrongPick = pickState.wrong === displayPos;
                return (
                  <WordCard
                    key={displayPos}
                    word={w.word}
                    slot={displayPos}
                    isSelected={false}
                    isMatched={isCorrectPick}
                    isWrong={isWrongPick}
                    audioOn={audioOn}
                    onClick={rawPickSelect}
                  />
                );
              })}
            </div>
          </div>
          <div className="status-bar">
            <span>
              <CheckIcon size={18} /> {pickState.correctCount} · <CrossIcon size={18} /> {pickState.errorCount} 次
            </span>
            <button className="btn-play-again" onClick={handlePlayAgain}>
              <SwapIcon size={18} /> 换一个
            </button>
          </div>
        </>
      )}

      {showManage ? (
        <div className="manage-modal-overlay" onClick={closeManage}>
          <div onClick={(e) => e.stopPropagation()}>
            <ManagePanel words={words} onWordsChange={handleWordsChange} onClose={closeManage} />
          </div>
        </div>
      ) : null}

      {showCelebration ? (
        <Celebration errorCount={matchState.errorCount} correctCount={4} onPlayAgain={handlePlayAgain} />
      ) : null}

      {/* 移动端模式菜单 */}
      <div className={`mode-menu-overlay${showModeMenu ? " show" : ""}`} onClick={() => setShowModeMenu(false)}>
        <div className="mode-menu-box" onClick={(e) => e.stopPropagation()}>
          {MODES.map((m) => {
            const Icon = m.Icon;
            return (
              <button
                key={m.key}
                className={`mode-tab${mode === m.key ? " active" : ""}`}
                onClick={() => {
                  setMode(m.key);
                  setShowCelebration(false);
                  setShowModeMenu(false);
                }}
              >
                <Icon size={18} />
                <span style={{ marginLeft: 5 }} className="tab-label">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** 看图选词模式的提示图片：带加载回调 */
function PromptImage({
  src,
  alt,
  onDone,
  roundKey,
}: {
  src: string;
  alt: string;
  onDone: () => void;
  roundKey: number;
}) {
  const [done, setDone] = useState(false);
  const prevRound = useRef(roundKey);

  if (prevRound.current !== roundKey) {
    prevRound.current = roundKey;
    setDone(false);
  }

  return (
    <img
      src={src}
      alt={alt.toLowerCase()}
      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      onLoad={() => {
        if (!done) { setDone(true); onDone(); }
      }}
      onError={() => {
        if (!done) { setDone(true); onDone(); }
      }}
    />
  );
}
