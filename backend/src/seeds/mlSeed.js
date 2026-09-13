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
import { syncAllMLData, getMLStatus } from '../features/mlProxy/mlProxy.service.js';

const run = async () => {
  console.log('═'.repeat(60));
  console.log('📦 ML-Proxy Data Ingestion & Seeder for SIH26191 Database');
  console.log('═'.repeat(60));

  await connectDB();

  console.log('\n[1/2] Synchronizing ML datasets (Risk Zones, Capacity, Relocation, Evacuation)...');
  const syncResult = await syncAllMLData();

  console.log('\n[2/2] Verification of Database Collections:');
  const status = await getMLStatus();
  console.table(status.databaseCounts);

  console.log('\nSync Result Details:');
  console.log(`  • Risk Zones Ingested         : ${syncResult.riskZones}`);
  console.log(`  • Carrying Capacity Sectors    : ${syncResult.carryingCapacity}`);
  console.log(`  • Relocation Priority Matrix  : ${syncResult.relocationPriorities}`);
  console.log(`  • Evacuation Locations Seeded : ${syncResult.evacuationLocations}`);
  console.log(`  • Settlements Mapped          : ${syncResult.settlements}`);

  console.log('\nData Sources:');
  for (const [k, v] of Object.entries(syncResult.sources)) {
    console.log(`  • ${k}: ${v}`);
  }

  console.log('\n✅ All ML-proxy datasets successfully ingested into MongoDB!');
  await disconnectDB();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});
