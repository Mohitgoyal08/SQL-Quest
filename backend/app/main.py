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
    db_url = settings.DATABASE_URL or ""
    is_postgres = db_url.startswith("postgresql") or db_url.startswith("postgres")
    
    logger.info(f"FastAPI Lifespan Startup: ENV={settings.ENV}, is_postgres={is_postgres}, database_url_configured={bool(db_url)}")
    
    if settings.ENV == "production" or is_postgres:
        logger.info("Production mode or remote PostgreSQL detected. Checking database migrations...")
        try:
            from sqlalchemy import inspect, text
            from app.db.session import engine
            
            # Normalize db_url internally for schema inspection
            normalized_url = db_url
            if normalized_url.startswith("postgres://"):
                normalized_url = normalized_url.replace("postgres://", "postgresql://", 1)
                
            # Perform self-healing check if alembic_version exists but core user table is missing
            try:
                inspector = inspect(engine)
                existing_tables = inspector.get_table_names()
                logger.info(f"Existing database tables: {existing_tables}")
                
                if "alembic_version" in existing_tables and "users" not in existing_tables:
                    logger.warning("Corrupt migration state detected: 'alembic_version' table exists but 'users' is missing. Resetting migration version...")
                    with engine.begin() as conn:
                        conn.execute(text("DROP TABLE alembic_version;"))
                    logger.info("Successfully dropped corrupt 'alembic_version' table.")
            except Exception as schema_err:
                logger.warning(f"Could not perform schema check (database might be completely empty): {schema_err}")

            # Resolve alembic.ini path relative to project structure
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            alembic_ini_path = os.path.join(base_dir, "alembic.ini")
            
            if not os.path.exists(alembic_ini_path):
                # Fallback to current working directory
                alembic_ini_path = "alembic.ini"
                
            logger.info(f"Using Alembic configuration file at: {alembic_ini_path}")
            alembic_cfg = Config(alembic_ini_path)
            alembic_cfg.set_main_option("sqlalchemy.url", normalized_url)
            
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
