// utils/calculations.ts

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

export const calculateUpgradeCost = (levelIndex: number, basePrice: number, coefficient: number): number => {
    return Math.floor(basePrice * Math.pow(coefficient, levelIndex));
}

export const calculateUpgradeBenefit = (levelIndex: number, baseBenefit: number, coefficient: number): number => {
    let benefit = 0;
    for (let i = 0; i <= levelIndex; i++) {
        benefit += Math.floor(baseBenefit * Math.pow(coefficient, i));
    }
    return benefit;
}