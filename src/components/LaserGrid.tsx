import { useState, useEffect } from 'react';
import { Zap, Lightbulb, Grid3x3, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GameItem } from '../App';

type LaserGridProps = {
  onComplete: () => void;
  addToInventory: (item: GameItem) => void;
  inventory: GameItem[];
  showNotification: (message: string) => void;
  incrementAttempts: () => void;
};

type GridCell = {
  x: number;
  y: number;
  color: string;
};

export function LaserGrid({
  onComplete,
  addToInventory,
  inventory,
  showNotification,
  incrementAttempts,
}: LaserGridProps) {
  const [selectedPath, setSelectedPath] = useState<GridCell[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [showClue, setShowClue] = useState(false);
  const [hasGoggles, setHasGoggles] = useState(false);
  const [showLasers, setShowLasers] = useState(false);

  // The correct path pattern (color sequence)
  const correctPath: GridCell[] = [
    { x: 0, y: 0, color: 'red' },
    { x: 1, y: 1, color: 'blue' },
    { x: 2, y: 0, color: 'green' },
    { x: 3, y: 1, color: 'red' },
    { x: 4, y: 2, color: 'blue' },
  ];

  const gridSize = 5;
  const rows = 3;

  const handleCellClick = (x: number, y: number) => {
    const color = getLaserColor(x, y);
    const newCell = { x, y, color };

    // Check if already selected
    const index = selectedPath.findIndex((cell) => cell.x === x && cell.y === y);
    if (index !== -1) {
      // Remove if already selected
      setSelectedPath(selectedPath.filter((_, i) => i !== index));
    } else {
      // Add to path
      setSelectedPath([...selectedPath, newCell]);
    }
  };

  const getLaserColor = (x: number, y: number): string => {
    // Define the laser grid pattern
    const pattern: string[][] = [
      ['red', 'green', 'green', 'blue', 'red'],
      ['blue', 'blue', 'red', 'red', 'green'],
      ['green', 'red', 'blue', 'green', 'blue'],
    ];
    return pattern[y][x];
  };

  const handleSubmit = () => {
    if (selectedPath.length !== correctPath.length) {
      showNotification('❌ Path incomplete. You need to select 5 nodes.');
      return;
    }

    // Check if path matches
    const isCorrect = selectedPath.every(
      (cell, index) =>
        cell.x === correctPath[index].x &&
        cell.y === correctPath[index].y &&
        cell.color === correctPath[index].color
    );

    if (isCorrect) {
      showNotification('🎉 SEQUENCE CORRECT! Laser grid deactivated!');
      setTimeout(onComplete, 1500);
    } else {
      incrementAttempts();
      setAttempts(attempts + 1);
      showNotification('❌ INCORRECT SEQUENCE. Grid remains active.');
      setSelectedPath([]);
    }
  };

  const collectGoggles = () => {
    if (!hasGoggles) {
      setHasGoggles(true);
      setShowLasers(true);
      addToInventory({
        id: 'infrared-goggles',
        name: 'Infrared Goggles',
        description: 'Allows you to see the invisible laser grid',
      });
      showNotification('👓 Goggles equipped! Lasers are now visible!');
    }
  };

  const resetPath = () => {
    setSelectedPath([]);
  };

  return (
    <div className="space-y-6">
      {/* Room Description */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <h2 className="text-cyan-400 mb-2">
          ⚡ ROOM 3 — Laser Grid Hallway
        </h2>
        <p className="text-slate-300">
          A sophisticated laser security system protects the vault entrance. Navigate through the
          grid by selecting the correct sequence of colored nodes. One wrong move triggers the
          alarm!
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Zap className="size-4" />
          <span>Status: ACTIVE - Sequence pattern required</span>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Clues and Grid */}
        <div className="space-y-4">
          {/* Goggles */}
          <Card className="bg-gradient-to-br from-purple-950 to-slate-900 border-purple-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Eye className="size-5 text-purple-400" />
                <div>
                  <h3 className="text-purple-300">Infrared Goggles</h3>
                  <p className="text-sm text-slate-400">Essential equipment on the wall</p>
                </div>
              </div>
              <Button
                onClick={collectGoggles}
                disabled={hasGoggles}
                variant={hasGoggles ? 'outline' : 'default'}
                size="sm"
              >
                {hasGoggles ? 'Equipped' : 'Take'}
              </Button>
            </div>
            {hasGoggles && (
              <div className="text-sm text-purple-300 bg-purple-950/50 p-3 rounded border border-purple-800">
                ✓ Goggles active - Lasers are now visible on the grid
              </div>
            )}
          </Card>

          {/* Wall Panel Clue */}
          <Card className="bg-slate-900 border-cyan-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Grid3x3 className="size-5 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-cyan-300 mb-2">Control Panel Display</h3>
                <div className="bg-black p-4 rounded border border-cyan-800 font-mono text-sm space-y-2">
                  <div className="text-cyan-400">SECURITY PROTOCOL ACTIVE</div>
                  <div className="text-slate-500">----------------------------------------</div>
                  <div className="text-green-400">Safe Path Sequence:</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge className="bg-red-600">RED</Badge>
                    <Badge className="bg-blue-600">BLUE</Badge>
                    <Badge className="bg-green-600">GREEN</Badge>
                    <Badge className="bg-red-600">RED</Badge>
                    <Badge className="bg-blue-600">BLUE</Badge>
                  </div>
                  <div className="text-slate-500 text-xs mt-3">
                    Navigate nodes in this color order
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowClue(!showClue)}
              variant="outline"
              size="sm"
              className="w-full border-cyan-800 text-cyan-400"
            >
              <Lightbulb className="size-4 mr-2" />
              {showClue ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showClue && (
              <div className="mt-3 p-3 bg-cyan-950/50 rounded border border-cyan-800 text-sm text-cyan-200 space-y-2">
                <div>💡 You need to select 5 nodes that form a path through the grid.</div>
                <div>💡 Follow the color sequence: Red → Blue → Green → Red → Blue</div>
                <div>💡 Start from the top-left area and work your way across.</div>
              </div>
            )}
          </Card>

          {/* Laser Grid */}
          <Card className="bg-slate-900 border-amber-900 p-6">
            <h3 className="text-amber-300 mb-4 text-center">Laser Grid Security System</h3>
            {!hasGoggles && (
              <div className="text-center text-slate-500 py-8">
                <Eye className="size-12 mx-auto mb-2 opacity-20" />
                <p>Grid not visible. Find the infrared goggles...</p>
              </div>
            )}
            {hasGoggles && (
              <div className="space-y-3">
                {Array.from({ length: rows }).map((_, y) => (
                  <div key={y} className="flex gap-2 justify-center">
                    {Array.from({ length: gridSize }).map((_, x) => {
                      const color = getLaserColor(x, y);
                      const isSelected = selectedPath.some(
                        (cell) => cell.x === x && cell.y === y
                      );
                      const selectedIndex = selectedPath.findIndex(
                        (cell) => cell.x === x && cell.y === y
                      );

                      const colorClasses = {
                        red: 'bg-red-600 border-red-400',
                        blue: 'bg-blue-600 border-blue-400',
                        green: 'bg-green-600 border-green-400',
                      };

                      return (
                        <button
                          key={`${x}-${y}`}
                          onClick={() => handleCellClick(x, y)}
                          className={`size-16 rounded-lg border-2 transition-all ${
                            colorClasses[color as keyof typeof colorClasses]
                          } ${
                            isSelected
                              ? 'ring-4 ring-white shadow-lg scale-110'
                              : 'opacity-40 hover:opacity-70 hover:scale-105'
                          }`}
                        >
                          {isSelected && (
                            <div className="text-white text-xl">{selectedIndex + 1}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Controls */}
        <div>
          <Card className="bg-slate-900 border-green-900 p-6 sticky top-24">
            <div className="text-center space-y-6">
              <div>
                <div className="inline-flex items-center justify-center size-20 rounded-full bg-green-950 border-2 border-green-800 mb-4">
                  <Zap className="size-10 text-green-400" />
                </div>
                <h3 className="text-green-300 mb-2">Path Override Console</h3>
                <p className="text-sm text-slate-400">
                  Select {correctPath.length} nodes in sequence
                </p>
              </div>

              {/* Selected Path Display */}
              <div className="bg-black p-4 rounded border-2 border-green-800">
                <div className="text-green-400 text-sm mb-2">SELECTED PATH:</div>
                <div className="flex gap-2 flex-wrap justify-center min-h-[40px]">
                  {selectedPath.length === 0 ? (
                    <div className="text-slate-600 text-xs">No nodes selected</div>
                  ) : (
                    selectedPath.map((cell, index) => (
                      <Badge
                        key={index}
                        className={`${
                          cell.color === 'red'
                            ? 'bg-red-600'
                            : cell.color === 'blue'
                            ? 'bg-blue-600'
                            : 'bg-green-600'
                        }`}
                      >
                        {index + 1}. {cell.color.toUpperCase()}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={!hasGoggles || selectedPath.length !== correctPath.length}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  SUBMIT SEQUENCE
                </Button>

                <Button
                  onClick={resetPath}
                  disabled={selectedPath.length === 0}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  RESET PATH
                </Button>
              </div>

              {attempts > 0 && (
                <div className="text-sm text-slate-400">
                  Failed attempts: <Badge variant="destructive">{attempts}</Badge>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 space-y-1">
                <div>💡 Find the goggles first</div>
                <div>💡 Follow the color sequence from the panel</div>
                <div>💡 Click nodes to select them in order</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}