import { useState } from 'react';
import { Lock, Lightbulb, Monitor, StickyNote, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { GameItem } from '../App';

type SecurityLobbyProps = {
  onComplete: () => void;
  addToInventory: (item: GameItem) => void;
  inventory: GameItem[];
  showNotification: (message: string) => void;
  incrementAttempts: () => void;
};

export function SecurityLobby({
  onComplete,
  addToInventory,
  inventory,
  showNotification,
  incrementAttempts,
}: SecurityLobbyProps) {
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showClue1, setShowClue1] = useState(false);
  const [showClue2, setShowClue2] = useState(false);
  const [showClue3, setShowClue3] = useState(false);
  const [hasKeycard, setHasKeycard] = useState(false);

  const correctCode = '2188';

  const handleSubmit = () => {
    if (code === correctCode) {
      showNotification('🎉 ACCESS GRANTED! Door unlocked!');
      setTimeout(onComplete, 1500);
    } else {
      incrementAttempts();
      setAttempts(attempts + 1);
      showNotification('❌ INCORRECT CODE. Try again.');
      setCode('');
    }
  };

  const collectKeycard = () => {
    if (!hasKeycard) {
      setHasKeycard(true);
      addToInventory({
        id: 'keycard-level-1',
        name: 'Level 1 Keycard',
        description: 'Security clearance badge for server access',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Room Description */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <h2 className="text-cyan-400 mb-2">
          🛑 ROOM 1 — Security Lobby
        </h2>
        <p className="text-slate-300">
          You've infiltrated the building. The security door requires a 4-digit code to proceed.
          Search the room for clues to unlock the door before the system detects your presence.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Lock className="size-4" />
          <span>Status: LOCKED - 4-digit code required</span>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Clues */}
        <div className="space-y-4">
          {/* Digital Wall Sign */}
          <Card className="bg-gradient-to-br from-cyan-950 to-slate-900 border-cyan-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Monitor className="size-5 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-cyan-300 mb-2">Digital Wall Sign</h3>
                <div className="bg-black/50 p-4 rounded border border-cyan-800">
                  <p className="text-cyan-400 animate-pulse text-center">
                    "The key is in the word SECURITY itself."
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowClue1(!showClue1)}
              variant="outline"
              size="sm"
              className="w-full border-cyan-800 text-cyan-400"
            >
              <Lightbulb className="size-4 mr-2" />
              {showClue1 ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showClue1 && (
              <div className="mt-3 p-3 bg-cyan-950/50 rounded border border-cyan-800 text-sm text-cyan-200">
                💡 Look at the word SECURITY shown on the monitor below. Each letter has a
                position in the alphabet.
              </div>
            )}
          </Card>

          {/* Sticky Note */}
          <Card className="bg-yellow-900/20 border-yellow-700/50 p-6">
            <div className="flex items-start gap-3 mb-4">
              <StickyNote className="size-5 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-300 mb-2">Sticky Note on Desk</h3>
                <div className="bg-yellow-900/30 p-4 rounded border border-yellow-700">
                  <p className="text-yellow-200 font-handwriting">
                    "First, Last, Middle, Count"
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowClue2(!showClue2)}
              variant="outline"
              size="sm"
              className="w-full border-yellow-700 text-yellow-400"
            >
              <Lightbulb className="size-4 mr-2" />
              {showClue2 ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showClue2 && (
              <div className="mt-3 p-3 bg-yellow-950/50 rounded border border-yellow-700 text-sm text-yellow-200">
                💡 This tells you what to calculate: First letter of SECURITY, Last letter,
                Middle letter, and Count of total letters.
              </div>
            )}
          </Card>

          {/* Monitor Display */}
          <Card className="bg-slate-900 border-green-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Monitor className="size-5 text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-green-300 mb-2">Security Monitor</h3>
                <div className="bg-black p-6 rounded border-2 border-green-800 font-mono">
                  <div className="text-green-400 text-center space-y-2">
                    <div className="text-3xl tracking-widest">SECURITY</div>
                    <div className="text-sm text-green-600">
                      S-E-C-U-R-I-T-Y
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Solution button removed */}
          </Card>

          {/* Keycard pickup */}
          <Card className="bg-slate-900/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-blue-400" />
                <div>
                  <h3 className="text-blue-300">Level 1 Keycard</h3>
                  <p className="text-sm text-slate-400">On the security desk</p>
                </div>
              </div>
              <Button
                onClick={collectKeycard}
                disabled={hasKeycard}
                variant={hasKeycard ? 'outline' : 'default'}
                size="sm"
              >
                {hasKeycard ? 'Collected' : 'Take'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Door Lock */}
        <div>
          <Card className="bg-slate-900 border-red-900 p-6 sticky top-24">
            <div className="text-center space-y-6">
              <div>
                <div className="inline-flex items-center justify-center size-20 rounded-full bg-red-950 border-2 border-red-800 mb-4">
                  <Lock className="size-10 text-red-400" />
                </div>
                <h3 className="text-red-300 mb-2">Security Door Lock</h3>
                <p className="text-sm text-slate-400">Enter 4-digit access code</p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="text-center text-2xl tracking-widest bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && code.length === 4) {
                      handleSubmit();
                    }
                  }}
                />

                <Button
                  onClick={handleSubmit}
                  disabled={code.length !== 4}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                  size="lg"
                >
                  UNLOCK DOOR
                </Button>
              </div>

              {attempts > 0 && (
                <div className="text-sm text-slate-400">
                  Failed attempts: <Badge variant="destructive">{attempts}</Badge>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
                💡 Analyze the clues carefully. The answer comes from the word itself.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}