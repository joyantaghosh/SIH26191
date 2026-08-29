import React from 'react';
import TerrainBackground from './TerrainBackground';
import RainScreenEffect from './RainScreenEffect';

export default function GlobalBackground() {
  return (
    <>
      {/* Interactive Cartographic Heatmap & Contour Background */}
      <TerrainBackground />
      {/* Volumetric Rain & Glass Refraction Overlay */}
      <RainScreenEffect />
    </>
  );
}
