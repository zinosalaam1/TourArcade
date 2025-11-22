import { useState } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Eye, Sparkles, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GameItem } from '../App';

type MirrorChamberProps = {
  onComplete: () => void;
  addToInventory: (item: GameItem) => void;
  inventory: GameItem[];
  showNotification: (message: string) => void;
  incrementAttempts: () => void;
};

export function MirrorChamber({
  onComplete,
  showNotification,
  incrementAttempts,
}: MirrorChamberProps) {
  const [code, setCode] = useState('');
  const [showClue1, setShowClue1] = useState(false);
  const [showClue2, setShowClue2] = useState(false);
  const [showClue3, setShowClue3] = useState(false);

  const correctCode = 'MOTA'; // Mirror-symmetric letters from "ATOM" when reading disc properly

  const handleSubmit = () => {
    if (code.toUpperCase() === correctCode) {
      showNotification('🎉 Mirror Chamber unlocked! The reflection reveals the truth!');
      setTimeout(onComplete, 1500);
    } else {
      incrementAttempts();
      showNotification('❌ Incorrect symbols. The mirrors show something different...');
      setCode('');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="text-4xl">🪞</div>
          <div>
            <h1 className="text-cyan-400 text-3xl">Mirror Chamber</h1>
            <p className="text-slate-400">
              The truth is shown twice. The path is shown once.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 flex-1">
        {/* Left Column - Clues */}
        <div className="space-y-6">
          {/* Central Pedestal */}
          <Card className="bg-slate-900 border-purple-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="size-5 text-purple-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-purple-300 mb-3">Central Pedestal Inscription</h3>
                <div className="bg-black p-4 rounded border-2 border-purple-800 font-serif">
                  <p className="text-purple-200 text-center italic leading-relaxed">
                    "The truth is shown twice.<br />
                    The path is shown once.<br />
                    Only the reflected symbols will open the vault."
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowClue1(!showClue1)}
              variant="outline"
              size="sm"
              className="w-full border-purple-800 text-purple-400"
            >
              <Lightbulb className="size-4 mr-2" />
              {showClue1 ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showClue1 && (
              <div className="mt-3 p-3 bg-purple-950/50 rounded border border-purple-800 text-sm text-purple-200">
                💡 "Shown twice" means some symbols look the same in a mirror. "Shown once" means they don't. Think about which letters are symmetric when reflected.
              </div>
            )}
          </Card>

          {/* Stone Disc */}
          <Card className="bg-slate-900 border-cyan-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Eye className="size-5 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-cyan-300 mb-3">Ancient Stone Disc</h3>
                <div className="bg-black p-6 rounded border-2 border-cyan-800">
                  <div className="text-center space-y-4">
                    <div className="text-cyan-400 font-mono text-2xl tracking-widest">
                      LINE 1: &nbsp; &nbsp;A T O M
                    </div>
                    <div className="border-t border-cyan-800/50 my-3" />
                    <div className="text-green-400 font-mono text-2xl tracking-widest">
                      LINE 2: &nbsp; &nbsp;B E N D
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowClue2(!showClue2)}
              variant="outline"
              size="sm"
              className="w-full border-cyan-800 text-cyan-400"
            >
              <Lightbulb className="size-4 mr-2" />
              {showClue2 ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showClue2 && (
              <div className="mt-3 p-3 bg-cyan-950/50 rounded border border-cyan-800 text-sm text-cyan-200 space-y-2">
                <div>💡 Look at each letter carefully. Which letters look exactly the same when you flip them horizontally in a mirror?</div>
                <div>💡 Letters like A, H, I, M, O, T, U, V, W, X, Y are mirror-symmetric. Letters like B, D, E, N are not.</div>
              </div>
            )}
          </Card>

          {/* Mirror Panel */}
          <Card className="bg-slate-900 border-blue-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Eye className="size-5 text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-blue-300 mb-3">Reflective Mirror Surface</h3>
                <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 p-6 rounded border-2 border-blue-800">
                  <div className="text-center">
                    <div className="text-blue-300 mb-4 text-sm italic">
                      When you look into the mirror...
                    </div>
                    <div className="bg-black/50 p-4 rounded border border-blue-700">
                      <div className="text-blue-400 font-mono text-xl tracking-wider opacity-70">
                        ? ? ? ?
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mt-3">
                      The symbols that remain unchanged hold the key
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowClue3(!showClue3)}
              variant="outline"
              size="sm"
              className="w-full border-blue-800 text-blue-400"
            >
              <Lightbulb className="size-4 mr-2" />
              {showClue3 ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showClue3 && (
              <div className="mt-3 p-3 bg-blue-950/50 rounded border border-blue-800 text-sm text-blue-200 space-y-2">
                <div>💡 The inscription says "shown twice" = symmetric letters, "shown once" = non-symmetric letters.</div>
                <div>💡 From LINE 1 (ATOM): A, T, O, M are all symmetric - they're "shown twice" (same in mirror).</div>
                <div>💡 From LINE 2 (BEND): B, E, N, D are all non-symmetric - they're "shown once" (different in mirror).</div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Vault Lock */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-purple-900 p-6">
            <div className="flex items-start gap-3 mb-6">
              <Lock className="size-5 text-purple-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-purple-300 mb-2">Mirror Vault Lock</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Enter the 4 symbols revealed by the mirror reflection
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">
                      4-Symbol Code (use only the reflected letters)
                    </label>
                    <Input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Enter 4 letters..."
                      className="bg-slate-950 border-purple-800 text-lg font-mono tracking-widest uppercase text-white"
                      maxLength={4}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && code.length === 4) {
                          handleSubmit();
                        }
                      }}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={code.length !== 4}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                    size="lg"
                  >
                    Unlock Mirror Vault
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Visual Guide */}
          <Card className="bg-gradient-to-br from-purple-950/20 to-blue-950/20 border-purple-800/50 p-6">
            <h3 className="text-purple-300 mb-4 flex items-center gap-2">
              <Sparkles className="size-5" />
              Understanding Mirrors
            </h3>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="bg-black/30 p-4 rounded border border-purple-800/30">
                <div className="text-green-400 mb-2">✓ Mirror-Symmetric Letters:</div>
                <div className="font-mono text-lg text-center text-cyan-400">
                  A H I M O T U V W X Y
                </div>
                <div className="text-xs text-slate-400 text-center mt-2">
                  These look the same when reflected horizontally
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded border border-purple-800/30">
                <div className="text-red-400 mb-2">✗ Non-Symmetric Letters:</div>
                <div className="font-mono text-lg text-center text-slate-400">
                  B C D E F G J K L N P Q R S Z
                </div>
                <div className="text-xs text-slate-400 text-center mt-2">
                  These look different when reflected
                </div>
              </div>

              <div className="text-xs text-center text-amber-400 italic">
                💡 The answer uses only symmetric letters from the stone disc!
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
