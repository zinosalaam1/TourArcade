import { useState } from 'react';
import { Server, Lightbulb, Terminal, Wifi, HardDrive } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { GameItem } from '../App';

type ServerCoreProps = {
  onComplete: () => void;
  addToInventory: (item: GameItem) => void;
  inventory: GameItem[];
  showNotification: (message: string) => void;
  incrementAttempts: () => void;
};

export function ServerCore({
  onComplete,
  addToInventory,
  inventory,
  showNotification,
  incrementAttempts,
}: ServerCoreProps) {
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showClue1, setShowClue1] = useState(false);
  const [showClue2, setShowClue2] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);

  const correctAnswer = 'ECHO';

  const handleSubmit = () => {
    if (answer.toUpperCase() === correctAnswer) {
      showNotification('🎉 CONSOLE UNLOCKED! Access granted!');
      setTimeout(onComplete, 1500);
    } else {
      incrementAttempts();
      setAttempts(attempts + 1);
      showNotification('❌ INCORRECT. Access denied.');
      setAnswer('');
    }
  };

  const collectToken = () => {
    if (!hasAccessToken) {
      setHasAccessToken(true);
      addToInventory({
        id: 'access-token',
        name: 'Network Access Token',
        description: 'Encrypted authentication token for vault systems',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Room Description */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <h2 className="text-cyan-400 mb-2">
          🔌 ROOM 2 — Server Core
        </h2>
        <p className="text-slate-300">
          You've entered the server room. A console terminal needs a 4-letter command word to
          unlock. Study the network diagnostics to find the answer.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Server className="size-4" />
          <span>Status: LOCKED - Authentication required</span>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Clues */}
        <div className="space-y-4">
          {/* Broken Screen */}
          <Card className="bg-gradient-to-br from-red-950 to-slate-900 border-red-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Terminal className="size-5 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-300 mb-2">Broken Screen Display</h3>
                <div className="bg-black/50 p-4 rounded border border-red-800 font-mono">
                  <div className="text-red-400 space-y-2">
                    <div className="flicker">PING?</div>
                    <div className="text-red-600 text-xs">
                      [█████_____] Signal corrupted...
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowClue1(!showClue1)}
              variant="outline"
              size="sm"
              className="w-full border-red-800 text-red-400"
            >
              <Lightbulb className="size-4 mr-2" />
              {showClue1 ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showClue1 && (
              <div className="mt-3 p-3 bg-red-950/50 rounded border border-red-800 text-sm text-red-200">
                💡 PING is a network command. What's the typical response when you ping a server?
              </div>
            )}
          </Card>

          {/* Server IP List */}
          <Card className="bg-slate-900 border-green-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Wifi className="size-5 text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-green-300 mb-3">Active Server Nodes</h3>
                <div className="bg-black p-4 rounded border border-green-800 font-mono text-sm space-y-2">
                  <div className="text-slate-500">192.168.1.101 [INACTIVE]</div>
                  <div className="text-green-400 animate-pulse">
                    <span className="text-red-400">E</span>
                    10.0.0.45 [ACTIVE]
                  </div>
                  <div className="text-slate-500">172.16.0.88 [INACTIVE]</div>
                  <div className="text-green-400 animate-pulse">
                    <span className="text-red-400">C</span>
                    10.0.0.73 [ACTIVE]
                  </div>
                  <div className="text-slate-500">192.168.5.200 [INACTIVE]</div>
                  <div className="text-green-400 animate-pulse">
                    <span className="text-red-400">H</span>
                    10.0.0.99 [ACTIVE]
                  </div>
                  <div className="text-slate-500">172.31.4.12 [INACTIVE]</div>
                  <div className="text-green-400 animate-pulse">
                    <span className="text-red-400">O</span>
                    10.0.0.125 [ACTIVE]
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowClue2(!showClue2)}
              variant="outline"
              size="sm"
              className="w-full border-green-800 text-green-400"
            >
              <Lightbulb className="size-4 mr-2" />
              {showClue2 ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showClue2 && (
              <div className="mt-3 p-3 bg-green-950/50 rounded border border-green-800 text-sm text-green-200">
                💡 Notice the red highlighted letters before each ACTIVE server IP address. Read
                them from top to bottom: E-C-H-O. This is the response to a PING command!
              </div>
            )}
          </Card>

          {/* Additional Clue */}
          <Card className="bg-cyan-950/30 border-cyan-900 p-6">
            <div className="flex items-start gap-3">
              <HardDrive className="size-5 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-cyan-300 mb-2">Network Log</h3>
                <div className="bg-black/50 p-3 rounded border border-cyan-800 font-mono text-xs text-cyan-400">
                  <div>{'>'} ping server.local</div>
                  <div className="text-cyan-600">Sending request...</div>
                  <div className="text-green-400">Reply received</div>
                  <div className="text-cyan-600 mt-2">
                    Protocol: ICMP _____ Request/Reply
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  The console is waiting for the 4-letter network response command.
                </p>
              </div>
            </div>
          </Card>

          {/* Token pickup */}
          <Card className="bg-slate-900/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi className="size-5 text-purple-400" />
                <div>
                  <h3 className="text-purple-300">Network Access Token</h3>
                  <p className="text-sm text-slate-400">Found in server rack</p>
                </div>
              </div>
              <Button
                onClick={collectToken}
                disabled={hasAccessToken}
                variant={hasAccessToken ? 'outline' : 'default'}
                size="sm"
              >
                {hasAccessToken ? 'Collected' : 'Take'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Console Lock */}
        <div>
          <Card className="bg-slate-900 border-amber-900 p-6 sticky top-24">
            <div className="text-center space-y-6">
              <div>
                <div className="inline-flex items-center justify-center size-20 rounded-full bg-amber-950 border-2 border-amber-800 mb-4">
                  <Terminal className="size-10 text-amber-400" />
                </div>
                <h3 className="text-amber-300 mb-2">Console Terminal</h3>
                <p className="text-sm text-slate-400">Enter 4-letter command</p>
              </div>

              <div className="bg-black p-4 rounded border-2 border-amber-800 font-mono text-left">
                <div className="text-green-400 text-xs space-y-1">
                  <div>$ system-authenticate</div>
                  <div className="text-amber-400">{'>'} Enter password:</div>
                  <div className="text-cyan-400 animate-pulse">_</div>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  maxLength={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  placeholder="____"
                  className="text-center text-2xl tracking-widest bg-slate-950 border-slate-700 uppercase text-white placeholder:text-slate-600"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && answer.length === 4) {
                      handleSubmit();
                    }
                  }}
                />

                <Button
                  onClick={handleSubmit}
                  disabled={answer.length !== 4}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  size="lg"
                >
                  AUTHENTICATE
                </Button>
              </div>

              {attempts > 0 && (
                <div className="text-sm text-slate-400">
                  Failed attempts: <Badge variant="destructive">{attempts}</Badge>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
                💡 What does a server reply with when you PING it?
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}