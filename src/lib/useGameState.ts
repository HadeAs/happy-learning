import { useReducer, useCallback, useRef, useEffect } from "react";
import type { Word } from "@/types";
import { shuffleArray } from "@/lib/shuffle";

// ==================== State ====================

export interface GameState {
  roundWords: (Word & { origIdx: number; slot: number })[];
  wordOrder: number[];
  imageOrder: number[];
  selectedWordSlot: number | null;
  matchedSlots: ReadonlySet<number>;
  wrongImageSlot: number | null;
  wrongWordSlot: number | null;
  errorCount: number;
  locked: boolean;
}

type Action =
  | { type: "SELECT_WORD"; slot: number }
  | { type: "MATCH_IMAGE"; slot: number }
  | { type: "WRONG_IMAGE"; imageSlot: number; wordSlot: number }
  | { type: "CLEAR_WRONG" }
  | { type: "NEW_GAME"; words: Word[] };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SELECT_WORD": {
      if (state.locked) return state;
      if (state.matchedSlots.has(action.slot)) return state;
      return {
        ...state,
        selectedWordSlot:
          state.selectedWordSlot === action.slot ? null : action.slot,
      };
    }

    case "MATCH_IMAGE": {
      const next = new Set(state.matchedSlots);
      next.add(action.slot);
      return {
        ...state,
        matchedSlots: next,
        selectedWordSlot: null,
        locked: false,
      };
    }

    case "WRONG_IMAGE": {
      return {
        ...state,
        errorCount: state.errorCount + 1,
        wrongImageSlot: action.imageSlot,
        wrongWordSlot: action.wordSlot,
        selectedWordSlot: null,
        locked: true,
      };
    }

    case "CLEAR_WRONG": {
      return { ...state, wrongImageSlot: null, wrongWordSlot: null, locked: false };
    }

    case "NEW_GAME": {
      const indices = shuffleArray(
        Array.from({ length: action.words.length }, (_, i) => i),
      ).slice(0, 4);
      return {
        roundWords: indices.map((idx, i) => ({
          ...action.words[idx],
          origIdx: idx,
          slot: i,
        })),
        wordOrder: shuffleArray([0, 1, 2, 3]),
        imageOrder: shuffleArray([0, 1, 2, 3]),
        selectedWordSlot: null,
        matchedSlots: new Set(),
        wrongImageSlot: null,
        wrongWordSlot: null,
        errorCount: 0,
        locked: false,
      };
    }

    default:
      return state;
  }
}

function makeInitialState(words: Word[]): GameState {
  return reducer(
    {
      roundWords: [],
      wordOrder: [],
      imageOrder: [],
      selectedWordSlot: null,
      matchedSlots: new Set(),
      wrongImageSlot: null,
      wrongWordSlot: null,
      errorCount: 0,
      locked: false,
    },
    { type: "NEW_GAME", words },
  );
}

// ==================== Hook ====================

export function useGameState(
  words: Word[],
  onComplete?: () => void,
) {
  const [state, dispatch] = useReducer(reducer, words, makeInitialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMatchedSize = useRef(state.matchedSlots.size);

  // Clear wrong animation after delay
  useEffect(() => {
    if (state.wrongImageSlot !== null) {
      timerRef.current = setTimeout(() => {
        dispatch({ type: "CLEAR_WRONG" });
      }, 450);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [state.wrongImageSlot]);

  // Detect game completion
  useEffect(() => {
    if (
      state.matchedSlots.size === 4 &&
      prevMatchedSize.current !== 4
    ) {
      // Small delay so the last match renders first
      const t = setTimeout(() => onComplete?.(), 300);
      prevMatchedSize.current = 4;
      return () => clearTimeout(t);
    }
    prevMatchedSize.current = state.matchedSlots.size;
  }, [state.matchedSlots.size, onComplete]);

  const selectWord = useCallback(
    (slot: number) => dispatch({ type: "SELECT_WORD", slot }),
    [],
  );

  const clickImage = useCallback(
    (slot: number) => {
      if (state.locked) return;
      if (state.matchedSlots.has(slot)) return;
      if (state.selectedWordSlot === null) return;

      if (state.selectedWordSlot === slot) {
        dispatch({ type: "MATCH_IMAGE", slot });
      } else {
        dispatch({ type: "WRONG_IMAGE", imageSlot: slot, wordSlot: state.selectedWordSlot! });
      }
    },
    [state.locked, state.matchedSlots, state.selectedWordSlot],
  );

  const newGame = useCallback(
    () => dispatch({ type: "NEW_GAME", words }),
    [words],
  );

  return {
    state,
    selectWord,
    clickImage,
    newGame,
  };
}
