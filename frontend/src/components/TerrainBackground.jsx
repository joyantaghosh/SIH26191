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

    // Heatmap node sources (green cartographic spectrum)
    const heatNodes = [
      { xRatio: 0.20, yRatio: 0.25, radius: 360, color: [122, 154, 110], speed: 0.7, phase: 0 },
      { xRatio: 0.78, yRatio: 0.20, radius: 400, color: [134, 169, 120], speed: 0.5, phase: 1.5 },
      { xRatio: 0.50, yRatio: 0.55, radius: 440, color: [67, 86, 62], speed: 0.6, phase: 2.8 },
      { xRatio: 0.82, yRatio: 0.78, radius: 340, color: [111, 145, 100], speed: 0.8, phase: 4.1 },
      { xRatio: 0.18, yRatio: 0.82, radius: 380, color: [45, 65, 40], speed: 0.6, phase: 5.3 },
    ];

    let startTime = performance.now();

    const render = () => {
      const now = performance.now();
      const time = (now - startTime) * 0.0012;

      // Smooth lerp mouse & parallax offsets
      mouse.currX += (mouse.x - mouse.currX) * 0.08;
      mouse.currY += (mouse.y - mouse.currY) * 0.08;
      mouse.currOffsetX += (mouse.targetOffsetX - mouse.currOffsetX) * 0.05;
      mouse.currOffsetY += (mouse.targetOffsetY - mouse.currOffsetY) * 0.05;

      // Fade active state if inactive for 3s
      if (now - mouse.lastMove > 3000) {
        mouse.active = false;
      }

      // Base dark background `#080C08`
      ctx.fillStyle = '#080C08';
      ctx.fillRect(0, 0, width, height);

      // Save context for Parallax translation
      ctx.save();
      // Background layer shifts slowly (parallax factor 0.3x)
      const bgParallaxX = mouse.currOffsetX * 35;
      const bgParallaxY = mouse.currOffsetY * 25 - scrollY * 0.25;
      ctx.translate(bgParallaxX, bgParallaxY);

      // Render Swaying Heatmap Gradient Blobs
      heatNodes.forEach((node, idx) => {
        const swayX = Math.sin(time * node.speed + node.phase) * 90 + Math.cos(time * 0.4 + idx) * 40;
        const swayY = Math.cos(time * node.speed * 0.85 + node.phase) * 70 + Math.sin(time * 0.5 + idx) * 30;

        let nx = node.xRatio * width + swayX;
        let ny = node.yRatio * height + swayY;

        // Dynamic mouse distortion field
        const dx = nx - (mouse.currX - bgParallaxX);
        const dy = ny - (mouse.currY - bgParallaxY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 520;

        if (dist < maxDist && dist > 0) {
          const factor = Math.pow(1 - dist / maxDist, 2) * 170;
          nx += (dx / dist) * factor;
          ny += (dy / dist) * factor;
        }

        const currentRadius = node.radius + Math.sin(time * 2.2 + node.phase) * 45;
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, currentRadius);
        const [r, g, b] = node.color;

        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.38)`);
        grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.20)`);
        grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.06)`);
        grad.addColorStop(1, 'rgba(8, 12, 8, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Interactive Mouse Heat Flare
      const mouseDistFromCenter = Math.sqrt(
        Math.pow(mouse.currX - width / 2, 2) + Math.pow(mouse.currY - height / 2, 2)
      );
      const mouseIntensity = mouse.active ? 1 : Math.max(0.2, 1 - mouseDistFromCenter / (width * 0.6));

      const mouseGlowRad = (290 + Math.sin(time * 4) * 30) * mouseIntensity;
      if (mouseGlowRad > 0) {
        const mxCanvas = mouse.currX - bgParallaxX;
        const myCanvas = mouse.currY - bgParallaxY;

        const mouseGrad = ctx.createRadialGradient(
          mxCanvas,
          myCanvas,
          0,
          mxCanvas,
          myCanvas,
          mouseGlowRad
        );
        mouseGrad.addColorStop(0, `rgba(134, 169, 120, ${0.55 * mouseIntensity})`);
        mouseGrad.addColorStop(0.25, `rgba(122, 154, 110, ${0.34 * mouseIntensity})`);
        mouseGrad.addColorStop(0.55, `rgba(67, 86, 62, ${0.16 * mouseIntensity})`);
        mouseGrad.addColorStop(1, 'rgba(8, 12, 8, 0)');

        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mxCanvas, myCanvas, mouseGlowRad, 0, Math.PI * 2);
        ctx.fill();

        // Hotspot core
        const coreGrad = ctx.createRadialGradient(
          mxCanvas,
          myCanvas,
          0,
          mxCanvas,
          myCanvas,
          75 * mouseIntensity
        );
        coreGrad.addColorStop(0, `rgba(193, 185, 157, ${0.70 * mouseIntensity})`);
        coreGrad.addColorStop(0.5, `rgba(134, 169, 120, ${0.38 * mouseIntensity})`);
        coreGrad.addColorStop(1, 'rgba(122, 154, 110, 0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(mxCanvas, myCanvas, 75 * mouseIntensity, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Distorted Topographic Contour Lines across Heatmap
      const lineCount = 13;
      ctx.lineWidth = 1;

      for (let i = 0; i < lineCount; i++) {
        const baseY = (height / (lineCount + 1)) * (i + 1);
        ctx.beginPath();

        const alpha = 0.14 + Math.sin(time + i) * 0.05;
        ctx.strokeStyle = i % 3 === 0 ? `rgba(142, 174, 128, ${alpha + 0.16})` : `rgba(122, 154, 110, ${alpha})`;

        for (let x = -50; x <= width + 50; x += 25) {
          let wave = Math.sin(x * 0.003 + time * 1.5 + i * 0.6) * 30 + Math.cos(x * 0.007 - time) * 18;

          const mdx = x - (mouse.currX - bgParallaxX);
          const mdy = baseY - (mouse.currY - bgParallaxY);
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < 380) {
            const push = Math.cos((mdist / 380) * Math.PI) * 50 * mouseIntensity;
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#080C08]">
      {/* HTML5 Dynamic Interactive Canvas with Depth Parallax */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block blur-[0.5px]" />

      {/* Atmospheric Depth Blur Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 20%, rgba(6, 9, 6, 0.72) 90%), linear-gradient(180deg, rgba(8, 12, 8, 0.45) 0%, transparent 35%, rgba(8, 12, 8, 0.88) 100%)',
        }}
      />
    </div>
  );
}
