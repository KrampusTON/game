// components/AutoIncrement.tsx

/**
 * This project was developed by PeGoverse.
 * You may not use this code if you purchased it from any source other than the official website https://PeGo.com.
 * If you purchased it from the official website, you may use it for your own projects,
 * but you may not resell it or publish it publicly.
 * 
 * Website: https://PeGo.com
 * YouTube: https://www.youtube.com/@PeGo
 * Telegram: https://t.me/PeGo_s
 * Telegram channel for news/updates: https://t.me/clicker_game_news
 * GitHub: https://github.com/PeGo-surkov
 */

'use client'

import { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '@/utils/game-mechanics';

export function AutoIncrement() {
  const {
    lastClickTimestamp,
    profitPerHour,
    pointsPerClick,
    energy,
    maxEnergy,
    incrementPoints,
    incrementEnergy
  } = useGameStore();

  // Use a ref to store the latest values without causing re-renders
  const stateRef = useRef({ profitPerHour, pointsPerClick, lastClickTimestamp });

  // Update the ref when these values change
  useEffect(() => {
    stateRef.current = { profitPerHour, pointsPerClick, lastClickTimestamp };
  }, [profitPerHour, pointsPerClick, lastClickTimestamp]);

  const autoIncrement = useCallback(() => {
    const { profitPerHour, pointsPerClick, lastClickTimestamp } = stateRef.current;
    const pointsPerSecond = profitPerHour / 3600;
    const currentTime = Date.now();

    incrementPoints(pointsPerSecond);

    if (!(lastClickTimestamp && ((currentTime - lastClickTimestamp) < 2000))) {
      incrementEnergy(pointsPerClick);
    }
  }, [incrementPoints, incrementEnergy]);

  useEffect(() => {
    const interval = setInterval(autoIncrement, 1000);
    return () => clearInterval(interval);
  }, [autoIncrement]);

  return null;
}