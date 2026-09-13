import textwrap


def build_retrieval_prompt(region: str) -> str:
    """
    Constructs the Gemini prompt that asks for grounded geological +
    demographic data for *region*. The model is instructed to return
    a single JSON object so we can parse it deterministically.
    """
    return textwrap.dedent(f"""\
        You are a geospatial data analyst specialising in real-time disaster
        monitoring.  Using the latest available data from official geological
        surveys, hydrometeorological agencies, census records, and disaster
        management authorities, compile a comprehensive **multi-hazard**
        risk-zone profile for the region: **{region}**.

        **Priority guidance (follow strictly):**
        1. Search for **active disasters and alerts from the past 14 days**
           first — ongoing floods, flash floods, GLOF (glacial lake outburst
           floods), debris flows, active river-basin warnings, and
           hydrometeorological bulletins.
        2. The **most active / immediate hazard** (e.g., ongoing monsoon
           flooding, active debris flows) MUST appear as the **first element**
           (index 0) of the "hazardTypes" array.
        3. Secondary or baseline threats (e.g., seismic risk, seasonal
           landslide susceptibility) follow in descending order of current
           activity level.
        4. The "name" field MUST reference any **active event name** or
           **impacted river valley** when one exists (e.g.,
           "Kosi River Basin Active Flood Zone" rather than a generic label).
        5. The "description" MUST mention specific recent impacts, river
           names, or alert bulletins where applicable.

        Return ONLY a single valid JSON object (no markdown fences, no
        commentary) with exactly the following keys.  All values must be
        realistic and sourced from real-world data.

        {{
          "name":                "<human-readable zone name reflecting active events>",
          "region":              "{region}",
          "description":         "<2-3 sentences — lead with any active/recent disaster events, then baseline geological risks>",
          "hazardTypes":         ["<primary active hazard>", "<secondary hazard>", ...],
          "riskLevel":           "<one of: low, moderate, high, critical>",
          "vulnerabilityScore":  <float 0.0–1.0>,
          "severityIndex":       <float 0.0–10.0>,
          "metrics": {{
            "severity":  <float 0.0–10.0>,
            "density":   <float — population density per sq km>,
            "soilRisk":  <float 0.0–1.0>
          }},
          "population":          <integer — total population of the risk zone>,
          "households":          <integer — estimated number of households>,
          "distanceToHazardKm":  <float — distance in km from nearest known hazard source>,
          "center": {{
            "longitude": <float>,
            "latitude":  <float>
          }},
          "radiusMeters":        <integer — approximate risk-zone radius in metres>
        }}

        Allowed values for each entry in "hazardTypes":
          earthquake, landslide, flood, cyclone, tsunami, volcanic,
          flash_flood, glof, debris_flow

        Constraints you MUST follow strictly:
        • Seismic Standards (IS 1893): Seismic zones in India range strictly from Zone II to Zone V (Zone 2–5). NEVER reference 'Zone 6', 'Zone VI', or higher numbers under any circumstances.
        • Scale & Density Consistency: Population, household count, density, and radius must match the exact spatial boundary of the defined risk zone. If targeting an urban municipal center (e.g., Shimla city, Silchar municipal area), use municipal demographic figures rather than district-wide averages.
        • Hazard Relevance: Do NOT include 'tsunami' in 'hazardTypes' unless the region is strictly coastal AND an undersea earthquake alert is active. Never include 'tsunami' for inland monsoon, flash flood, GLOF, or landslide profiles.
        • hazardTypes must contain at least 1 and at most 5 entries.
        • hazardTypes[0] must be the currently most active/immediate threat.
        • population must be > 1000 and < 500_000_000.
        • households must be roughly population / 4  (± 30 %).
        • distanceToHazardKm must be > 0.0 for every zone (no zone is
          exactly at 0.0 km from hazard).
        • severityIndex and metrics.severity must be >= 5.0 when riskLevel
          is "high" or "critical".
        • Coordinates must fall within the geographic bounds of {region}.
    """)
