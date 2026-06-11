"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Word } from "@/types";
import { useGameState } from "@/lib/useGameState";
import { WordCard } from "./word-card";
import { ImageCard } from "./image-card";
import { EmptyState } from "./empty-state";
import { ManagePanel } from "./manage-panel";

const Celebration = dynamic(
  () => import("./celebration").then((m) => ({ default: m.Celebration })),
  { ssr: false },
);

const MIN_WORDS = 4;

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

  const handleComplete = useCallback(() => {
    setShowCelebration(true);
  }, []);

  const { state, selectWord, clickImage, newGame } = useGameState(
    words,
    handleComplete,
  );

  const handlePlayAgain = useCallback(() => {
    setShowCelebration(false);
    newGame();
  }, [newGame]);

  const handleWordsChange = useCallback((nextWords: Word[]) => {
    setWords(nextWords);
  }, []);

  const openManage = useCallback(() => setShowManage(true), []);
  const closeManage = useCallback(() => setShowManage(false), []);

  // 管理按钮 — 固定在右上角
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
              <ManagePanel
                words={words}
                onWordsChange={handleWordsChange}
                onClose={closeManage}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // 等待客户端初始化（避免 SSR hydration mismatch）
  if (!state.initialized) {
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

      <div className="game-area">
        {/* Word row */}
        <div className="card-row">
          {state.wordOrder.map((slot) => {
            const w = state.roundWords[slot];
            return (
              <WordCard
                key={w.origIdx}
                word={w.word}
                slot={slot}
                isSelected={state.selectedWordSlot === slot}
                isMatched={state.matchedSlots.has(slot)}
                isWrong={state.wrongWordSlot === slot}
                onClick={selectWord}
              />
            );
          })}
        </div>

        <CardConnector />

        {/* Image row */}
        <div className="card-row">
          {state.imageOrder.map((slot) => {
            const w = state.roundWords[slot];
            return (
              <ImageCard
                key={w.origIdx}
                image={w.image}
                word={w.word}
                slot={slot}
                isMatched={state.matchedSlots.has(slot)}
                isWrong={state.wrongImageSlot === slot}
                onClick={clickImage}
              />
            );
          })}
        </div>

        {/* Status bar */}
        <div className="status-bar">
          <span>
            错误：<span className="error-count">{state.errorCount}</span> 次
          </span>
          <button className="btn-play-again" onClick={handlePlayAgain}>
            🔄 再来一局
          </button>
        </div>
      </div>

      {/* 管理弹窗 */}
      {showManage ? (
        <div className="manage-modal-overlay" onClick={closeManage}>
          <div onClick={(e) => e.stopPropagation()}>
            <ManagePanel
              words={words}
              onWordsChange={handleWordsChange}
              onClose={closeManage}
            />
          </div>
        </div>
      ) : null}

      {showCelebration ? (
        <Celebration
          errorCount={state.errorCount}
          onPlayAgain={handlePlayAgain}
        />
      ) : null}
    </div>
  );
}
