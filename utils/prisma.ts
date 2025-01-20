// utils/prisma.ts

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

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;
