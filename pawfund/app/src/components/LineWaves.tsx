import { useRef, useEffect } from 'react';

interface LineWavesProps {
  speed?: number;
  innerLineCount?: number;
  outerLineCount?: number;
  warpIntensity?: number;
  rotation?: number;
  brightness?: number;
  color1?: string;
  color3?: string;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
  className?: string;
}

export default function LineWaves({
  speed = 0.3,
  innerLineCount = 31,
  outerLineCount = 36,
  warpIntensity = 1,
  rotation = -45,
  brightness = 0.2,
  color1 = '#bb00ff',
  color3 = '#ed1d8f',
  enableMouseInteraction = true,
  mouseInfluence = 2,
  className = '',
}: LineWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;
    let time = 0;
    
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableMouseInteraction) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      time += speed * 0.05;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      
      const maxDim = Math.max(width, height) * 1.5;
      
      const drawLines = (count: number, alpha: number) => {
        for (let i = 0; i < count; i++) {
          const y = (i / count - 0.5) * maxDim;
          ctx.beginPath();
          for (let x = -maxDim / 2; x < maxDim / 2; x += 20) {
            const wave = Math.sin(x * 0.01 + time + y * 0.01) * 20 * warpIntensity;
            const mouseDist = Math.sqrt(Math.pow(x - (mouseX - width/2), 2) + Math.pow(y - (mouseY - height/2), 2));
            const mouseEffect = enableMouseInteraction ? Math.max(0, 1 - mouseDist / 500) * 50 * mouseInfluence : 0;
            
            ctx.lineTo(x, y + wave + mouseEffect * Math.sin(time * 5));
          }
          ctx.strokeStyle = `rgba(255,255,255, ${alpha * brightness})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      };

      drawLines(outerLineCount, 0.1);
      drawLines(innerLineCount, 0.3);

      ctx.restore();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, innerLineCount, outerLineCount, warpIntensity, rotation, brightness, enableMouseInteraction, mouseInfluence]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 opacity-60 ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 50%, ${color1}20 0%, transparent 60%), radial-gradient(circle at 80% 20%, ${color3}20 0%, transparent 40%)`
      }}
    />
  );
}