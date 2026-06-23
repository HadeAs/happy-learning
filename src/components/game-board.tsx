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
  BalloonIcon, SettingsIcon, MatchIcon, ImagePickIcon, WordPickIcon,
  RefreshIcon, SwapIcon, SpeakerOnIcon, SpeakerOffIcon, MenuIcon,
} from "./icons";

const Celebration = dynamic(() => import("./celebration").then(m => ({ default: m.Celebration })), { ssr: false });

const MIN_WORDS = 4;
const PARENT_PIN = "2025"; // 简单年份锁

const MODES: { key: GameMode; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "match", label: "单词配对", Icon: MatchIcon },
  { key: "image-pick", label: "看词选图", Icon: ImagePickIcon },
  { key: "word-pick", label: "看图选词", Icon: WordPickIcon },
];

function CardConnector() {
  return (
    <div className="card-connector">
      <span className="connector-dot" /><span className="connector-dot" />
      <span className="connector-dot" /><span className="connector-dot" />
    </div>
  );
}

function ProgressDots({ total, done }: { total: number; done: number }) {
  return (
    <div className="progress-dots">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`progress-dot${i < done ? " done" : ""}`} />
      ))}
    </div>
  );
}

interface GameBoardProps { initialWords: Word[] }

export function GameBoard({ initialWords }: GameBoardProps) {
  const [words, setWords] = useState<Word[]>(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("wordMatchGame_words");
      if (s) { try { const p = JSON.parse(s); if (Array.isArray(p) && p.length >= MIN_WORDS) return p; } catch {} }
    }
    return initialWords;
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [parentGate, setParentGate] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [mode, setMode] = useState<GameMode>("match");
  const [audioOn, setAudioOn] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);

  const [roundKey, setRoundKey] = useState(0);
  const [imagesPending, setImagesPending] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advanceRound = useCallback(() => {
    setRoundKey(k => k + 1);
    setImagesPending(mode === "word-pick" ? 1 : 4);
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    pendingTimer.current = setTimeout(() => setShowLoading(true), 250);
  }, [mode]);

  useEffect(() => { advanceRound(); }, [advanceRound]);

  const onImageDone = useCallback(() => {
    setImagesPending(p => {
      const n = Math.max(0, p - 1);
      if (n === 0) { if (pendingTimer.current) clearTimeout(pendingTimer.current); setShowLoading(false); }
      return n;
    });
  }, []);

  const pickRoundRef = useRef(0);
  const handleComplete = useCallback(() => setShowCelebration(true), []);
  const { state: matchState, clickImage, newGame: newMatch, selectWord: rawSelectWord } = useGameState(words, handleComplete);
  const { state: pickState, select: rawPickSelect, newGame: newPick } = usePickGame(words);

  useEffect(() => {
    if (pickState.correctCount > pickRoundRef.current) {
      pickRoundRef.current = pickState.correctCount;
      advanceRound();
    }
    if (pickState.correctCount === 0) pickRoundRef.current = 0;
  }, [pickState.correctCount, advanceRound]);

  // 仅匹配正确时发音
  const prevMatchSize = useRef(matchState.matchedSlots.size);
  useEffect(() => {
    if (audioOn && matchState.matchedSlots.size > prevMatchSize.current) {
      speak(matchState.roundWords[0].word); // 同一个词，取任意一个即可
    }
    prevMatchSize.current = matchState.matchedSlots.size;
  }, [audioOn, matchState.matchedSlots.size, matchState.roundWords]);

  useEffect(() => {
    if (!audioOn || !pickState.justCorrect) return;
    speak(pickState.correct.word);
  }, [audioOn, pickState.justCorrect, pickState.correct.word]);

  const handlePlayAgain = useCallback(() => {
    setShowCelebration(false);
    if (mode === "match") newMatch(); else newPick();
    advanceRound();
  }, [mode, newMatch, newPick, advanceRound]);

  const handleWordsChange = useCallback((next: Word[]) => setWords(next), []);
  const openManage = useCallback(() => {
    setParentGate(true); setPinInput("");
  }, []);
  const closeManage = useCallback(() => setShowManage(false), []);

  const handlePinSubmit = () => {
    if (pinInput === PARENT_PIN) { setParentGate(false); setShowManage(true); }
    else setPinInput("");
  };

  const showOverlay = showLoading && imagesPending > 0;

  if (words.length < MIN_WORDS) {
    return (
      <div className="container">
        <div className="top-actions">
          <button className="btn-audio" onClick={() => setAudioOn(p => !p)}>{audioOn ? <SpeakerOnIcon size={20}/> : <SpeakerOffIcon size={20}/>}</button>
          <button className="btn-manage" onClick={openManage}><SettingsIcon size={18} /><span style={{marginLeft:4}}>单词库</span></button>
        </div>
        <div className="game-area" style={{justifyContent:"center"}}><EmptyState onGoManage={openManage}/></div>
      </div>
    );
  }

  const isReady = mode === "match" ? matchState.initialized : pickState.initialized;
  if (!isReady) {
    return (
      <div className="container">
        <div className="top-actions">
          <button className="btn-audio" onClick={() => setAudioOn(p => !p)}>{audioOn ? <SpeakerOnIcon size={20}/> : <SpeakerOffIcon size={20}/>}</button>
          <button className="btn-manage" onClick={openManage}><SettingsIcon size={18}/><span style={{marginLeft:4}}>单词库</span></button>
        </div>
        <div className="header"><h1><BalloonIcon size={24}/> 快乐学英语</h1></div>
        <div className="game-area" style={{justifyContent:"center",alignItems:"center"}}>
          <p style={{color:"var(--slate)",fontSize:18,fontWeight:700}}>加载中...</p>
        </div>
      </div>
    );
  }

  const matchDone = matchState.matchedSlots.size;

  return (
    <div className="container">
      {/* 右上角 */}
      <div className="top-actions">
        <button className="btn-audio" onClick={() => setAudioOn(p => !p)} title={audioOn ? "关闭发音" : "开启发音"}>
          {audioOn ? <SpeakerOnIcon size={20}/> : <SpeakerOffIcon size={20}/>}
        </button>
        <button className="btn-menu-toggle" onClick={() => setShowModeMenu(true)}><MenuIcon size={20}/></button>
        <button className="btn-manage" onClick={openManage}><SettingsIcon size={18}/><span style={{marginLeft:4}}>单词库</span></button>
      </div>

      <div className="header"><h1><BalloonIcon size={24}/> 快乐学英语</h1></div>

      <div className="mode-tabs">
        {MODES.map(m => {
          const I = m.Icon;
          return <button key={m.key} className={`mode-tab${mode===m.key?" active":""}`}
            onClick={() => { setMode(m.key); setShowCelebration(false); }}>
            <I size={20}/> <span className="tab-label">{m.label}</span>
          </button>;
        })}
      </div>

      {/* ===== 模式 A ===== */}
      {mode === "match" && (
        <div className="game-area" style={{position:"relative"}}>
          <ProgressDots total={4} done={matchDone} />
          <div className="card-row">
            {matchState.wordOrder.map(slot => {
              const w = matchState.roundWords[slot];
              return <WordCard key={`${roundKey}-w${w.origIdx}`} word={w.word} slot={slot}
                isSelected={matchState.selectedWordSlot===slot}
                isMatched={matchState.matchedSlots.has(slot)}
                isWrong={matchState.wrongWordSlot===slot}
                audioOn={audioOn} onClick={rawSelectWord} />;
            })}
          </div>
          <CardConnector />
          <div className="card-row">
            {matchState.imageOrder.map(slot => {
              const w = matchState.roundWords[slot];
              return <ImageCard key={`${roundKey}-i${w.origIdx}`} image={w.image} word={w.word} slot={slot}
                isMatched={matchState.matchedSlots.has(slot)}
                isWrong={matchState.wrongImageSlot===slot}
                onClick={clickImage} onImageDone={onImageDone} roundKey={roundKey} />;
            })}
          </div>
          {showOverlay && <div className="loading-overlay"/>}
        </div>
      )}

      {/* ===== 模式 B ===== */}
      {mode === "image-pick" && (<>
        <div className="game-area" style={{position:"relative"}}>
          <div className="card-row">
            <div className="prompt-card">
              <div className="card word-card" style={{pointerEvents:"none",borderColor:"var(--navy)",borderWidth:5,background:"white"}}>
                {pickState.correct.word.toLowerCase()}
              </div>
            </div>
          </div>
          <CardConnector />
          <div className="card-row">
            {pickState.order.map((ci, dp) => {
              const w = pickState.candidates[ci];
              return <ImageCard key={`${roundKey}-p${dp}`} image={w.image} word={w.word} slot={dp}
                isMatched={pickState.justCorrect && w.word===pickState.correct.word}
                isWrong={pickState.wrong===dp}
                onClick={rawPickSelect} onImageDone={onImageDone} roundKey={roundKey} />;
            })}
          </div>
          {showOverlay && <div className="loading-overlay"/>}
        </div>
        <div className="status-bar">
          <span>{"😊".repeat(pickState.correctCount)}{"😢".repeat(Math.min(pickState.errorCount,5))}</span>
          <button className="btn-play-again" onClick={handlePlayAgain}><SwapIcon size={20}/> 换一个</button>
        </div>
      </>)}

      {/* ===== 模式 C ===== */}
      {mode === "word-pick" && (<>
        <div className="game-area" style={{position:"relative"}}>
          <div className="card-row">
            <div className="prompt-card">
              <div className="card image-card" style={{pointerEvents:"none",borderColor:"var(--navy)",borderWidth:5,background:"white",width:200,height:200}}>
                <img src={pickState.correct.image} alt={pickState.correct.word} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}
                  onLoad={onImageDone} onError={onImageDone} />
              </div>
            </div>
          </div>
          <CardConnector />
          <div className="card-row">
            {pickState.order.map((ci, dp) => {
              const w = pickState.candidates[ci];
              return <WordCard key={`${roundKey}-q${dp}`} word={w.word} slot={dp}
                isSelected={false}
                isMatched={pickState.justCorrect && w.word===pickState.correct.word}
                isWrong={pickState.wrong===dp}
                audioOn={audioOn} onClick={rawPickSelect} />;
            })}
          </div>
          {showOverlay && <div className="loading-overlay"/>}
        </div>
        <div className="status-bar">
          <span>{"😊".repeat(pickState.correctCount)}{"😢".repeat(Math.min(pickState.errorCount,5))}</span>
          <button className="btn-play-again" onClick={handlePlayAgain}><SwapIcon size={20}/> 换一个</button>
        </div>
      </>)}

      {/* 庆祝 */}
      {showCelebration && <Celebration errorCount={matchState.errorCount} correctCount={4} onPlayAgain={handlePlayAgain} />}

      {/* 家长锁 */}
      {parentGate && !showManage && (
        <div className="parent-gate" onClick={() => setParentGate(false)}>
          <span>🔒 输入密码进入单词库</span>
          <input type="password" value={pinInput} onChange={e => setPinInput(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handlePinSubmit()}
            onClick={e => e.stopPropagation()} autoFocus maxLength={6}
            placeholder="****" />
        </div>
      )}

      {/* 管理弹窗 */}
      {showManage && (
        <div className="manage-modal-overlay" onClick={closeManage}>
          <div onClick={e => e.stopPropagation()}><ManagePanel words={words} onWordsChange={handleWordsChange} onClose={closeManage}/></div>
        </div>
      )}

      {/* 模式菜单 */}
      <div className={`mode-menu-overlay${showModeMenu?" show":""}`} onClick={() => setShowModeMenu(false)}>
        <div className="mode-menu-box" onClick={e => e.stopPropagation()}>
          {MODES.map(m => {
            const I = m.Icon;
            return <button key={m.key} className={`mode-tab${mode===m.key?" active":""}`}
              onClick={() => { setMode(m.key); setShowCelebration(false); setShowModeMenu(false); }}>
              <I size={20}/> <span style={{marginLeft:5}}>{m.label}</span>
            </button>;
          })}
        </div>
      </div>
    </div>
  );
}
