import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.v1.api import api_router
from app.database.database import AsyncSessionLocal

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)-30s | %(levelname)-7s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # --- Startup ---
    logger.info("🚀 Starting Startup Saarthi AI...")

    # Seed schemes if DB is empty
    try:
        from app.services.scheme_service import seed_schemes_from_file
        async with AsyncSessionLocal() as db:
            count = await seed_schemes_from_file(db)
            if count > 0:
                logger.info(f"✅ Seeded {count} government schemes into database")
            else:
                logger.info("📋 Schemes already present in database")
    except Exception as e:
        logger.warning(f"⚠️ Could not seed schemes (DB may not be ready): {e}")

    logger.info("✅ Startup Saarthi AI is ready!")
    yield
    # --- Shutdown ---
    logger.info("👋 Shutting down Startup Saarthi AI...")


app = FastAPI(
    title="Startup Saarthi AI API",
    description="AI Multi-Agent Platform for Startup Growth & Government Funding",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Startup Saarthi AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/v1/auth",
            "startups": "/api/v1/startups",
            "schemes": "/api/v1/schemes",
            "ai": "/api/v1/ai",
            "applications": "/api/v1/applications",
            "notifications": "/api/v1/notifications",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Startup Saarthi AI"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
