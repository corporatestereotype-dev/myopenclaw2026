
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, PlayerStats } from '../types';

interface GameCanvasProps {
  onScoreUpdate: (points: number) => void;
  onHealthUpdate: (damage: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onScoreUpdate, onHealthUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState({ x: 100, y: 300, vx: 0, vy: 0, width: 40, height: 60, grounded: false });
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Background Gradient (Seaside Night)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Floor
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, ctx.canvas.height - 40, ctx.canvas.width, 40);
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, ctx.canvas.height - 40, ctx.canvas.width, 40);

    // Platforms (Static for demo)
    const platforms = [
      { x: 300, y: 350, w: 200, h: 20 },
      { x: 600, y: 250, w: 200, h: 20 },
      { x: 100, y: 200, w: 150, h: 20 }
    ];

    ctx.fillStyle = '#78350f';
    platforms.forEach(p => {
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeRect(p.x, p.y, p.w, p.h);
    });

    // Simple Player "Claw" (Abstract)
    ctx.fillStyle = '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fbbf24';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Hat
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(player.x - 5, player.y, player.width + 10, 10);
    ctx.shadowBlur = 0;

    // Movement Logic
    let nextX = player.x;
    let nextY = player.y;
    let nextVx = player.vx;
    let nextVy = player.vy;
    let nextGrounded = false;

    if (keys.current['ArrowLeft'] || keys.current['KeyA']) nextVx -= 0.8;
    if (keys.current['ArrowRight'] || keys.current['KeyD']) nextVx += 0.8;
    if ((keys.current['Space'] || keys.current['ArrowUp'] || keys.current['KeyW']) && player.grounded) {
        nextVy = -15;
    }

    // Physics
    nextVx *= 0.9; // Friction
    nextVy += 0.8; // Gravity
    nextX += nextVx;
    nextY += nextVy;

    // Boundaries & Platform Collisions
    if (nextY + player.height > ctx.canvas.height - 40) {
      nextY = ctx.canvas.height - 40 - player.height;
      nextVy = 0;
      nextGrounded = true;
    }

    platforms.forEach(p => {
      if (nextX + player.width > p.x && nextX < p.x + p.w &&
          nextY + player.height > p.y && nextY + player.height < p.y + p.h + nextVy &&
          nextVy >= 0) {
        nextY = p.y - player.height;
        nextVy = 0;
        nextGrounded = true;
      }
    });

    if (nextX < 0) nextX = 0;
    if (nextX + player.width > ctx.canvas.width) nextX = ctx.canvas.width - player.width;

    setPlayer(p => ({ ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy, grounded: nextGrounded }));

    // Interaction Simulation
    if (Math.random() < 0.005) onScoreUpdate(100);

  }, [player, onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const render = () => {
      draw(ctx);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [draw]);

  return (
    <div className="relative w-full h-[600px] border-4 border-amber-900 rounded-lg overflow-hidden shadow-inner bg-slate-950">
      <canvas 
        ref={canvasRef} 
        width={1024} 
        height={600} 
        className="w-full h-full object-cover cursor-none"
      />
      <div className="absolute bottom-4 right-4 text-amber-500/50 text-xs font-mono select-none">
        WASD TO MOVE | SPACE TO JUMP | SHIFT TO DASH (EMULATED)
      </div>
    </div>
  );
};

export default GameCanvas;
