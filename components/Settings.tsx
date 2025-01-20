// components/Settings.tsx

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

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/utils/game-mechanics';
import IceCubes from '@/icons/IceCubes';
import { useToast } from '@/contexts/ToastContext';
import Toggle from '@/components/Toggle';
import { triggerHapticFeedback } from '@/utils/ui';

interface SettingsProps {
    setCurrentView: (view: string) => void;
}

export default function Settings({ setCurrentView }: SettingsProps) {
    const showToast = useToast();
    const { pointsBalance } = useGameStore();

    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [animationEnabled, setAnimationEnabled] = useState(true);

    useEffect(() => {
        const storedVibration = localStorage.getItem('vibrationEnabled');
        const storedAnimation = localStorage.getItem('animationEnabled');

        setVibrationEnabled(storedVibration !== 'false');
        setAnimationEnabled(storedAnimation !== 'false');
    }, []);

    const handleVibrationToggle = () => {
        const newValue = !vibrationEnabled;
        if (vibrationEnabled) {
            triggerHapticFeedback(window);
        }
        setVibrationEnabled(newValue);
        localStorage.setItem('vibrationEnabled', newValue.toString());
        showToast(newValue ? 'Vibration enabled' : 'Vibration disabled', 'success');
    };

    const handleAnimationToggle = () => {
        triggerHapticFeedback(window);
        const newValue = !animationEnabled;
        setAnimationEnabled(newValue);
        localStorage.setItem('animationEnabled', newValue.toString());
        showToast(newValue ? 'Animation enabled' : 'Animation disabled', 'success');
    };

    const handleBackToGame = () => {
        triggerHapticFeedback(window);
        setCurrentView('game');
    };

    return (
        <div className="bg-black flex justify-center min-h-screen">
            <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl">
                <div className="flex-grow mt-4 bg-[#000000] h-full overflow-y-auto no-scrollbar">
                    <div className="px-4 pt-1 pb-24">
                        <h1 className="text-2xl text-center mt-4">Settings</h1>

                        <div className="bg-[#272a2f] rounded-lg p-4 mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <p>Touch vibration</p>
                                <Toggle enabled={vibrationEnabled} setEnabled={handleVibrationToggle} />
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Floating points animation</p>
                                <Toggle enabled={animationEnabled} setEnabled={handleAnimationToggle} />
                            </div>
                        </div>

                        <button
                            onClick={handleBackToGame}
                            className="mx-auto block mt-4 text-center text-white"
                        >
                            Back to Game
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}