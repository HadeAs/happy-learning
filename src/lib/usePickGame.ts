import { useReducer, useCallback, useRef, useEffect } from "react";
import type { Word } from "@/types";
import { shuffleArray } from "@/lib/shuffle";

// ==================== State ====================

export interface PickState {
  /** 正确的目标单词 */
  correct: Word;
  /** 候选选项（4个，其中一个正确） */
  candidates: Word[];
  /** 显示顺序打乱（0-3 的排列） */
  order: number[];
  /** 当前选中项索引（order 中的位置），null 为未选 */
  selected: number | null;
  /** 错误项的索引，触发动画的 */
  wrong: number | null;
  /** 已正确过的轮次 */
  correctCount: number;
  /** 错误次数 */
  errorCount: number;
  locked: boolean;
  initialized: boolean;
  /** 当前轮是否刚正确（用于短暂绿闪后自动下一轮） */
  justCorrect: boolean;
}

type Action =
  | { type: "SELECT"; displayPos: number }
  | { type: "CLEAR_WRONG" }
  | { type: "NEXT_ROUND" }
  | { type: "NEW_GAME"; words: Word[] };

function pickRounds(words: Word[], count: number): Word[] {
  const indices = shuffleArray(Array.from({ length: words.length }, (_, i) => i));
  return indices.slice(0, count).map((i) => words[i]);
}

function createRound(words: Word[]): PickState {
  const [correct, ...distractors] = pickRounds(words, 4);
  const candidates = shuffleArray([correct, ...distractors]);
  return {
    correct,
    candidates,
    order: [0, 1, 2, 3],
    selected: null,
    wrong: null,
    correctCount: 0,
    errorCount: 0,
    locked: false,
    initialized: true,
    justCorrect: false,
  };
}

function reducer(state: PickState, action: Action): PickState {
  switch (action.type) {
    case "SELECT": {
      if (state.locked || !state.initialized) return state;
      const picked = state.candidates[state.order[action.displayPos]];
      const isCorrect = picked.word === state.correct.word;

      if (isCorrect) {
        return {
          ...state,
          selected: action.displayPos,
          justCorrect: true,
          correctCount: state.correctCount + 1,
          locked: true,
        };
      }
      return {
        ...state,
        wrong: action.displayPos,
        errorCount: state.errorCount + 1,
        selected: action.displayPos,
        locked: true,
      };
    }

    case "CLEAR_WRONG": {
      return { ...state, wrong: null, selected: null, locked: false };
    }

    case "NEXT_ROUND": {
      const next = createRound(state.candidates.map((_, i) => state.candidates[i]));
      return {
        ...next,
        correctCount: state.correctCount,
        errorCount: state.errorCount,
      };
    }

    case "NEW_GAME": {
      return {
        ...createRound(action.words),
        correctCount: 0,
        errorCount: 0,
      };
    }

    default:
      return state;
  }
}

function makeInitState(words: Word[]): PickState {
  return {
    ...createRound(words),
    initialized: false, // will be set by useEffect
  };
}

// ==================== Hook ====================

export function usePickGame(words: Word[]) {
  const [state, dispatch] = useReducer(reducer, words, makeInitState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start first game on client only
  useEffect(() => {
    dispatch({ type: "NEW_GAME", words });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wrong → clear after animation
  useEffect(() => {
    if (state.wrong !== null && state.justCorrect === false) {
      timerRef.current = setTimeout(() => {
        dispatch({ type: "CLEAR_WRONG" });
      }, 450);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [state.wrong, state.justCorrect]);

  // Correct → advance after brief green flash
  useEffect(() => {
    if (state.justCorrect) {
      timerRef.current = setTimeout(() => {
        dispatch({ type: "NEXT_ROUND" });
      }, 800);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [state.justCorrect]);

  const select = useCallback(
    (displayPos: number) => dispatch({ type: "SELECT", displayPos }),
    [],
  );

  const newGame = useCallback(
    () => dispatch({ type: "NEW_GAME", words }),
    [words],
  );

  return { state, select, newGame };
}
