import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Type definitions
type LeaderboardEntry = {
  player_name: string;
  completion_time: number;
  total_attempts: number;
  score: number;
  completed_at: string;
};

type GameSave = {
  player_name: string;
  current_room: number;
  time_remaining: number;
  inventory: any[];
  rooms_completed: boolean[];
  saved_at: string;
};

// Calculate score based on time and attempts
function calculateScore(completionTime: number, totalAttempts: number): number {
  const maxTime = 300; // 45 minutes
  const timeBonus = Math.max(0, maxTime - completionTime) * 10;
  const attemptPenalty = totalAttempts * 50;
  const baseScore = 10000;
  
  return Math.max(0, baseScore + timeBonus - attemptPenalty);
}

// Submit score to leaderboard
app.post('/make-server-fb1751b5/leaderboard', async (c) => {
  try {
    const body = await c.req.json();
    const { playerName, completionTime, totalAttempts } = body;

    if (!playerName || completionTime === undefined || totalAttempts === undefined) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const score = calculateScore(completionTime, totalAttempts);
    const entryId = `leaderboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const entry: LeaderboardEntry = {
      player_name: playerName,
      completion_time: completionTime,
      total_attempts: totalAttempts,
      score,
      completed_at: new Date().toISOString(),
    };

    await kv.set(entryId, entry);

    console.log(`Leaderboard entry saved: ${playerName} - Score: ${score}`);

    return c.json({ 
      success: true, 
      score,
      entry 
    });
  } catch (error) {
    console.error('Error saving leaderboard entry:', error);
    return c.json({ error: 'Failed to save score' }, 500);
  }
});

// Get leaderboard (top scores)
app.get('/make-server-fb1751b5/leaderboard', async (c) => {
  try {
    const allEntries = await kv.getByPrefix('leaderboard_');
    
    // Sort by score descending, filtering out invalid entries
    const sortedEntries = allEntries
      .map((item: any) => ({
        id: item.key,
        ...item.value,
      }))
      .filter((entry: any) => 
        entry && 
        typeof entry.score === 'number' && 
        !isNaN(entry.score)
      )
      .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
      .slice(0, 50); // Top 50 entries

    return c.json({ 
      success: true,
      entries: sortedEntries 
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json({ error: 'Failed to fetch leaderboard', entries: [] }, 500);
  }
});

// Save game progress
app.post('/make-server-fb1751b5/save-game', async (c) => {
  try {
    const body = await c.req.json();
    const { playerName, currentRoom, timeRemaining, inventory, roomsCompleted } = body;

    if (!playerName) {
      return c.json({ error: 'Player name is required' }, 400);
    }

    const saveId = `save_${playerName.toLowerCase().replace(/\s+/g, '_')}`;

    const gameSave: GameSave = {
      player_name: playerName,
      current_room: currentRoom,
      time_remaining: timeRemaining,
      inventory: inventory || [],
      rooms_completed: roomsCompleted || [false, false, false, false],
      saved_at: new Date().toISOString(),
    };

    await kv.set(saveId, gameSave);

    console.log(`Game saved for: ${playerName}`);

    return c.json({ 
      success: true,
      message: 'Game saved successfully' 
    });
  } catch (error) {
    console.error('Error saving game:', error);
    return c.json({ error: 'Failed to save game' }, 500);
  }
});

// Load game progress
app.get('/make-server-fb1751b5/load-game/:playerName', async (c) => {
  try {
    const playerName = c.req.param('playerName');
    const saveId = `save_${playerName.toLowerCase().replace(/\s+/g, '_')}`;

    const gameSave = await kv.get(saveId);

    if (!gameSave) {
      return c.json({ 
        success: false,
        message: 'No saved game found' 
      }, 404);
    }

    return c.json({ 
      success: true,
      save: gameSave 
    });
  } catch (error) {
    console.error('Error loading game:', error);
    return c.json({ error: 'Failed to load game' }, 500);
  }
});

// Get player stats
app.get('/make-server-fb1751b5/stats/:playerName', async (c) => {
  try {
    const playerName = c.req.param('playerName');
    const allEntries = await kv.getByPrefix('leaderboard_');
    
    const playerEntries = allEntries
      .map((item: any) => item.value)
      .filter((entry: any) => 
        entry.player_name.toLowerCase() === playerName.toLowerCase()
      );

    if (playerEntries.length === 0) {
      return c.json({ 
        success: true,
        stats: null,
        message: 'No completions found for this player'
      });
    }

    // Calculate stats
    const bestScore = Math.max(...playerEntries.map((e: any) => e.score));
    const bestTime = Math.min(...playerEntries.map((e: any) => e.completion_time));
    const totalCompletions = playerEntries.length;

    return c.json({ 
      success: true,
      stats: {
        best_score: bestScore,
        best_time: bestTime,
        total_completions: totalCompletions,
        entries: playerEntries,
      }
    });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// Health check
app.get('/make-server-fb1751b5/health', (c) => {
  return c.json({ status: 'ok', service: 'cyber-heist-api' });
});

Deno.serve(app.fetch);