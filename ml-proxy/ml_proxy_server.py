#!/usr/bin/env python3
"""
ml_proxy_server.py — Lightweight HTTP microservice for ML datasets.

Provides REST endpoints for:
  - GET /health
  - GET /api/ml/risk-zones
  - GET /api/ml/capacity
  - GET /api/ml/relocation
  - GET /api/ml/routes
  - GET /api/ml/all
  - POST /api/ml/sync

Usage:
  python ml_proxy_server.py [--port 8000]
"""

import json
import os
import sys
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


# Resolve data directory
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "outputs" / "data"

PORT = int(os.environ.get("ML_PROXY_PORT", 8000))


def load_dataset(filename: str):
    path = DATA_DIR / filename
    if not path.exists():
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[ml-proxy] Error loading {filename}: {e}", file=sys.stderr)
        return []


class MLProxyRequestHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def _send_json(self, status_code: int, data: dict | list):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        url_path = self.path.split("?")[0].rstrip("/")

        if url_path in ("", "/health"):
            risk_zones = load_dataset("riskZones.json")
            capacity = load_dataset("carryingCapacity.json")
            relocation = load_dataset("relocationPriorities.json")
            routes = load_dataset("evacuationRoutes.json")
            self._send_json(200, {
                "status": "ok",
                "service": "ml-proxy-service",
                "counts": {
                    "riskZones": len(risk_zones),
                    "carryingCapacity": len(capacity),
                    "relocationPriorities": len(relocation),
                    "evacuationRoutes": len(routes),
                }
            })
        elif url_path == "/api/ml/risk-zones":
            self._send_json(200, load_dataset("riskZones.json"))
        elif url_path == "/api/ml/capacity":
            self._send_json(200, load_dataset("carryingCapacity.json"))
        elif url_path == "/api/ml/relocation":
            self._send_json(200, load_dataset("relocationPriorities.json"))
        elif url_path == "/api/ml/routes":
            self._send_json(200, load_dataset("evacuationRoutes.json"))
        elif url_path == "/api/ml/all":
            self._send_json(200, {
                "riskZones": load_dataset("riskZones.json"),
                "carryingCapacity": load_dataset("carryingCapacity.json"),
                "relocationPriorities": load_dataset("relocationPriorities.json"),
                "evacuationRoutes": load_dataset("evacuationRoutes.json"),
            })
        else:
            self._send_json(404, {"error": "Not Found", "path": self.path})

    def do_POST(self):
        url_path = self.path.split("?")[0].rstrip("/")
        if url_path == "/api/ml/sync":
            risk_zones = load_dataset("riskZones.json")
            capacity = load_dataset("carryingCapacity.json")
            relocation = load_dataset("relocationPriorities.json")
            routes = load_dataset("evacuationRoutes.json")
            self._send_json(200, {
                "message": "Datasets synchronized successfully",
                "counts": {
                    "riskZones": len(risk_zones),
                    "carryingCapacity": len(capacity),
                    "relocationPriorities": len(relocation),
                    "evacuationRoutes": len(routes),
                }
            })
        else:
            self._send_json(404, {"error": "Endpoint not found"})

    def log_message(self, format, *args):
        # Clean logging format
        print(f"[ml-proxy-server] {self.address_string()} - {format % args}")


def run_server(port: int = PORT):
    server_address = ("", port)
    httpd = HTTPServer(server_address, MLProxyRequestHandler)
    print(f"[ml-proxy-server] Microservice running at http://localhost:{port}")
    print(f"  • Endpoints: /health, /api/ml/risk-zones, /api/ml/capacity, /api/ml/relocation, /api/ml/routes, /api/ml/all")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[ml-proxy-server] Stopped.")
        httpd.server_close()



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run ML Proxy microservice server.")
    parser.add_argument("--port", type=int, default=PORT, help="Port to listen on (default: 8000)")
    args = parser.parse_args()
    run_server(args.port)
