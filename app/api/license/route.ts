// app/api/license/route.ts

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

import { NextResponse } from 'next/server';

const licenseInfo = `
This project was developed by PeGoverse.
You may not use this code if you purchased it from any source other than the official website https://PeGo.com.
If you purchased it from the official website, you may use it for your own projects,
but you may not resell it or publish it publicly.

Website: https://PeGo.com
YouTube: https://www.youtube.com/@PeGo
Telegram: https://t.me/PeGo_s
Telegram channel for news/updates: https://t.me/clicker_game_news
GitHub: https://github.com/PeGo-surkov
`;

export async function GET(req: Request) {
  return NextResponse.json({ 
    license: licenseInfo.trim(),
    version: '1.0.0',
    lastUpdated: '2024-08-20'
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}