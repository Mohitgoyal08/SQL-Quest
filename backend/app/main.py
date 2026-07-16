from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

import logging
from contextlib import asynccontextmanager
from alembic.config import Config
from alembic import command
import os

logger = logging.getLogger("uvicorn.error")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run Alembic migrations on startup in production or if postgres is detected
    is_postgres = settings.DATABASE_URL.startswith("postgresql") or settings.DATABASE_URL.startswith("postgres")
    if settings.ENV == "production" or is_postgres:
        logger.info("Production mode or remote PostgreSQL detected. Starting database migrations...")
        try:
            # Resolve alembic.ini path relative to project structure
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            alembic_ini_path = os.path.join(base_dir, "alembic.ini")
            
            if not os.path.exists(alembic_ini_path):
                # Fallback to current working directory
                alembic_ini_path = "alembic.ini"
                
            logger.info(f"Using Alembic configuration file at: {alembic_ini_path}")
            alembic_cfg = Config(alembic_ini_path)
            alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
            
            # Execute migration upgrade head command
            command.upgrade(alembic_cfg, "head")
            logger.info("Database migrations successfully executed.")
        except Exception as e:
            logger.error(f"Fatal migration error on startup: {e}", exc_info=True)
            # Raise exception to prevent FastAPI from starting up with inconsistent database state
            raise e
            
    yield

app = FastAPI(
    title="SQL Quest API",
    description="Backend API for SQL Quest V2",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.router import api_router

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "SQL Quest V2 Backend is running"}
