'use client';

import Image, { StaticImageData } from 'next/image';
import Mine from '@/icons/Mine';
import Friends from '@/icons/Friends';
import Coins from '@/icons/Coins';
import { iceToken } from '@/images';
import IceCube from '@/icons/IceCube';
import Catch from '@/icons/Catch'; // Importujte Catch ikonu
import { FC } from 'react';
import { IconProps } from '@/utils/types';
import { triggerHapticFeedback } from '@/utils/ui';

type NavItem = {
    name: string;
    icon?: FC<IconProps> | null;
    image?: StaticImageData | null;
    view: string;
};

const navItems: NavItem[] = [
    { name: 'Game', icon: IceCube, view: 'game' },
    { name: 'Catch', icon: Catch, view: 'catch' },
    { name: 'Mine', icon: Mine, view: 'mine' },
    { name: 'Friends', icon: Friends, view: 'friends' },
    { name: 'Earn', icon: Coins, view: 'earn' },
    { name: 'Airdrop', image: iceToken, view: 'airdrop' },
];

interface NavigationProps {
    currentView: string;
    setCurrentView: (view: string) => void;
}

export default function Navigation({ currentView, setCurrentView }: NavigationProps) {
    console.log('Navigation props:', {
        currentView,
        setCurrentView,
        isSetCurrentViewFunction: typeof setCurrentView === 'function',
    });

    const handleViewChange = (view: string) => {
        console.log('Attempting to change view to:', view);
        if (typeof setCurrentView === 'function') {
            try {
                triggerHapticFeedback(window);
                setCurrentView(view);
                console.log('View change successful');
            } catch (error) {
                console.error('Error occurred while changing view:', error);
            }
        } else {
            console.error('setCurrentView is not a function:', setCurrentView);
        }
    };

    if (typeof setCurrentView !== 'function') {
        console.error('setCurrentView is not a function. Navigation cannot be rendered properly.');
        return null; // Návratová hodnota v prípade chyby
    }

    return (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] w-full max-w-xl bg-black flex justify-around items-center z-40 text-xs border-t border-black max-h-24">
            {navItems.map((item) => (
                <button
                    key={item.name}
                    onClick={() => handleViewChange(item.view)}
                    className="flex-1"
                >
                    <div
                        className={`flex flex-col items-center justify-center ${
                            currentView === item.view ? 'text-white bg-black' : 'text-[#85827d]'
                        } h-16 m-1 p-2 rounded-none`}
                    >
                        <div
                            className={`w-8 h-8 relative ${
                                item.name === 'Catch' ? 'top-[-130px]' : ''
                            }`} // Posun iba pre 'Catch'
                        >
                            {item.image && (
                                <div className="w-full h-full relative">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            )}
                            {item.icon && <item.icon className="w-full h-full" />}
                        </div>
                        {/* Text je vždy pod ikonou */}
                        <p className="mt-2">{item.name}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}
