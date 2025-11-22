import { useState } from 'react';
import { Vault, Lightbulb, Shield, Trophy, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { GameItem } from '../App';

type FinalVaultProps = {
  onComplete: () => void;
  addToInventory: (item: GameItem) => void;
  inventory: GameItem[];
  showNotification: (message: string) => void;
  incrementAttempts: () => void;
};

export function FinalVault({
  onComplete,
  addToInventory,
  inventory,
  showNotification,
  incrementAttempts,
}: FinalVaultProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [showClue, setShowClue] = useState(false);

  // Correct code: combines elements from all previous rooms
  // 21 (from SECURITY U position) + 88 (from letter count x11) + 04 (ECHO=4 letters) + 05 (5 nodes in laser grid)
  const correctCode = ['2', '1', '8', '8', '0', '5'];

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only last character
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`vault-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`vault-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = () => {
    const isCorrect = code.every((digit, index) => digit === correctCode[index]);

    if (isCorrect) {
      showNotification('🎉 VAULT UNLOCKED! Mission Complete!');
      setTimeout(onComplete, 1500);
    } else {
      incrementAttempts();
      setAttempts(attempts + 1);
      showNotification('❌ INCORRECT CODE. Vault remains sealed.');
      setCode(['', '', '', '', '', '']);
      document.getElementById('vault-input-0')?.focus();
    }
  };

  const hasRequiredItems = inventory.length >= 3;

  return (
    <div className="space-y-6">
      {/* Room Description */}
      <Card className="bg-gradient-to-r from-slate-900 to-amber-950 border-amber-800 p-6">
        <h2 className="text-amber-400 mb-2">
          🏆 ROOM 4 — The Final Vault
        </h2>
        <p className="text-slate-300">
          This is it - the vault containing the ultimate prize. The master lock requires a 6-digit
          code derived from your journey through all previous rooms. Use everything you've learned
          to crack the final code.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Vault className="size-4" />
          <span>Status: SEALED - Master code required</span>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Clues */}
        <div className="space-y-4">
          {/* Inventory Check */}
          <Card className="bg-gradient-to-br from-purple-950 to-slate-900 border-purple-900 p-6">
            <div className="flex items-start gap-3">
              <Shield className="size-5 text-purple-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-purple-300 mb-3">Your Collected Evidence</h3>
                <div className="space-y-2">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-purple-950/50 p-3 rounded border border-purple-800 text-sm"
                    >
                      <div className="text-purple-300">{item.name}</div>
                      <div className="text-purple-400/70 text-xs">{item.description}</div>
                    </div>
                  ))}
                  {inventory.length === 0 && (
                    <div className="text-slate-500 text-sm">No items collected yet</div>
                  )}
                </div>
                {!hasRequiredItems && (
                  <div className="mt-3 text-amber-400 text-sm">
                    ⚠️ Warning: You may be missing items from previous rooms
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Vault Door Panel */}
          <Card className="bg-slate-900 border-cyan-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Lock className="size-5 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-cyan-300 mb-2">Vault Access Panel</h3>
                <div className="bg-black p-4 rounded border border-cyan-800 font-mono text-sm space-y-2">
                  <div className="text-cyan-400">MASTER VAULT SYSTEM v3.0</div>
                  <div className="text-slate-500">=============================</div>
                  <div className="text-green-400">CODE FORMAT: XX-XX-XX</div>
                  <div className="text-amber-400 mt-3">CLUES:</div>
                  <div className="text-slate-400 text-xs space-y-1 mt-2">
                    <div>• First pair: Middle letter position (Room 1)</div>
                    <div>• Second pair: Letter count x11 (Room 1)</div>
                    <div>• Third pair: Word length (Room 2) + Path nodes (Room 3)</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Historical Reference */}
          <Card className="bg-slate-900 border-slate-700 p-6">
            <div className="flex items-start gap-3">
              <Trophy className="size-5 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-300 mb-2">Heist Log</h3>
                <div className="text-sm text-slate-400 space-y-1">
                  <div>✓ Room 1: Code was 2188 (but U=21, count=8)</div>
                  <div>✓ Room 2: Answer was ECHO (4 letters)</div>
                  <div>✓ Room 3: Path had 5 nodes</div>
                  <div className="text-amber-400 mt-2">
                    Combine these numbers wisely...
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Vault Lock */}
        <div>
          <Card className="bg-gradient-to-br from-slate-900 to-amber-950 border-amber-800 p-6 sticky top-24">
            <div className="text-center space-y-6">
              <div>
                <div className="inline-flex items-center justify-center size-24 rounded-full bg-amber-950 border-4 border-amber-700 mb-4 shadow-lg shadow-amber-900/50">
                  <Vault className="size-12 text-amber-400" />
                </div>
                <h3 className="text-amber-300 mb-2">Master Vault Lock</h3>
                <p className="text-sm text-slate-400">Enter 6-digit master code</p>
              </div>

              {/* Code Input */}
              <div className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <div key={index}>
                      <Input
                        id={`vault-input-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-16 text-center text-2xl bg-slate-950 border-amber-700 text-white font-mono"
                      />
                      {(index === 1 || index === 3) && (
                        <div className="text-amber-700 mt-2">-</div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={code.some((digit) => !digit)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-lg h-12"
                >
                  <Vault className="size-5 mr-2" />
                  UNLOCK VAULT
                </Button>
              </div>

              {attempts > 0 && (
                <div className="text-sm text-slate-400">
                  Failed attempts: <Badge variant="destructive">{attempts}</Badge>
                </div>
              )}

              {attempts >= 3 && (
                <div className="bg-red-950/50 border border-red-800 rounded p-3 text-sm text-red-300">
                  ⚠️ Multiple failed attempts. Review your journey through all rooms carefully.
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 space-y-1">
                <div>💡 Think about the numbers from each room</div>
                <div>💡 The code combines clues from your entire journey</div>
                <div>💡 Format: XX-XX-XX (6 digits total)</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}