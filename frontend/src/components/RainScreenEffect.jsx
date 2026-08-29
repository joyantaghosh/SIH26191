import React, { useEffect, useRef, useState } from 'react';

export default function RainScreenEffect() {
  const canvasRef = useRef(null);
  const [splashRipples, setSplashRipples] = useState([]);

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

    // Mouse & Wind physics tracking
    const mouse = {
      x: width / 2,
      y: height / 2,
      velX: 0,
      lastX: width / 2,
      targetWind: 0.12,
      currWind: 0.12,
    };

    const handleMouseMove = (e) => {
      mouse.velX = (e.clientX - mouse.lastX) * 0.05;
      mouse.lastX = e.clientX;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.targetWind = 0.12 + (e.clientX - width / 2) / width * 0.4 + mouse.velX;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Manual splash on click
    const handleMouseClick = (e) => {
      triggerCameraImpact(e.clientX, e.clientY, true);
    };

    window.addEventListener('click', handleMouseClick);

    // 1. Distant Fine Rain (Depth Layer 1)
    const distantRainCount = 220;
    const distantRain = Array.from({ length: distantRainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 12 + Math.random() * 18,
      speed: 16 + Math.random() * 12,
      opacity: 0.12 + Math.random() * 0.25,
      thickness: 0.7 + Math.random() * 0.6,
    }));

    // 2. Mid-Ground Rain Streaks with Motion Blur (Depth Layer 2)
    const midRainCount = 90;
    const midRain = Array.from({ length: midRainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 35 + Math.random() * 45,
      speed: 28 + Math.random() * 16,
      opacity: 0.3 + Math.random() * 0.35,
      thickness: 1.2 + Math.random() * 1.0,
    }));

    // 3. Glass Screen Water Beads & Dripping Drops (Foreground Layer 3)
    const glassDropCount = 35;
    const glassDrops = Array.from({ length: glassDropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 2.5 + Math.random() * 4.5,
      speedY: 0.2 + Math.random() * 0.8,
      trail: [],
      maxTrailLength: 12 + Math.floor(Math.random() * 14),
      wobblePhase: Math.random() * Math.PI * 2,
    }));

    // 4. Direct Camera Lens Impact Ripples & Splashes
    let cameraImpacts = [];

    function triggerCameraImpact(impactX, impactY, isBig = false) {
      cameraImpacts.push({
        x: impactX || Math.random() * width,
        y: impactY || Math.random() * height,
        radius: 2,
        maxRadius: isBig ? 45 + Math.random() * 30 : 18 + Math.random() * 22,
        opacity: 0.85,
        particles: Array.from({ length: isBig ? 12 : 6 }, () => ({
          dx: (Math.random() - 0.5) * (isBig ? 8 : 4),
          dy: (Math.random() - 0.5) * (isBig ? 8 : 4),
          x: impactX,
          y: impactY,
          size: 1 + Math.random() * 2.5,
          life: 1.0,
        })),
      });
    }

    // Periodically spawn camera lens impacts
    let lastCameraImpact = performance.now();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp wind angle
      mouse.currWind += (mouse.targetWind - mouse.currWind) * 0.05;
      const windAngle = mouse.currWind;

      // --- LAYER 1: Distant Fine Rain (High Depth Blur & Low Opacity) ---
      ctx.save();
      ctx.lineWidth = 0.8;
      distantRain.forEach((drop) => {
        drop.x += windAngle * (drop.speed * 0.4);
        drop.y += drop.speed;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }

        if (drop.x > width) drop.x = 0;
        if (drop.x < 0) drop.x = width;

        const grad = ctx.createLinearGradient(drop.x, drop.y, drop.x + windAngle * drop.length, drop.y + drop.length);
        grad.addColorStop(0, `rgba(228, 233, 223, 0)`);
        grad.addColorStop(0.5, `rgba(180, 205, 170, ${drop.opacity})`);
        grad.addColorStop(1, `rgba(228, 233, 223, ${drop.opacity * 1.2})`);

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + windAngle * drop.length, drop.y + drop.length);
        ctx.stroke();
      });
      ctx.restore();

      // --- LAYER 2: Mid-ground Streaks with Motion Blur & Specular Highlight ---
      ctx.save();
      midRain.forEach((drop) => {
        drop.x += windAngle * drop.speed;
        drop.y += drop.speed;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
          // 8% chance to trigger a camera lens impact when rain hits bottom
          if (Math.random() < 0.08) {
            triggerCameraImpact(drop.x, height * 0.85 + Math.random() * height * 0.15);
          }
        }

        if (drop.x > width) drop.x = 0;
        if (drop.x < 0) drop.x = width;

        const endX = drop.x + windAngle * drop.length;
        const endY = drop.y + drop.length;

        const grad = ctx.createLinearGradient(drop.x, drop.y, endX, endY);
        grad.addColorStop(0, 'rgba(228, 233, 223, 0)');
        grad.addColorStop(0.7, `rgba(134, 169, 120, ${drop.opacity})`);
        grad.addColorStop(1, `rgba(244, 243, 238, ${drop.opacity * 1.4})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = drop.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });
      ctx.restore();

      // --- LAYER 3: Direct Camera Lens Impact Ripples & Splashes ---
      const now = performance.now();
      if (now - lastCameraImpact > 1800 + Math.random() * 1200) {
        triggerCameraImpact(Math.random() * width, Math.random() * height);
        lastCameraImpact = now;
      }

      for (let i = cameraImpacts.length - 1; i >= 0; i--) {
        const impact = cameraImpacts[i];
        impact.radius += 1.4;
        impact.opacity -= 0.022;

        if (impact.opacity <= 0) {
          cameraImpacts.splice(i, 1);
          continue;
        }

        // Concentric Water Ripple on Screen Lens
        ctx.save();
        ctx.beginPath();
        ctx.arc(impact.x, impact.y, impact.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(228, 233, 223, ${impact.opacity * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(impact.x, impact.y, impact.radius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(134, 169, 120, ${impact.opacity * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Micro Splash Droplets Splattering Outward
        impact.particles.forEach((p) => {
          p.x += p.dx;
          p.y += p.dy;
          p.life -= 0.03;
          if (p.life > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(244, 243, 238, ${p.life * impact.opacity})`;
            ctx.fill();
          }
        });
        ctx.restore();
      }

      // --- LAYER 4: Glass Surface Water Beads & Dripping Drops ---
      ctx.save();
      glassDrops.forEach((drop) => {
        drop.wobblePhase += 0.04;
        const wobbleX = Math.sin(drop.wobblePhase) * 0.3;

        // Dripping physics (occasional acceleration burst)
        if (Math.random() < 0.03) {
          drop.speedY = 1.8 + Math.random() * 2.2;
        } else {
          drop.speedY += (0.3 - drop.speedY) * 0.08;
        }

        drop.y += drop.speedY;
        drop.x += wobbleX;

        // Record trailing condensation path
        drop.trail.push({ x: drop.x, y: drop.y, radius: drop.radius * 0.55 });
        if (drop.trail.length > drop.maxTrailLength) {
          drop.trail.shift();
        }

        if (drop.y > height + 20) {
          drop.y = -20;
          drop.x = Math.random() * width;
          drop.trail = [];
        }

        // Draw trail beads
        drop.trail.forEach((t, idx) => {
          const alpha = (idx / drop.trail.length) * 0.25;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius * (idx / drop.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(134, 169, 120, ${alpha})`;
          ctx.fill();
        });

        // Draw Main Glass Water Bead Refraction
        const dropGrad = ctx.createRadialGradient(
          drop.x - drop.radius * 0.3,
          drop.y - drop.radius * 0.3,
          drop.radius * 0.1,
          drop.x,
          drop.y,
          drop.radius
        );
        dropGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)'); // Top-left Specular Highlight
        dropGrad.addColorStop(0.3, 'rgba(180, 205, 170, 0.45)');
        dropGrad.addColorStop(0.7, 'rgba(67, 86, 62, 0.25)');
        dropGrad.addColorStop(1, 'rgba(8, 12, 8, 0.8)'); // Shadow Base

        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fillStyle = dropGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        ctx.fill();

        // Inner Specular Glint
        ctx.beginPath();
        ctx.arc(drop.x - drop.radius * 0.35, drop.y - drop.radius * 0.35, drop.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
      });
      ctx.restore();

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
      {/* HTML5 Rain Canvas Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{
          mixBlendMode: 'screen',
        }}
      />

      {/* Atmospheric Haze & Volumetric Lighting Refraction Sheet */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(134, 169, 120, 0.25) 0%, transparent 70%), linear-gradient(180deg, rgba(228, 233, 223, 0.05) 0%, transparent 40%, rgba(8, 12, 8, 0.3) 100%)',
          backdropFilter: 'blur(0.4px) contrast(105%)',
        }}
      />

      {/* Glass Condensation Lens Layer */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), radial-gradient(rgba(134, 169, 120, 0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px, 48px 48px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />
    </div>
  );
}
