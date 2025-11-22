import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Save, Pause, Play } from 'lucide-react';
import { SecurityLobby } from './components/SecurityLobby';
import { ServerCore } from './components/ServerCore';
import { LaserGrid } from './components/LaserGrid';
import { MirrorChamber } from './components/MirrorChamber';
import { FinalVault } from './components/FinalVault';
import { GameHeader } from './components/GameHeader';
import { GameOver } from './components/GameOver';
import { StartScreen } from './components/StartScreen';
import { Leaderboard } from './components/Leaderboard';
import { Alert, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';
import { projectId, publicAnonKey } from './utils/supabase/info.tsx';

export type GameItem = {
  id: string;
  name: string;
  description: string;
};

export type GameState = {
  currentRoom: number;
  inventory: GameItem[];
  timeRemaining: number;
  gameStatus: 'menu' | 'playing' | 'paused' | 'won' | 'lost';
  roomsCompleted: boolean[];
  playerName: string;
  totalAttempts: number;
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: 1,
    inventory: [],
    timeRemaining: 600, // 10 minutes in seconds
    gameStatus: 'menu',
    roomsCompleted: [false, false, false, false, false],
    playerName: 'Anonymous Hacker',
    totalAttempts: 0,
  });

  const [showTransition, setShowTransition] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'menu' | 'game' | 'leaderboard'>('menu');

  // Timer countdown
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          return { ...prev, timeRemaining: 0, gameStatus: 'lost' };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const saveInterval = setInterval(() => {
        saveGameProgress();
      }, 30000);
      return () => clearInterval(saveInterval);
    }
  }, [gameState]);

  const addToInventory = (item: GameItem) => {
    setGameState((prev) => ({
      ...prev,
      inventory: [...prev.inventory, item],
    }));
    showNotification(`Added to inventory: ${item.name}`);
  };

  const incrementAttempts = () => {
    setGameState((prev) => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1,
    }));
  };

  const completeRoom = () => {
    const newRoomsCompleted = [...gameState.roomsCompleted];
    newRoomsCompleted[gameState.currentRoom - 1] = true;

    if (gameState.currentRoom === 5) {
      // Game won! Submit to leaderboard
      submitScore();
      setGameState((prev) => ({
        ...prev,
        roomsCompleted: newRoomsCompleted,
        gameStatus: 'won',
      }));
      return;
    }

    // Transition to next room
    setShowTransition(true);
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        currentRoom: prev.currentRoom + 1,
        roomsCompleted: newRoomsCompleted,
      }));
      setShowTransition(false);
    }, 2000);
  };

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const startGame = (playerName: string) => {
    setGameState({
      currentRoom: 1,
      inventory: [],
      timeRemaining: 600, // 10 minutes
      gameStatus: 'playing',
      roomsCompleted: [false, false, false, false, false],
      playerName,
      totalAttempts: 0,
    });
    setViewMode('game');
  };

  const resetGame = () => {
    setViewMode('menu');
    setGameState((prev) => ({
      ...prev,
      currentRoom: 1,
      inventory: [],
      timeRemaining: 600, // 10 minutes
      gameStatus: 'menu',
      roomsCompleted: [false, false, false, false, false],
      totalAttempts: 0,
    }));
    setNotification(null);
  };

  const togglePause = () => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing',
    }));
  };

  const saveGameProgress = async () => {
    if (saving) return;
    
    try {
      setSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fb1751b5/save-game`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            playerName: gameState.playerName,
            currentRoom: gameState.currentRoom,
            timeRemaining: gameState.timeRemaining,
            inventory: gameState.inventory,
            roomsCompleted: gameState.roomsCompleted,
          }),
        }
      );

      if (response.ok) {
        console.log('Game progress saved');
      }
    } catch (error) {
      console.error('Failed to save game:', error);
    } finally {
      setSaving(false);
    }
  };

  const submitScore = async () => {
    try {
      const completionTime = 300 - gameState.timeRemaining; // Using 10 minutes (600 seconds)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fb1751b5/leaderboard`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            playerName: gameState.playerName,
            completionTime,
            totalAttempts: gameState.totalAttempts,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Score submitted:', data.score);
      }
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  // Show leaderboard
  if (viewMode === 'leaderboard') {
    return <Leaderboard onBack={() => setViewMode('menu')} />;
  }

  // Show start screen
  if (viewMode === 'menu') {
    return (
      <StartScreen
        onStart={startGame}
        onViewLeaderboard={() => setViewMode('leaderboard')}
      />
    );
  }

  // Show game over
  if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
    return (
      <GameOver
        status={gameState.gameStatus}
        timeRemaining={gameState.timeRemaining}
        totalAttempts={gameState.totalAttempts}
        playerName={gameState.playerName}
        onRestart={resetGame}
        onViewLeaderboard={() => setViewMode('leaderboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Cyber grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Pause overlay */}
      <AnimatePresence>
        {gameState.gameStatus === 'paused' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border-2 border-cyan-600 rounded-lg p-8 text-center space-y-6 max-w-md"
            >
              <div className="text-6xl">⏸️</div>
              <h2 className="text-cyan-400 text-3xl">Game Paused</h2>
              <p className="text-slate-300">Take a breath. The timer is stopped.</p>
              <div className="space-y-3">
                <Button onClick={togglePause} className="w-full bg-cyan-600 hover:bg-cyan-700" size="lg">
                  <Play className="size-5 mr-2" />
                  Resume Game
                </Button>
                <Button onClick={saveGameProgress} variant="outline" className="w-full" disabled={saving}>
                  <Save className="size-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Progress'}
                </Button>
                <Button onClick={resetGame} variant="outline" className="w-full border-red-800 text-red-400 hover:bg-red-950">
                  Quit to Menu
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <GameHeader
          currentRoom={gameState.currentRoom}
          timeRemaining={gameState.timeRemaining}
          roomsCompleted={gameState.roomsCompleted}
          onPause={togglePause}
          playerName={gameState.playerName}
        />

        <AnimatePresence mode="wait">
          {notification && (
            <motion.div
              key="notification"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
            >
              <Alert className="bg-cyan-950 border-cyan-500 text-cyan-100">
                <AlertCircle className="size-4" />
                <AlertDescription>{notification}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <AnimatePresence mode="wait">
            {showTransition ? (
              <motion.div
                key="transition"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex items-center justify-center h-[calc(100vh-200px)]"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    className="text-cyan-400"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{ duration: 2 }}
                  >
                    <div className="text-6xl mb-4">✓</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-2xl text-cyan-400 mb-2">ACCESS GRANTED</div>
                    <div className="text-xl text-green-400">Room {gameState.currentRoom} Complete</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-slate-400"
                  >
                    Accessing next sector...
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`room-${gameState.currentRoom}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {gameState.currentRoom === 1 && (
                  <SecurityLobby
                    onComplete={completeRoom}
                    addToInventory={addToInventory}
                    inventory={gameState.inventory}
                    showNotification={showNotification}
                    incrementAttempts={incrementAttempts}
                  />
                )}
                {gameState.currentRoom === 2 && (
                  <ServerCore
                    onComplete={completeRoom}
                    addToInventory={addToInventory}
                    inventory={gameState.inventory}
                    showNotification={showNotification}
                    incrementAttempts={incrementAttempts}
                  />
                )}
                {gameState.currentRoom === 3 && (
                  <LaserGrid
                    onComplete={completeRoom}
                    addToInventory={addToInventory}
                    inventory={gameState.inventory}
                    showNotification={showNotification}
                    incrementAttempts={incrementAttempts}
                  />
                )}
                {gameState.currentRoom === 4 && (
                  <MirrorChamber
                    onComplete={completeRoom}
                    addToInventory={addToInventory}
                    inventory={gameState.inventory}
                    showNotification={showNotification}
                    incrementAttempts={incrementAttempts}
                  />
                )}
                {gameState.currentRoom === 5 && (
                  <FinalVault
                    onComplete={completeRoom}
                    addToInventory={addToInventory}
                    inventory={gameState.inventory}
                    showNotification={showNotification}
                    incrementAttempts={incrementAttempts}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}