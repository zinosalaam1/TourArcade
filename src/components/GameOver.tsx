import { Trophy, AlertTriangle, RotateCcw, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';

type GameOverProps = {
  status: 'won' | 'lost';
  timeRemaining: number;
  totalAttempts: number;
  playerName: string;
  onRestart: () => void;
  onViewLeaderboard: () => void;
};

export function GameOver({ status, timeRemaining, totalAttempts, playerName, onRestart, onViewLeaderboard }: GameOverProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const totalTime = 300; // 45 minutes
  const timeUsed = totalTime - timeRemaining;
  const minutesUsed = Math.floor(timeUsed / 60);
  const secondsUsed = timeUsed % 60;

  // Calculate score (same logic as backend)
  const calculateScore = () => {
    if (status === 'lost') return 0;
    const timeBonus = Math.max(0, totalTime - timeUsed) * 10;
    const attemptPenalty = totalAttempts * 50;
    const baseScore = 10000;
    return Math.max(0, baseScore + timeBonus - attemptPenalty);
  };

  const score = calculateScore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Confetti animation for win */}
      {status === 'won' && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute size-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: -20,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 4)],
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: Math.random() * 360,
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`relative z-10 max-w-2xl w-full p-8 text-center ${
          status === 'won' 
            ? 'bg-gradient-to-br from-green-950 to-slate-900 border-green-800' 
            : 'bg-gradient-to-br from-red-950 to-slate-900 border-red-800'
        }`}>
          {status === 'won' ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center size-24 rounded-full bg-green-900 border-4 border-green-600 mb-6"
              >
                <Trophy className="size-12 text-green-400" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-green-400 mb-3"
              >
                🎉 MISSION COMPLETE!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-2xl text-slate-200 mb-2"
              >
                Congratulations, {playerName}!
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-slate-400 mb-6"
              >
                You've successfully broken into the vault!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black/50 rounded-lg p-6 mb-6 border border-green-800"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Award className="size-6 text-amber-400" />
                  <div className="text-amber-400 text-3xl tabular-nums">
                    {score.toLocaleString()}
                  </div>
                  <span className="text-slate-400 text-sm">points</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-slate-300">
                  <div>
                    <div className="text-green-400 tabular-nums text-xl">
                      {String(minutesUsed).padStart(2, '0')}:{String(secondsUsed).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-slate-500">Time Used</div>
                  </div>
                  <div>
                    <div className="text-cyan-400 tabular-nums text-xl">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-slate-500">Time Left</div>
                  </div>
                  <div>
                    <div className={`tabular-nums text-xl ${totalAttempts <= 5 ? 'text-green-400' : 'text-amber-400'}`}>
                      {totalAttempts}
                    </div>
                    <div className="text-xs text-slate-500">Failed Attempts</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mb-6 text-slate-300 space-y-2"
              >
                <p>You've demonstrated exceptional puzzle-solving skills!</p>
                <p className="text-sm text-slate-400">
                  "In the world of cyber heists, timing and intelligence are everything."
                </p>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center size-24 rounded-full bg-red-900 border-4 border-red-600 mb-6"
              >
                <AlertTriangle className="size-12 text-red-400" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-red-400 mb-3"
              >
                ⏰ TIME'S UP!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-2xl text-slate-200 mb-6"
              >
                The system has detected your presence, {playerName}!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black/50 rounded-lg p-6 mb-6 border border-red-800"
              >
                <div className="text-red-400 mb-4">SECURITY LOCKDOWN INITIATED</div>
                <div className="text-slate-300 text-sm space-y-2">
                  <p>The vault has been sealed and alarms are blaring.</p>
                  <p>Your infiltration attempt has failed... this time.</p>
                  <div className="mt-4 pt-4 border-t border-red-800">
                    <div className="text-slate-400">Failed Attempts: <span className="text-red-400">{totalAttempts}</span></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mb-6 text-slate-300"
              >
                <p className="text-sm text-slate-400">
                  "Every master thief has failed before. The question is: will you try again?"
                </p>
              </motion.div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-3"
          >
            <Button
              onClick={onRestart}
              size="lg"
              className={`w-full text-lg h-12 ${
                status === 'won'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <RotateCcw className="size-5 mr-2" />
              {status === 'won' ? 'Play Again' : 'Retry Mission'}
            </Button>

            <Button
              onClick={onViewLeaderboard}
              variant="outline"
              size="lg"
              className={`w-full ${
                status === 'won'
                  ? 'border-green-800 text-green-400 hover:bg-green-950'
                  : 'border-red-800 text-red-400 hover:bg-red-950'
              }`}
            >
              <Trophy className="size-5 mr-2" />
              View Leaderboard
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-6 text-xs text-slate-500"
          >
            💡 Tip: Each puzzle has hints to help you progress. Don't give up!
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}