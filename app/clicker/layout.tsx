// app/clicker/layout.tsx

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

import { WALLET_MANIFEST_URL } from '@/utils/consts';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function MyApp({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <TonConnectUIProvider manifestUrl={WALLET_MANIFEST_URL}>
            {children}
        </TonConnectUIProvider>
    );
}