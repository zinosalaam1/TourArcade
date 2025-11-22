import { Clock, Package, Pause, User } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type GameHeaderProps = {
  currentRoom: number;
  timeRemaining: number;
  roomsCompleted: boolean[];
  onPause: () => void;
  playerName: string;
};

const roomNames = [
  'Security Lobby',
  'Server Core',
  'Laser Grid Hallway',
  'The Final Vault',
];

export function GameHeader({ currentRoom, timeRemaining, roomsCompleted, onPause, playerName }: GameHeaderProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining < 300; // Less than 5 minutes

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-cyan-400 mb-1">
              🎮 CYBER HEIST
            </h1>
            <p className="text-slate-400 text-sm">
              Room {currentRoom}: {roomNames[currentRoom - 1]}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Player name */}
            <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
              <User className="size-4" />
              <span>{playerName}</span>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              {roomsCompleted.map((completed, index) => (
                <div
                  key={index}
                  className={`size-8 rounded border-2 flex items-center justify-center text-xs ${
                    completed
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : index === currentRoom - 1
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 animate-pulse'
                      : 'border-slate-700 text-slate-600'
                  }`}
                >
                  {completed ? '✓' : index + 1}
                </div>
              ))}
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded border-2 ${
                isLowTime
                  ? 'border-red-500 bg-red-500/10 text-red-400 animate-pulse'
                  : 'border-slate-700 bg-slate-900/50'
              }`}
            >
              <Clock className="size-5" />
              <span className="tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            {/* Pause button */}
            <Button
              onClick={onPause}
              variant="outline"
              size="sm"
              className="border-slate-700 hover:border-cyan-600"
            >
              <Pause className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}