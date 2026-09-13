import textwrap


def build_capacity_prompt(region: str, zone_data: dict | None = None) -> str:
    """
    Constructs the Gemini prompt to generate real-world sector infrastructure inputs
    and recommendations for region *region*.
    """
    zone_context = ""
    if zone_data:
        zone_context = f"""
        Context from active risk zone profile:
        - Zone Name: {zone_data.get('name', 'N/A')}
        - Population: {zone_data.get('population', 'N/A')}
        - Active Hazards: {zone_data.get('hazardTypes', [])}
        - Risk Level: {zone_data.get('riskLevel', 'N/A')}
        - Description: {zone_data.get('description', '')}
        """

    return textwrap.dedent(f"""\
        You are a senior disaster management analyst and carrying capacity auditor.
        Compile a grounded **Carrying Capacity Assessment** profile for the sector/region: **{region}**.
        {zone_context}

        Return ONLY a single valid JSON object with exactly the following schema.
        All values must be realistic, grounded in actual regional demographics, and mathematically consistent.

        {{
          "sectorName": "<human-readable sector name e.g., 'Chooralmala-Meppadi Terrain Analysis Sector'>",
          "inputParameters": {{
            "population": <integer — active population of the sector>,
            "landHectares": <integer — usable sector land area in hectares>,
            "waterSupplyLitersDay": <integer — daily emergency/municipal water supply in liters/day>,
            "housingUnits": <integer — available housing/shelter units>,
            "medicalBeds": <integer — total emergency medical beds available>
          }},
          "recommendations": [
            "<1-2 actionable, grounded sector recommendations based on current reserve equilibrium and disaster risks>"
          ]
        }}

        Constraints you MUST follow strictly:
        • population must be positive (> 500) and match realistic sector demographics.
        • landHectares must be realistic for the sector area (500 to 50,000 hectares).
        • waterSupplyLitersDay must be roughly population * 100 to 150 liters/day.
        • housingUnits must be roughly population / 2.5 to 3.5.
        • medicalBeds must be roughly population * 0.04 to 0.08.
        • recommendations must contain 1 to 3 concise, realistic operational advisories.
    """)
