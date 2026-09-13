def calculate_priority_score(severity_index: float, vulnerability_score: float, pop: int, mobility_count: int) -> tuple[float, str]:
    """
    Computes a composite priority score (0.0 to 100.0) and assigns a priority tier.
    """
    base_sev_component = min(60.0, severity_index * 6.0)
    vuln_component = min(25.0, vulnerability_score * 25.0)
    
    mobility_ratio = min(1.0, mobility_count / max(1, pop))
    mobility_component = min(15.0, mobility_ratio * 50.0)

    total_score = round(min(100.0, base_sev_component + vuln_component + mobility_component), 1)

    if total_score >= 80.0:
        tier = "CRITICAL_URGENT"
    elif total_score >= 65.0:
        tier = "HIGH_PRIORITY"
    elif total_score >= 45.0:
        tier = "MEDIUM_PRIORITY"
    else:
        tier = "MONITORING"

    return total_score, tier
