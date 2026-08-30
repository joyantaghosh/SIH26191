import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '8.8.8.4']);
} catch (_) {}

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import { connectDB, disconnectDB } from '../config/db.js';
import { RiskZone } from '../features/riskZones/riskZone.model.js';

const zones = [
  {
    zoneId: 'OKH-01',
    name: 'Oakhaven Valley Sector',
    region: 'Jakarta Selatan',
    description:
      'Evaluated based on active elevation terrain, slope stability, and mudslide telemetry vectors.',
    hazardType: 'flood_mudslide',
    riskLevel: 'critical',
    vulnerabilityScore: 87,
    severityIndex: 8,
    metrics: { severity: 92, density: 74, soilRisk: 68 },
    population: 1452,
    households: 361,
    distanceToHazardKm: 0.4,
    center: { type: 'Point', coordinates: [106.8, -6.2] },
    radiusMeters: 900,
  },
  {
    zoneId: 'PRC-02',
    name: 'Pine Ridge Coastal Ridge',
    region: 'Jakarta Utara',
    hazardType: 'coastal_erosion',
    riskLevel: 'warning',
    vulnerabilityScore: 61,
    severityIndex: 5,
    metrics: { severity: 58, density: 63, soilRisk: 44 },
    population: 2310,
    households: 590,
    distanceToHazardKm: 1.8,
    center: { type: 'Point', coordinates: [106.845, -6.128] },
    radiusMeters: 1200,
  },
  {
    zoneId: 'RRE-03',
    name: 'Riverbend Refuge East',
    region: 'Jakarta Timur',
    hazardType: 'flood',
    riskLevel: 'safe',
    vulnerabilityScore: 22,
    severityIndex: 2,
    metrics: { severity: 18, density: 35, soilRisk: 20 },
    population: 880,
    households: 214,
    distanceToHazardKm: 5.6,
    center: { type: 'Point', coordinates: [106.9, -6.23] },
    radiusMeters: 1000,
  },
];

const run = async () => {
  await connectDB();
  await RiskZone.deleteMany({});
  const created = await RiskZone.insertMany(zones);
  console.log(`[seed] inserted ${created.length} risk zones`);
  await disconnectDB();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

