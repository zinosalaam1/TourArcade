import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, Info, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

type StartScreenProps = {
  onStart: (playerName: string) => void;
  onViewLeaderboard: () => void;
};

export function StartScreen({ onStart, onViewLeaderboard }: StartScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStart = () => {
    const name = playerName.trim();
    if (!name) {
      // Don't allow starting without a name
      return;
    }
    onStart(name);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated cyber background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-1 bg-cyan-500/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {!showInstructions ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-slate-900/90 border-cyan-900 backdrop-blur-sm overflow-hidden">
              {/* Glowing header */}
              <div className="relative bg-gradient-to-r from-cyan-950 to-blue-950 p-8 border-b border-cyan-800">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
                
                <motion.div
                  className="relative text-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.div
                    className="inline-block text-6xl mb-4"
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    🎮
                  </motion.div>
                  
                  <h1 className="text-cyan-400 mb-2">
                    CYBER HEIST
                  </h1>
                  
                  <motion.p
                    className="text-2xl text-cyan-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Break Into the Vault Before the System Locks Down
                  </motion.p>
                  
                  <motion.div
                    className="flex justify-center gap-4 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Badge className="bg-red-600">⏱️ 10 Minutes</Badge>
                    <Badge className="bg-amber-600">🧩 5 Rooms</Badge>
                    <Badge className="bg-green-600">🧠 Mind-Bending Puzzles</Badge>
                  </motion.div>
                </motion.div>
              </div>

              <div className="p-8 space-y-6">
                {/* Player name input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2"
                >
                  <label className="text-slate-300 text-sm">
                    Enter Your Hacker Alias <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name..."
                    className="bg-slate-950 border-slate-700 text-lg h-12 text-white placeholder:text-slate-500"
                    maxLength={20}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && playerName.trim()) handleStart();
                    }}
                  />
                  {!playerName.trim() && (
                    <p className="text-xs text-slate-400">
                      Your name is required to save your score on the leaderboard
                    </p>
                  )}
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  className="grid gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <Button
                    onClick={handleStart}
                    disabled={!playerName.trim()}
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-lg h-14 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="size-5 mr-2 group-hover:scale-110 transition-transform" />
                    START HEIST
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setShowInstructions(true)}
                      variant="outline"
                      size="lg"
                      className="border-slate-700 hover:border-cyan-600"
                    >
                      <Info className="size-5 mr-2" />
                      How to Play
                    </Button>

                    <Button
                      onClick={onViewLeaderboard}
                      variant="outline"
                      size="lg"
                      className="border-slate-700 hover:border-amber-600"
                    >
                      <Trophy className="size-5 mr-2" />
                      Leaderboard
                    </Button>
                  </div>
                </motion.div>

                {/* Quick stats */}
                <motion.div
                  className="border-t border-slate-800 pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <div className="grid grid-cols-5 gap-3 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl">🛑</div>
                      <div className="text-xs text-slate-400">Security</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl">🔌</div>
                      <div className="text-xs text-slate-400">Server</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl">⚡</div>
                      <div className="text-xs text-slate-400">Laser Grid</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl">🪞</div>
                      <div className="text-xs text-slate-400">Mirrors</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl">🏆</div>
                      <div className="text-xs text-slate-400">Vault</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-slate-900/90 border-cyan-900 backdrop-blur-sm">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-cyan-400">How to Play</h2>
                <Button
                  onClick={() => setShowInstructions(false)}
                  variant="ghost"
                  size="sm"
                >
                  Back
                </Button>
              </div>

              <div className="p-6">
                <Tabs defaultValue="objective" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-950">
                    <TabsTrigger value="objective">Objective</TabsTrigger>
                    <TabsTrigger value="controls">Controls</TabsTrigger>
                    <TabsTrigger value="tips">Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="objective" className="space-y-4 mt-6">
                    <div className="space-y-3 text-slate-300">
                      <div className="flex items-start gap-3">
                        <Zap className="size-5 text-cyan-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="mb-1">
                            <strong className="text-cyan-400">Your Mission:</strong>
                          </p>
                          <p className="text-sm">
                            Infiltrate the high-security facility and reach the vault containing
                            classified data before the 5-minute timer runs out.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                        <h3 className="text-amber-400 mb-3">The 5 Rooms:</h3>
                        <div className="space-y-2 text-sm">
                          <div>🛑 <strong>Security Lobby</strong> - Decode the door access code</div>
                          <div>🔌 <strong>Server Core</strong> - Unlock the network console</div>
                          <div>⚡ <strong>Laser Grid</strong> - Navigate the security system</div>
                          <div>🪞 <strong>Mirror Chamber</strong> - Solve the reflection puzzle</div>
                          <div>🏆 <strong>The Vault</strong> - Crack the master code</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="controls" className="space-y-4 mt-6">
                    <div className="space-y-3 text-slate-300 text-sm">
                      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                        <h3 className="text-cyan-400 mb-2">Game Controls:</h3>
                        <ul className="space-y-2">
                          <li>• Click interactive objects to examine them</li>
                          <li>• Use hint buttons to reveal clues when stuck</li>
                          <li>• Collect items that may help in future rooms</li>
                          <li>• Enter codes and answers carefully - failed attempts count!</li>
                        </ul>
                      </div>

                      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                        <h3 className="text-amber-400 mb-2">Scoring:</h3>
                        <ul className="space-y-2">
                          <li>⏱️ Faster completion = Higher score</li>
                          <li>🎯 Fewer failed attempts = Better ranking</li>
                          <li>💡 Hints used don't affect your score</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tips" className="space-y-4 mt-6">
                    <div className="space-y-3 text-slate-300 text-sm">
                      <div className="bg-green-950/30 rounded-lg p-4 border border-green-800">
                        <h3 className="text-green-400 mb-2">💡 Pro Tips:</h3>
                        <ul className="space-y-2">
                          <li>✓ Read all clues carefully before attempting solutions</li>
                          <li>✓ Look for patterns and connections between information</li>
                          <li>✓ Take notes of important numbers and codes</li>
                          <li>✓ Don't rush - think through each puzzle logically</li>
                        </ul>
                      </div>

                      <div className="bg-amber-950/30 rounded-lg p-4 border border-amber-800">
                        <h3 className="text-amber-400 mb-2">⚠️ Warnings:</h3>
                        <ul className="space-y-2">
                          <li>⚠️ The timer never stops - manage your time wisely</li>
                          <li>⚠️ Failed attempts add pressure but don't end the game</li>
                          <li>⚠️ Some puzzles require items from previous rooms</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <Button onClick={handleStart} className="w-full bg-cyan-600 hover:bg-cyan-700" size="lg">
                    <Play className="size-5 mr-2" />
                    Ready to Start
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}