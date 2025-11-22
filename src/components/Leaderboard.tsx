import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Award, ArrowLeft, Clock, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

type LeaderboardEntry = {
  id: string;
  player_name: string;
  completion_time: number;
  total_attempts: number;
  score: number;
  completed_at: string;
};

type LeaderboardProps = {
  onBack: () => void;
};

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fb1751b5/leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Filter out any invalid entries and ensure score exists
        const validEntries = (data.entries || []).filter((entry: any) => 
          entry && 
          typeof entry.score === 'number' && 
          entry.player_name && 
          typeof entry.completion_time === 'number'
        );
        setEntries(validEntries);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="size-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="size-6 text-slate-400" />;
    if (rank === 3) return <Award className="size-6 text-amber-700" />;
    return <span className="text-slate-500">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <motion.div
        className="relative z-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-slate-900/90 border-amber-900 backdrop-blur-sm">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-amber-950 to-yellow-950 p-6 border-b border-amber-800">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4 text-amber-300"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>

            <div className="text-center pt-8">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className="inline-block text-5xl mb-3"
              >
                🏆
              </motion.div>
              
              <h2 className="text-amber-400 mb-2">Global Leaderboard</h2>
              <p className="text-slate-400">Top Cyber Heist Masters</p>
            </div>
          </div>

          {/* Leaderboard entries */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12 text-slate-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block mb-4"
                >
                  <Zap className="size-8 text-cyan-400" />
                </motion.div>
                <p>Loading leaderboard...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Trophy className="size-12 mx-auto mb-4 opacity-20" />
                <p>No completions yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-4 ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-950/50 to-amber-950/50 border-yellow-700'
                          : index === 1
                          ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600'
                          : index === 2
                          ? 'bg-gradient-to-r from-amber-950/30 to-orange-950/30 border-amber-800'
                          : 'bg-slate-900/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-12 text-center">
                          {getRankIcon(index + 1)}
                        </div>

                        {/* Player info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-slate-200 truncate">
                              {entry.player_name}
                            </h3>
                            {index < 3 && (
                              <Badge
                                variant="outline"
                                className={
                                  index === 0
                                    ? 'border-yellow-600 text-yellow-400'
                                    : index === 1
                                    ? 'border-slate-500 text-slate-300'
                                    : 'border-amber-700 text-amber-400'
                                }
                              >
                                TOP {index + 1}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <Clock className="size-4" />
                              <span>{formatTime(entry.completion_time)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">•</span> Score:{' '}
                              <span className="text-cyan-400">{entry.score.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">•</span> Attempts:{' '}
                              <span className={entry.total_attempts <= 5 ? 'text-green-400' : 'text-amber-400'}>
                                {entry.total_attempts}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Score badge */}
                        <div className="flex-shrink-0">
                          <Badge className="bg-slate-800 text-lg px-3 py-1">
                            {entry.score.toLocaleString()}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {entries.length > 0 && (
              <div className="mt-6 text-center text-xs text-slate-500">
                Showing top {entries.length} completions
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}