"""
Registry of government scheme source URLs for the scraping pipeline.
Each source contains a name, base URL, and specific pages to scrape.
"""

SCHEME_SOURCES = {
    "startup_india": {
        "name": "Startup India",
        "base_url": "https://www.startupindia.gov.in",
        "pages": [
            "https://www.startupindia.gov.in/content/sih/en/government-schemes.html",
            "https://www.startupindia.gov.in/content/sih/en/startup-scheme.html",
        ],
        "category": "central",
    },
    "msme": {
        "name": "MSME",
        "base_url": "https://msme.gov.in",
        "pages": [
            "https://msme.gov.in/all-schemes",
        ],
        "category": "central",
    },
    "karnataka_startup": {
        "name": "Karnataka Startup Portal",
        "base_url": "https://startup.karnataka.gov.in",
        "pages": [
            "https://startup.karnataka.gov.in/policies-incentives",
        ],
        "category": "state",
    },
    "sidbi": {
        "name": "SIDBI",
        "base_url": "https://www.sidbi.in",
        "pages": [
            "https://www.sidbi.in/en/products",
        ],
        "category": "financial",
    },
    "dpiit": {
        "name": "DPIIT",
        "base_url": "https://dpiit.gov.in",
        "pages": [
            "https://dpiit.gov.in/programmes-and-schemes",
        ],
        "category": "central",
    },
}


def get_all_urls() -> list[str]:
    """Return a flat list of all source page URLs."""
    urls = []
    for source in SCHEME_SOURCES.values():
        urls.extend(source["pages"])
    return urls


def get_source_names() -> list[str]:
    """Return list of source display names."""
    return [s["name"] for s in SCHEME_SOURCES.values()]
