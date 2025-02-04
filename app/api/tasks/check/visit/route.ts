// app/api/tasks/check/visit/route.ts

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
import prisma from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';
import { TASK_WAIT_TIME } from '@/utils/consts';

interface CheckVisitTaskRequestBody {
    initData: string;
    taskId: string;
}

export async function POST(req: Request) {
    const requestBody: CheckVisitTaskRequestBody = await req.json();
    const { initData: telegramInitData, taskId } = requestBody;

    if (!telegramInitData || !taskId) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { validatedData, user } = validateTelegramWebAppData(telegramInitData);

    if (!validatedData) {
        return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 403 });
    }

    const telegramId = user.id?.toString();

    if (!telegramId) {
        return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    try {
        const result = await prisma.$transaction(async (prisma) => {
            // Find the user
            const dbUser = await prisma.user.findUnique({
                where: { telegramId },
            });

            if (!dbUser) {
                throw new Error('User not found');
            }

            // Find the task
            const task = await prisma.task.findUnique({
                where: { id: taskId },
            });

            if (!task) {
                throw new Error('Task not found');
            }

            // Check if the task is active
            if (!task.isActive) {
                throw new Error('This task is no longer active');
            }

            // Check if the task is of type VISIT and has taskData
            if (task.type !== 'VISIT' || !task.taskData) {
                throw new Error('Invalid task type or missing task data for this operation');
            }

            
            if (typeof TASK_WAIT_TIME !== 'number') {
                throw new Error('Invalid timeToWait in task data');
            }

            // Find the user's task
            const userTask = await prisma.userTask.findUnique({
                where: {
                    userId_taskId: {
                        userId: dbUser.id,
                        taskId: task.id,
                    },
                },
            });

            if (!userTask) {
                throw new Error('Task not started');
            }

            if (userTask.isCompleted) {
                throw new Error('Task already completed');
            }

            // Check if enough time has passed
            const waitEndTime = new Date(userTask.taskStartTimestamp.getTime() + TASK_WAIT_TIME);
            if (new Date() < waitEndTime) {
                const remainingTime = Math.ceil((waitEndTime.getTime() - Date.now()) / 1000); // in seconds
                return {
                    success: false,
                    message: `Not enough time has passed. Please wait ${remainingTime} more seconds.`,
                    remainingTime,
                };
            }

            // Update the task as completed
            const updatedUserTask = await prisma.userTask.update({
                where: {
                    id: userTask.id,
                },
                data: {
                    isCompleted: true,
                },
            });

            // Add points to user's balance
            await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                    points: { increment: task.points },
                    pointsBalance: { increment: task.points },
                },
            });

            return {
                success: true,
                message: 'Task completed successfully',
                isCompleted: updatedUserTask.isCompleted,
            };
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error checking visit task:', error);
        return NextResponse.json({ 
            success: false,
            error: error instanceof Error ? error.message : 'Failed to check visit task' 
        }, { status: 500 });
    }
}