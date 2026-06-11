"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Word, GameMode } from "@/types";
import { useGameState } from "@/lib/useGameState";
import { usePickGame } from "@/lib/usePickGame";
import { WordCard } from "./word-card";
import { ImageCard } from "./image-card";
import { EmptyState } from "./empty-state";
import { ManagePanel } from "./manage-panel";

const Celebration = dynamic(
  () => import("./celebration").then((m) => ({ default: m.Celebration })),
  { ssr: false },
);

const MIN_WORDS = 4;

const MODES: { key: GameMode; label: string; icon: string }[] = [
  { key: "match", label: "🔤 单词配对", icon: "" },
  { key: "image-pick", label: "🖼️ 看词选图", icon: "" },
  { key: "word-pick", label: "📝 看图选词", icon: "" },
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
  const [words, setWords] = useState<Word[]>(initialWords);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [mode, setMode] = useState<GameMode>("match");

  // ---- 配对模式 ----
  const handleComplete = useCallback(() => {
    setShowCelebration(true);
  }, []);
  const { state: matchState, selectWord, clickImage, newGame: newMatch } = useGameState(words, handleComplete);

  // ---- 选择模式 ----
  const { state: pickState, select: pickSelect, newGame: newPick } = usePickGame(words);

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

  const manageBtn = (
    <button className="btn-manage" onClick={openManage}>
      📝 管理单词库
    </button>
  );

  if (words.length < MIN_WORDS) {
    return (
      <div className="container">
        {manageBtn}
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

  // ---- 等待客户端初始化 ----
  const isReady = mode === "match" ? matchState.initialized : pickState.initialized;
  if (!isReady) {
    return (
      <div className="container">
        {manageBtn}
        <div className="header">
          <h1>🎈 幼儿英语单词匹配游戏</h1>
        </div>
        <div className="game-area" style={{ justifyContent: "center", alignItems: "center" }}>
          <p style={{ color: "var(--slate)", fontSize: 18, fontWeight: 600 }}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {manageBtn}

      <div className="header">
        <h1>🎈 幼儿英语单词匹配游戏</h1>
      </div>

      {/* 模式切换 */}
      <div className="mode-tabs">
        {MODES.map((m) => (
          <button
            key={m.key}
            className={`mode-tab${mode === m.key ? " active" : ""}`}
            onClick={() => {
              setMode(m.key);
              setShowCelebration(false);
            }}
          >
            {m.label}
          </button>
        ))}
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
          <div className="status-bar">
            <span>
              错误：<span className="error-count">{matchState.errorCount}</span> 次
            </span>
            <button className="btn-play-again" onClick={handlePlayAgain}>
              🔄 再来一局
            </button>
          </div>
        </div>
      )}

      {/* ---- 模式 B：看词选图 ---- */}
      {mode === "image-pick" && (
        <div className="game-area">
          {/* 提示单词 */}
          <div className="card-row">
            <div className="prompt-card">
              <div className="card word-card" style={{ pointerEvents: "none", borderColor: "var(--coral)", background: "var(--coral-light)", transform: "scale(1.05)" }}>
                {pickState.correct.word.toLowerCase()}
              </div>
            </div>
          </div>
          <CardConnector />
          {/* 四张图片 */}
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
              ✅ {pickState.correctCount} · ❌ {pickState.errorCount} 次
            </span>
            <button className="btn-play-again" onClick={handlePlayAgain}>
              🔄 重新开始
            </button>
          </div>
        </div>
      )}

      {/* ---- 模式 C：看图选词 ---- */}
      {mode === "word-pick" && (
        <div className="game-area">
          {/* 提示图片 */}
          <div className="card-row">
            <div className="prompt-card">
              <div className="card image-card" style={{ pointerEvents: "none", borderColor: "var(--coral)", background: "var(--coral-light)", transform: "scale(1.05)", width: 160, height: 160 }}>
                <img src={pickState.correct.image} alt={pickState.correct.word} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            </div>
          </div>
          <CardConnector />
          {/* 四个单词 */}
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
              ✅ {pickState.correctCount} · ❌ {pickState.errorCount} 次
            </span>
            <button className="btn-play-again" onClick={handlePlayAgain}>
              🔄 重新开始
            </button>
          </div>
        </div>
      )}

      {/* 管理弹窗 */}
      {showManage ? (
        <div className="manage-modal-overlay" onClick={closeManage}>
          <div onClick={(e) => e.stopPropagation()}>
            <ManagePanel words={words} onWordsChange={handleWordsChange} onClose={closeManage} />
          </div>
        </div>
      ) : null}

      {showCelebration ? (
        <Celebration errorCount={matchState.errorCount} onPlayAgain={handlePlayAgain} />
      ) : null}
    </div>
  );
}
