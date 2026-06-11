"use client";
import { useState, useCallback, useEffect } from "react";
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

  const handleComplete = useCallback(() => {
    setShowCelebration(true);
  }, []);
  const { state: matchState, selectWord: rawSelectWord, clickImage, newGame: newMatch } = useGameState(words, handleComplete);

  const { state: pickState, select: rawPickSelect, newGame: newPick } = usePickGame(words);

  // ---- 音频：配对模式 — 选单词时朗读 ----
  const selectWord = useCallback(
    (slot: number) => {
      console.log("[TTS] selectWord called, audioOn:", audioOn, "matched:", matchState.matchedSlots.has(slot), "selectedSlot:", matchState.selectedWordSlot, "slot:", slot);
      if (audioOn && !matchState.matchedSlots.has(slot)) {
        const w = matchState.roundWords[slot];
        console.log("[TTS] word:", w.word);
        if (matchState.selectedWordSlot !== slot) {
          console.log("[TTS] calling speak...");
          speak(w.word);
        }
      }
      rawSelectWord(slot);
    },
    [audioOn, matchState, rawSelectWord],
  );

  // ---- 音频：选择模式 — 答对时朗读 ----
  const pickSelect = useCallback(
    (displayPos: number) => {
      if (audioOn && mode === "word-pick") {
        // 看图选词：点击任意单词都朗读
        const w = pickState.candidates[pickState.order[displayPos]];
        speak(w.word);
      }
      rawPickSelect(displayPos);
    },
    [audioOn, mode, pickState.candidates, pickState.order, rawPickSelect],
  );

  // 看词选图/看图选词：答对时朗读
  useEffect(() => {
    if (!audioOn) return;
    if (!pickState.justCorrect) return;
    speak(pickState.correct.word);
  }, [audioOn, pickState.justCorrect, pickState.correct.word]);

  const handlePlayAgain = useCallback(() => {
    setShowCelebration(false);
    if (mode === "match") {
      newMatch();
    } else {
      newPick();
    }
  }, [mode, newMatch, newPick]);

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
      <button className="btn-manage" onClick={openManage}>
        <SettingsIcon size={16} />
        <span style={{ marginLeft: 6 }}>管理单词库</span>
      </button>
    </div>
  );

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
              <span style={{ marginLeft: 5 }}>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---- 模式 A：单词配对 ---- */}
      {mode === "match" && (
        <div className="game-area">
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
                  onClick={selectWord}
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
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ---- 模式 B：看词选图 ---- */}
      {mode === "image-pick" && (
        <div className="game-area">
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
                  onClick={pickSelect}
                />
              );
            })}
          </div>
          <div className="status-bar">
            <span>
              <CheckIcon size={18} /> {pickState.correctCount} · <CrossIcon size={18} /> {pickState.errorCount} 次
            </span>
            <button className="btn-play-again" onClick={handlePlayAgain}>
              <SwapIcon size={18} /> 换一个
            </button>
          </div>
        </div>
      )}

      {/* ---- 模式 C：看图选词 ---- */}
      {mode === "word-pick" && (
        <div className="game-area">
          <div className="card-row">
            <div className="prompt-card">
              <div className="card image-card" style={{ pointerEvents: "none", background: "var(--coral-light)", transform: "scale(1.05)", width: 160, height: 160 }}>
                <img src={pickState.correct.image} alt={pickState.correct.word} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
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
                  onClick={pickSelect}
                />
              );
            })}
          </div>
          <div className="status-bar">
            <span>
              <CheckIcon size={18} /> {pickState.correctCount} · <CrossIcon size={18} /> {pickState.errorCount} 次
            </span>
            <button className="btn-play-again" onClick={handlePlayAgain}>
              <SwapIcon size={18} /> 换一个
            </button>
          </div>
        </div>
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
    </div>
  );
}
