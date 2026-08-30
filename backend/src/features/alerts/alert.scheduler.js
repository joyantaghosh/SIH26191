import cron from 'node-cron';
import { executeAutomatedWeatherScan } from './alert.service.js';
import { RiskZone } from '../riskZones/riskZone.model.js';

let scheduledTask = null;

/**
 * Executes a scheduled weather & hazard scan across all monitored sectors.
 */
export const runScheduledWeatherScan = async () => {
  console.log(`[WeatherScheduler] ⏱️ Running automated hazard telemetry scan at ${new Date().toISOString()}...`);

  try {
    // 1. Fetch distinct active monitoring locations from RiskZone database
    const activeZones = await RiskZone.find({ isActive: true }).select('center name zoneId').lean();

    // Default primary sector if database is empty
    const locationsToScan =
      activeZones.length > 0
        ? activeZones.map((z) => ({
            name: z.name,
            lat: z.center?.coordinates?.[1] ?? -6.2,
            lng: z.center?.coordinates?.[0] ?? 106.8,
          }))
        : [{ name: 'Default Capital Sector', lat: -6.2, lng: 106.8 }];

    // Deduplicate nearby coordinates (within ~10km) to optimize API calls
    const uniqueLocations = [];
    for (const loc of locationsToScan) {
      const isDuplicate = uniqueLocations.some(
        (u) => Math.abs(u.lat - loc.lat) < 0.08 && Math.abs(u.lng - loc.lng) < 0.08
      );
      if (!isDuplicate) uniqueLocations.push(loc);
    }

    console.log(`[WeatherScheduler] Scanning ${uniqueLocations.length} regional sectors...`);

    // 2. Scan each monitored coordinate
    for (const location of uniqueLocations) {
      try {
        const result = await executeAutomatedWeatherScan(location.lat, location.lng, {
          scanRadiusKm: 15,
        });

        if (result.triggered) {
          console.log(
            `[WeatherScheduler] 🚨 HAZARD THRESHOLD BREACHED in ${location.name}! Score: ${result.hazardConfidenceScore}/100 [${result.severity}]. Affected zones: ${result.affectedZonesCount}. Alert ID: ${result.alertRecord?.alertId}`
          );
        } else {
          console.log(
            `[WeatherScheduler] ✅ ${location.name}: Score ${result.hazardConfidenceScore}/100 (Below threshold ${result.threshold}). Status nominal.`
          );
        }
      } catch (locErr) {
        console.error(`[WeatherScheduler] Error scanning ${location.name}:`, locErr.message);
      }
    }
  } catch (error) {
    console.error('[WeatherScheduler] Automated scan execution failed:', error.message);
  }
};

/**
 * Initializes and starts the automated weather alert cron schedule.
 * Cron expression default: Every 15 minutes ("* /15 * * * *")
 */
export const startWeatherAlertScheduler = () => {
  const cronExpression = process.env.WEATHER_ALERT_CRON_SCHEDULE || '*/15 * * * *';
  const isEnabled = process.env.WEATHER_ALERT_CRON_ENABLED !== 'false';

  if (!isEnabled) {
    console.log('[WeatherScheduler] Automated weather cron is disabled via WEATHER_ALERT_CRON_ENABLED=false');
    return null;
  }

  if (!cron.validate(cronExpression)) {
    console.error(`[WeatherScheduler] Invalid cron expression: "${cronExpression}". Defaulting to "*/15 * * * *"`);
  }

  const validSchedule = cron.validate(cronExpression) ? cronExpression : '*/15 * * * *';

  console.log(`[WeatherScheduler] 🛰️ Initializing automated weather alert scheduler [cron: "${validSchedule}"]`);

  scheduledTask = cron.schedule(validSchedule, async () => {
    await runScheduledWeatherScan();
  });

  return scheduledTask;
};

/**
 * Stops the scheduled cron job.
 */
export const stopWeatherAlertScheduler = () => {
  if (scheduledTask) {
    scheduledTask.stop();
    console.log('[WeatherScheduler] Weather alert scheduler stopped');
    scheduledTask = null;
  }
};

export default {
  startWeatherAlertScheduler,
  stopWeatherAlertScheduler,
  runScheduledWeatherScan,
};
