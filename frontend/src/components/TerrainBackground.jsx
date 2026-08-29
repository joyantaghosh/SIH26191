import React, { useEffect, useRef } from 'react';

export default function TerrainBackground() {
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

    // Mouse & Scroll Parallax Tracking
    const mouse = {
      x: width / 2,
      y: height / 2,
      currX: width / 2,
      currY: height / 2,
      targetOffsetX: 0,
      targetOffsetY: 0,
      currOffsetX: 0,
      currOffsetY: 0,
      active: false,
      lastMove: 0,
    };

    let scrollY = window.scrollY;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.targetOffsetX = (e.clientX - width / 2) / (width / 2);
      mouse.targetOffsetY = (e.clientY - height / 2) / (height / 2);
      mouse.active = true;
      mouse.lastMove = performance.now();
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mouseleave', handleMouseLeave);

    // 4x Amplified Heatmap Blob Nodes (vibrant green/amber spectrum)
    const heatNodes = [
      { xRatio: 0.20, yRatio: 0.25, radius: 520, color: [134, 215, 110], speed: 1.2, phase: 0 },
      { xRatio: 0.78, yRatio: 0.20, radius: 580, color: [160, 230, 130], speed: 1.0, phase: 1.5 },
      { xRatio: 0.50, yRatio: 0.55, radius: 640, color: [90, 160, 80], speed: 1.1, phase: 2.8 },
      { xRatio: 0.82, yRatio: 0.78, radius: 480, color: [140, 210, 120], speed: 1.3, phase: 4.1 },
      { xRatio: 0.18, yRatio: 0.82, radius: 540, color: [75, 140, 65], speed: 1.0, phase: 5.3 },
      { xRatio: 0.60, yRatio: 0.35, radius: 450, color: [220, 200, 120], speed: 1.4, phase: 1.1 }, // Gold Core Blob
    ];

    let startTime = performance.now();

    const render = () => {
      const now = performance.now();
      const time = (now - startTime) * 0.0018;

      // Smooth lerp mouse & parallax offsets
      mouse.currX += (mouse.x - mouse.currX) * 0.09;
      mouse.currY += (mouse.y - mouse.currY) * 0.09;
      mouse.currOffsetX += (mouse.targetOffsetX - mouse.currOffsetX) * 0.05;
      mouse.currOffsetY += (mouse.targetOffsetY - mouse.currOffsetY) * 0.05;

      if (now - mouse.lastMove > 3000) {
        mouse.active = false;
      }

      // Base dark background
      ctx.fillStyle = '#060906';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      const bgParallaxX = mouse.currOffsetX * 45;
      const bgParallaxY = mouse.currOffsetY * 30 - scrollY * 0.25;
      ctx.translate(bgParallaxX, bgParallaxY);

      // Render 4x Intense Swaying & Distorting Heatmap Blobs
      heatNodes.forEach((node, idx) => {
        // 4x amplified sway displacement
        const swayX = Math.sin(time * node.speed + node.phase) * 160 + Math.cos(time * 0.8 + idx) * 80;
        const swayY = Math.cos(time * node.speed * 0.85 + node.phase) * 140 + Math.sin(time * 0.9 + idx) * 70;

        let nx = node.xRatio * width + swayX;
        let ny = node.yRatio * height + swayY;

        // 4x amplified mouse distortion field (factor = 680)
        const dx = nx - (mouse.currX - bgParallaxX);
        const dy = ny - (mouse.currY - bgParallaxY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 650;

        if (dist < maxDist && dist > 0) {
          const factor = Math.pow(1 - dist / maxDist, 2) * 680;
          nx += (dx / dist) * factor;
          ny += (dy / dist) * factor;
        }

        // 4x pulsating radius expansion
        const currentRadius = node.radius + Math.sin(time * 3.5 + node.phase) * 95;
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, currentRadius);
        const [r, g, b] = node.color;

        // 4x opacity intensity boost
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.72)`);
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.45)`);
        grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 0.18)`);
        grad.addColorStop(1, 'rgba(6, 9, 6, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4x Amplified Interactive Mouse Heat Flare / Core Bubble
      const mouseDistFromCenter = Math.sqrt(
        Math.pow(mouse.currX - width / 2, 2) + Math.pow(mouse.currY - height / 2, 2)
      );
      const mouseIntensity = mouse.active ? 1 : Math.max(0.35, 1 - mouseDistFromCenter / (width * 0.6));

      // 4x enlarged mouse flare radius (up to 550px)
      const mouseGlowRad = (480 + Math.sin(time * 5) * 70) * mouseIntensity;
      if (mouseGlowRad > 0) {
        const mxCanvas = mouse.currX - bgParallaxX;
        const myCanvas = mouse.currY - bgParallaxY;

        // Outer radiant aura
        const mouseGrad = ctx.createRadialGradient(
          mxCanvas,
          myCanvas,
          0,
          mxCanvas,
          myCanvas,
          mouseGlowRad
        );
        mouseGrad.addColorStop(0, `rgba(160, 230, 130, ${0.85 * mouseIntensity})`);
        mouseGrad.addColorStop(0.25, `rgba(134, 195, 110, ${0.60 * mouseIntensity})`);
        mouseGrad.addColorStop(0.55, `rgba(80, 140, 70, ${0.32 * mouseIntensity})`);
        mouseGrad.addColorStop(1, 'rgba(6, 9, 6, 0)');

        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mxCanvas, myCanvas, mouseGlowRad, 0, Math.PI * 2);
        ctx.fill();

        // 4x Intense Hotspot Core (180px radius)
        const coreGrad = ctx.createRadialGradient(
          mxCanvas,
          myCanvas,
          0,
          mxCanvas,
          myCanvas,
          160 * mouseIntensity
        );
        coreGrad.addColorStop(0, `rgba(245, 235, 170, ${0.95 * mouseIntensity})`);
        coreGrad.addColorStop(0.4, `rgba(160, 230, 130, ${0.75 * mouseIntensity})`);
        coreGrad.addColorStop(1, 'rgba(134, 195, 110, 0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(mxCanvas, myCanvas, 160 * mouseIntensity, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4x Reactive Distorted Topographic Contour Lines
      const lineCount = 14;
      ctx.lineWidth = 1.2;

      for (let i = 0; i < lineCount; i++) {
        const baseY = (height / (lineCount + 1)) * (i + 1);
        ctx.beginPath();

        const alpha = 0.22 + Math.sin(time * 1.5 + i) * 0.08;
        ctx.strokeStyle = i % 2 === 0 ? `rgba(170, 225, 140, ${alpha + 0.2})` : `rgba(134, 195, 110, ${alpha})`;

        for (let x = -50; x <= width + 50; x += 20) {
          let wave = Math.sin(x * 0.004 + time * 2.2 + i * 0.6) * 45 + Math.cos(x * 0.008 - time * 1.4) * 25;

          const mdx = x - (mouse.currX - bgParallaxX);
          const mdy = baseY - (mouse.currY - bgParallaxY);
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < 450) {
            const push = Math.cos((mdist / 450) * Math.PI) * 110 * mouseIntensity;
            wave += mdy > 0 ? push : -push;
          }

          const y = baseY + wave;
          if (x === -50) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060906]">
      {/* HTML5 Dynamic Interactive Heatmap Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Atmospheric Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(6, 9, 6, 0.65) 95%), linear-gradient(180deg, rgba(6, 9, 6, 0.3) 0%, transparent 40%, rgba(6, 9, 6, 0.75) 100%)',
        }}
      />
    </div>
  );
}
