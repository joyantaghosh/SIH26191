import React, { useEffect, useRef } from 'react';

export default function RainScreenEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse & Wind tracking (gentle lerp)
    const mouse = {
      targetWind: 0.06,
      currWind: 0.06,
    };

    const handleMouseMove = (e) => {
      mouse.targetWind = 0.06 + ((e.clientX - width / 2) / width) * 0.15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Manual gentle ripple on click
    const handleMouseClick = (e) => {
      triggerCameraImpact(e.clientX, e.clientY, true);
    };

    window.addEventListener('click', handleMouseClick);

    // 1. Serene Distant Fine Rain (80% Reduced & Slow)
    const distantRainCount = 45;
    const distantRain = Array.from({ length: distantRainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 10 + Math.random() * 12,
      speed: 6 + Math.random() * 5,
      opacity: 0.12 + Math.random() * 0.18,
    }));

    // 2. Tranquil Mid-Ground Rain Streaks (80% Reduced)
    const midRainCount = 18;
    const midRain = Array.from({ length: midRainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 22 + Math.random() * 26,
      speed: 10 + Math.random() * 6,
      opacity: 0.22 + Math.random() * 0.2,
      thickness: 1.1,
    }));

    // 3. Gentle Glass Surface Drops (80% Reduced)
    const glassDropCount = 8;
    const glassDrops = Array.from({ length: glassDropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 2.2 + Math.random() * 2.8,
      speedY: 0.06 + Math.random() * 0.18,
      trail: [],
      maxTrailLength: 8,
      wobblePhase: Math.random() * Math.PI * 2,
    }));

    // 4. Subtle Lens Impact Ripples
    let cameraImpacts = [];

    function triggerCameraImpact(impactX, impactY, isClick = false) {
      if (cameraImpacts.length >= 3) cameraImpacts.shift();
      cameraImpacts.push({
        x: impactX || Math.random() * width,
        y: impactY || Math.random() * height,
        radius: 2,
        maxRadius: isClick ? 32 : 18,
        opacity: isClick ? 0.7 : 0.45,
      });
    }

    let lastCameraImpact = performance.now();

    // 60fps High-Performance Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth wind angle
      mouse.currWind += (mouse.targetWind - mouse.currWind) * 0.03;
      const windAngle = mouse.currWind;

      // --- LAYER 1: Distant Fine Rain ---
      ctx.lineWidth = 0.8;
      distantRain.forEach((drop) => {
        drop.x += windAngle * drop.speed;
        drop.y += drop.speed;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }

        ctx.strokeStyle = `rgba(180, 205, 170, ${drop.opacity})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + windAngle * drop.length, drop.y + drop.length);
        ctx.stroke();
      });

      // --- LAYER 2: Mid-ground Streaks ---
      midRain.forEach((drop) => {
        drop.x += windAngle * drop.speed;
        drop.y += drop.speed;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }

        const endX = drop.x + windAngle * drop.length;
        const endY = drop.y + drop.length;

        ctx.strokeStyle = `rgba(228, 233, 223, ${drop.opacity})`;
        ctx.lineWidth = drop.thickness;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      // --- LAYER 3: Occasional Screen Ripples ---
      const now = performance.now();
      if (now - lastCameraImpact > 6000 + Math.random() * 3000) {
        triggerCameraImpact();
        lastCameraImpact = now;
      }

      for (let i = cameraImpacts.length - 1; i >= 0; i--) {
        const impact = cameraImpacts[i];
        impact.radius += 0.6;
        impact.opacity -= 0.008;

        if (impact.opacity <= 0) {
          cameraImpacts.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(impact.x, impact.y, impact.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(134, 169, 120, ${impact.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // --- LAYER 4: Glass Surface Water Beads ---
      glassDrops.forEach((drop) => {
        drop.wobblePhase += 0.02;
        drop.y += drop.speedY;
        drop.x += Math.sin(drop.wobblePhase) * 0.15;

        if (drop.y > height + 10) {
          drop.y = -10;
          drop.x = Math.random() * width;
        }

        // Main Water Bead
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(228, 233, 223, 0.45)';
        ctx.fill();

        // Inner Specular Glint
        ctx.beginPath();
        ctx.arc(drop.x - drop.radius * 0.3, drop.y - drop.radius * 0.3, drop.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[15] overflow-hidden">
      {/* 60fps Lightweight Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block mix-blend-screen opacity-70"
      />

      {/* Soothing Volumetric Atmospheric Haze */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(134, 169, 120, 0.15) 0%, transparent 75%)',
        }}
      />
    </div>
  );
}
