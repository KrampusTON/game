// app/api/admin/onchain-tasks/[id]/route.ts

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

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const isLocalhost = req.headers.get('host')?.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';

    if (!isLocalhost || !isAdminAccessEnabled) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const taskData = await req.json();

        const task = await prisma.onchainTask.update({
            where: { id: params.id },
            data: { isActive: taskData.isActive, points: taskData.points },
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('Update onchain task error:', error);
        return NextResponse.json({ error: 'Failed to update onchain task' }, { status: 500 });
    }
}