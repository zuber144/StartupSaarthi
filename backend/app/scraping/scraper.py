"""
Web scraping engine for government scheme websites.
Uses httpx for async HTTP requests and BeautifulSoup for HTML parsing.
"""
import logging
import random
from typing import Optional

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
]


class SchemeScraper:
    """
    Async web scraper for government scheme pages.
    Extracts clean text content from HTML pages.
    """

    def __init__(self, timeout: float = 30.0):
        self.timeout = timeout

    async def scrape_url(self, url: str) -> Optional[str]:
        """
        Fetch raw HTML from a URL.
        Returns HTML string or None on failure.
        """
        headers = {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True,
                verify=False,  # Some gov sites have SSL issues
            ) as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                logger.info(f"Successfully scraped: {url} ({len(response.text)} chars)")
                return response.text
        except httpx.TimeoutException:
            logger.error(f"Timeout scraping {url}")
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error {e.response.status_code} scraping {url}")
        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")
        return None

    def extract_text(self, html: str) -> str:
        """
        Extract clean text from HTML, removing scripts, styles, nav, and footer elements.
        """
        soup = BeautifulSoup(html, "lxml")

        # Remove non-content elements
        for tag in soup(["script", "style", "nav", "footer", "header", "aside", "iframe", "noscript"]):
            tag.decompose()

        # Get text with newline separators
        text = soup.get_text(separator="\n", strip=True)

        # Clean up excessive whitespace
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        cleaned = "\n".join(lines)

        # Truncate to avoid exceeding Gemini context limits
        max_chars = 15000
        if len(cleaned) > max_chars:
            cleaned = cleaned[:max_chars] + "\n... [truncated]"

        return cleaned

    async def scrape_and_extract(self, url: str) -> Optional[str]:
        """
        Combined pipeline: fetch HTML and extract clean text.
        """
        html = await self.scrape_url(url)
        if html is None:
            return None
        return self.extract_text(html)

    async def scrape_multiple(self, urls: list[str]) -> dict[str, Optional[str]]:
        """
        Scrape multiple URLs and return a dict of url -> extracted text.
        """
        results = {}
        for url in urls:
            text = await self.scrape_and_extract(url)
            results[url] = text
        return results
