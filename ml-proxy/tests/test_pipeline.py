import json
import unittest
import sys
from pathlib import Path

# Add scripts directory to sys.path
SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

from generator.validator import extract_json, validate_zone_data, ValidationError
from generator.bson_serializer import transform_to_bson_js
from capacity.evaluator import calculate_capacity_metrics
from capacity.bson_serializer import transform_to_capacity_bson_js, generate_assessment_id
from relocation.evaluator import calculate_priority_score
from relocation.client import generate_relocation_data
from relocation.bson_serializer import transform_to_relocation_bson_js
from route.evaluator import calculate_route_metrics
from route.client import generate_route_data
from route.bson_serializer import transform_to_route_bson_js
from export_frontend_data import (
    parse_risk_zone_file,
    parse_capacity_file,
    parse_relocation_file,
    parse_route_file,
)


class TestGenerator(unittest.TestCase):
    def test_extract_json_markdown(self):
        raw = "```json\n{\"test\": 123}\n```"
        data = extract_json(raw)
        self.assertEqual(data, {"test": 123})

    def test_extract_json_invalid(self):
        with self.assertRaises(ValidationError):
            extract_json("no json here")

    def test_validate_zone_data_valid(self):
        sample = {
            "name": "Test Zone",
            "region": "Wayanad, Kerala, India",
            "description": "Test description of landslide area.",
            "hazardTypes": ["landslide", "flood"],
            "riskLevel": "critical",
            "vulnerabilityScore": "0.85",
            "severityIndex": "8.5",
            "metrics": {
                "severity": 8.5,
                "density": 350.0,
                "soilRisk": 0.9,
            },
            "population": "50000",
            "households": "12000",
            "distanceToHazardKm": "1.5",
            "center": {"longitude": "76.13", "latitude": "11.60"},
            "radiusMeters": "15000",
        }
        validated = validate_zone_data(sample)
        self.assertEqual(validated["population"], 50000)
        self.assertEqual(validated["vulnerabilityScore"], 0.85)

    def test_validate_zone_data_missing_field(self):
        sample = {"name": "Incomplete"}
        with self.assertRaises(ValidationError):
            validate_zone_data(sample)

    def test_transform_to_bson_js(self):
        sample = {
            "name": "Test Zone",
            "region": "Wayanad, Kerala, India",
            "description": "Test description.",
            "hazardTypes": ["landslide"],
            "riskLevel": "critical",
            "vulnerabilityScore": 0.85,
            "severityIndex": 8.5,
            "metrics": {"severity": 8.5, "density": 350.0, "soilRisk": 0.9},
            "population": 50000,
            "households": 12000,
            "distanceToHazardKm": 1.5,
            "center": {"longitude": 76.13, "latitude": 11.60},
            "radiusMeters": 15000,
        }
        js_code = transform_to_bson_js(sample)
        self.assertIn("db.riskzones.insertOne({", js_code)
        self.assertIn("NumberInt('50000')", js_code)
        self.assertIn("Double('8.5')", js_code)


class TestCapacity(unittest.TestCase):
    def test_calculate_capacity_metrics_normal(self):
        inp = {
            "population": 10000,
            "landHectares": 5000,
            "waterSupplyLitersDay": 2000000,
            "housingUnits": 5000,
            "medicalBeds": 1000,
        }
        res = calculate_capacity_metrics(inp)
        self.assertEqual(res["stressLevel"], "NORMAL")
        self.assertGreater(res["availableCapacity"], 0)

    def test_calculate_capacity_metrics_critical(self):
        inp = {
            "population": 50000,
            "landHectares": 2000,
            "waterSupplyLitersDay": 1000000,
            "housingUnits": 5000,
            "medicalBeds": 200,
        }
        res = calculate_capacity_metrics(inp)
        self.assertIn(res["stressLevel"], ["HIGH", "CRITICAL"])

    def test_transform_to_capacity_bson_js(self):
        sample = {
            "region": "Wayanad, Kerala, India",
            "sectorName": "Wayanad Safe Sector",
            "inputParameters": {
                "population": 10000,
                "landHectares": 5000,
                "waterSupplyLitersDay": 2000000,
                "housingUnits": 5000,
                "medicalBeds": 1000,
            },
            "calculatedMetrics": {
                "maxSafeCapacity": 24000,
                "availableCapacity": 14000,
                "populationSaturationPercent": 42,
                "waterUtilizationPercent": 60,
                "housingUtilizationPercent": 80,
                "healthUtilizationPercent": 50,
                "stressLevel": "NORMAL",
            },
            "recommendations": ["Expand shelter reserves."],
        }
        js_code = transform_to_capacity_bson_js(sample)
        self.assertIn("db.carryingcapacity.insertOne({", js_code)
        self.assertIn("NumberInt('10000')", js_code)


class TestRelocation(unittest.TestCase):
    def test_calculate_priority_score(self):
        score, tier = calculate_priority_score(9.5, 0.95, 50000, 10000)
        self.assertGreaterEqual(score, 80.0)
        self.assertEqual(tier, "CRITICAL_URGENT")

        low_score, low_tier = calculate_priority_score(2.0, 0.2, 5000, 100)
        self.assertLess(low_score, 45.0)
        self.assertEqual(low_tier, "MONITORING")

    def test_generate_relocation_data(self):
        rel = generate_relocation_data("Wayanad, Kerala, India")
        self.assertIn("relocationId", rel)
        self.assertIn("priorityScore", rel)
        self.assertIn("priorityTier", rel)

    def test_transform_to_relocation_bson_js(self):
        rel = generate_relocation_data("Wayanad, Kerala, India")
        js_code = transform_to_relocation_bson_js(rel)
        self.assertIn("db.relocationpriorities.insertOne({", js_code)


class TestRoute(unittest.TestCase):
    def test_calculate_route_metrics(self):
        mins, score, status = calculate_route_metrics(15.0, 3.0)
        self.assertGreater(score, 7.5)
        self.assertEqual(status, "ACTIVE_SAFE")

        mins_haz, score_haz, status_haz = calculate_route_metrics(30.0, 9.5)
        self.assertLess(score_haz, 7.0)

    def test_generate_route_data(self):
        rt = generate_route_data("Wayanad, Kerala, India")
        self.assertIn("routeId", rt)
        self.assertIn("originCoordinates", rt)
        self.assertIn("destinationCoordinates", rt)
        self.assertIn("waypoints", rt)

    def test_transform_to_route_bson_js(self):
        rt = generate_route_data("Wayanad, Kerala, India")
        js_code = transform_to_route_bson_js(rt)
        self.assertIn("db.evacuationroutes.insertOne({", js_code)


class TestProjectIntegrity(unittest.TestCase):
    def test_exported_json_files(self):
        data_dir = Path(__file__).resolve().parent.parent / "outputs" / "data"
        expected_files = [
            "riskZones.json",
            "carryingCapacity.json",
            "relocationPriorities.json",
            "evacuationRoutes.json",
        ]
        for ef in expected_files:
            p = data_dir / ef
            self.assertTrue(p.exists(), f"File missing: {p}")
            with open(p, "r", encoding="utf-8") as f:
                items = json.load(f)
            self.assertEqual(len(items), 50, f"Expected 50 items in {ef}, got {len(items)}")

    def test_ml_proxy_server_data_loader(self):
        root = Path(__file__).resolve().parent.parent
        sys.path.insert(0, str(root))
        from ml_proxy_server import load_dataset
        zones = load_dataset("riskZones.json")
        self.assertEqual(len(zones), 50)
        self.assertIn("zoneId", zones[0])


if __name__ == "__main__":
    unittest.main()

