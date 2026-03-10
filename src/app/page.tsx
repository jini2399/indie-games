"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface GameState {
  hunger: number;
  affinity: number;
  level: number;
  clicks: number;
  lastUpdate: number;
  started: boolean;
}

const STORAGE_KEY = "capybara-game-state";
const HUNGER_INTERVAL = 5000;
const HUNGER_INCREMENT = 5;
const AFFINITY_PER_LEVEL = 100;

function loadState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const defaultState: GameState = {
  hunger: 0,
  affinity: 0,
  level: 1,
  clicks: 0,
  lastUpdate: Date.now(),
  started: false,
};

export default function Home() {
  const [state, setState] = useState<GameState>(defaultState);
  const [mounted, setMounted] = useState(false);
  const [bounce, setBounce] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from localStorage on mount + calculate offline hunger
  useEffect(() => {
    const saved = loadState();
    if (saved && saved.started) {
      const elapsed = Date.now() - saved.lastUpdate;
      const missedTicks = Math.floor(elapsed / HUNGER_INTERVAL);
      const offlineHunger = Math.min(
        100,
        saved.hunger + missedTicks * HUNGER_INCREMENT
      );
      setState({ ...saved, hunger: offlineHunger, lastUpdate: Date.now() });
    }
    setMounted(true);
  }, []);

  // Save state on every change
  useEffect(() => {
    if (mounted && state.started) {
      saveState(state);
    }
  }, [state, mounted]);

  // Hunger timer
  useEffect(() => {
    if (state.started) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const newHunger = Math.min(100, prev.hunger + HUNGER_INCREMENT);
          return { ...prev, hunger: newHunger, lastUpdate: Date.now() };
        });
      }, HUNGER_INTERVAL);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.started]);

  const feed = useCallback(() => {
    if (!state.started) return;
    setBounce(true);
    setTimeout(() => setBounce(false), 300);

    setState((prev) => {
      const newAffinity = prev.affinity + 1;
      const newLevel = Math.floor(newAffinity / AFFINITY_PER_LEVEL) + 1;
      return {
        ...prev,
        hunger: 0,
        affinity: newAffinity,
        level: newLevel,
        clicks: prev.clicks + 1,
        lastUpdate: Date.now(),
      };
    });
  }, [state.started]);

  const startGame = () => {
    setState({ ...defaultState, started: true, lastUpdate: Date.now() });
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState({ ...defaultState });
  };

  const hungerColor =
    state.hunger < 30
      ? "bg-emerald-500"
      : state.hunger < 70
        ? "bg-amber-500"
        : "bg-red-500";

  const mood =
    state.hunger < 30 ? "😊" : state.hunger < 70 ? "😐" : "😢";

  const capybaraSize =
    state.level >= 10
      ? "text-[10rem]"
      : state.level >= 5
        ? "text-[8rem]"
        : "text-[6rem]";

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-2xl text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 select-none">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
        카피바라 키우기 🦫
      </h1>

      {!state.started ? (
        <div className="flex flex-col items-center gap-6">
          <div className="text-[8rem] leading-none">🦫</div>
          <p className="text-zinc-400 text-lg">카피바라를 키워보세요!</p>
          <button
            onClick={startGame}
            className="rounded-xl bg-emerald-600 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95"
          >
            게임 시작
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          {/* Level & Stats */}
          <div className="flex w-full justify-between text-sm text-zinc-400">
            <span>
              Lv.{state.level}{" "}
              <span className="text-zinc-600">
                ({state.affinity % AFFINITY_PER_LEVEL}/{AFFINITY_PER_LEVEL})
              </span>
            </span>
            <span>클릭: {state.clicks}</span>
          </div>

          {/* Capybara */}
          <button
            onClick={feed}
            className={`${capybaraSize} leading-none transition-transform cursor-pointer ${bounce ? "scale-125" : "hover:scale-110"}`}
            aria-label="카피바라 먹이 주기"
          >
            🦫
          </button>

          <div className="text-2xl">{mood}</div>

          {/* Hunger Bar */}
          <div className="w-full">
            <div className="flex justify-between text-sm text-zinc-400 mb-1">
              <span>배고픔</span>
              <span>{state.hunger}%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${hungerColor}`}
                style={{ width: `${state.hunger}%` }}
              />
            </div>
          </div>

          {/* Affinity */}
          <div className="w-full">
            <div className="flex justify-between text-sm text-zinc-400 mb-1">
              <span>친화도</span>
              <span>{state.affinity}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-pink-500 transition-all duration-300"
                style={{
                  width: `${(state.affinity % AFFINITY_PER_LEVEL) / AFFINITY_PER_LEVEL * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="rounded-xl bg-zinc-800/50 p-3 text-center">
              <div className="text-2xl font-bold text-zinc-100">
                {state.level}
              </div>
              <div className="text-xs text-zinc-500">레벨</div>
            </div>
            <div className="rounded-xl bg-zinc-800/50 p-3 text-center">
              <div className="text-2xl font-bold text-pink-400">
                {state.affinity}
              </div>
              <div className="text-xs text-zinc-500">친화도</div>
            </div>
            <div className="rounded-xl bg-zinc-800/50 p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {state.clicks}
              </div>
              <div className="text-xs text-zinc-500">먹이 횟수</div>
            </div>
          </div>

          {/* Feed Button */}
          <button
            onClick={feed}
            className="w-full rounded-xl bg-emerald-600 py-3 text-lg font-semibold text-white transition-all hover:bg-emerald-500 active:scale-[0.98]"
          >
            🌿 먹이 주기
          </button>

          {/* Reset */}
          <button
            onClick={resetGame}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            리셋
          </button>
        </div>
      )}
    </div>
  );
}
