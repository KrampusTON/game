// app/admin/layout.tsx

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

import { headers } from 'next/headers';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = headers();
    const host = headersList.get('host') || '';
    const isLocalhost = host.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';
    const isAuthorized = isLocalhost && isAdminAccessEnabled;

    if (!isAuthorized) {
        return <div className="text-white">Unauthorized</div>;
    }
    return (
        <>
            {children}
        </>
    );
}
