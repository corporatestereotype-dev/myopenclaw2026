
import React from 'react';
import { Heart, Target, Flame, Zap, Trophy, User } from 'lucide-react';
import { PlayerStats } from '../types';

interface ClawHUDProps {
  stats: PlayerStats;
}

const ClawHUD: React.FC<ClawHUDProps> = ({ stats }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-10">
      {/* Top Left: Character & Health */}
      <div className="flex items-center space-x-4 bg-slate-900/80 border-2 border-amber-600 p-3 rounded-br-2xl shadow-2xl backdrop-blur-md">
        <div className="relative">
          <div className="w-16 h-16 bg-amber-900 rounded-full border-2 border-amber-400 overflow-hidden">
            <img 
              src="https://picsum.photos/seed/claw-avatar/200/200" 
              alt="Captain Claw" 
              className="w-full h-full object-cover grayscale brightness-125"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-900 text-xs font-bold px-1.5 rounded-full border border-slate-900">
            x{stats.lives}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-cinzel text-amber-400 font-bold text-lg leading-none">CLAW</span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Heart 
                  key={i} 
                  size={14} 
                  fill={i < stats.health / 20 ? "#ef4444" : "transparent"} 
                  className={i < stats.health / 20 ? "text-red-500" : "text-slate-600"}
                />
              ))}
            </div>
          </div>
          <div className="w-48 h-3 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
              style={{ width: `${stats.health}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Right: Score & Items */}
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2 bg-slate-900/80 border-2 border-amber-600 px-4 py-2 rounded-bl-2xl shadow-2xl backdrop-blur-md">
          <Trophy className="text-amber-400" size={20} />
          <span className="font-medieval text-2xl text-amber-100 tracking-wider">
            {stats.score.toLocaleString().padStart(8, '0')}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatItem icon={<Target size={16}/>} value={stats.pistol} color="text-slate-300" label="P" />
          <StatItem icon={<Zap size={16}/>} value={stats.magic} color="text-cyan-400" label="M" />
          <StatItem icon={<Flame size={16}/>} value={stats.dynamite} color="text-orange-500" label="D" />
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ icon: React.ReactNode, value: number, color: string, label: string }> = ({ icon, value, color, label }) => (
  <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-700 px-2 py-1 rounded shadow-lg backdrop-blur-sm">
    <div className={color}>{icon}</div>
    <span className="text-white font-bold text-sm">{value}</span>
  </div>
);

export default ClawHUD;
