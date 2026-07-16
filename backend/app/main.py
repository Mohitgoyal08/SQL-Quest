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
            
            # Auto-seed default admin user if no admin exists
            from app.db.session import SessionLocal
            from app.crud.crud_user import get_user_by_email
            from app.models.user import User, PlayerProfile, UserRole
            from app.core.security import get_password_hash
            
            db = SessionLocal()
            try:
                # Seed all 8 standard islands required by foreign key constraints in challenges
                from app.models.content import Island
                islands = [
                    {"id": "tutorial_island", "name": "Tutorial Harbor", "description": "The starting harbor.", "order_index": 0},
                    {"id": "merchant_hub", "name": "Merchant Isles", "description": "A bustling trade hub.", "order_index": 1},
                    {"id": "merchant_isles", "name": "Merchant Isles", "description": "A bustling trade hub.", "order_index": 1},
                    {"id": "smugglers_cove", "name": "Smuggler's Cove", "description": "A hidden cove for smugglers.", "order_index": 2},
                    {"id": "jungle", "name": "Jungle of Queries", "description": "A dense jungle full of mysteries.", "order_index": 3},
                    {"id": "jungle_queries", "name": "Jungle of Queries", "description": "A dense jungle full of mysteries.", "order_index": 3},
                    {"id": "crystal_caverns", "name": "Crystal Caverns", "description": "Glowing underground caverns.", "order_index": 4},
                    {"id": "volcano", "name": "Volcano Island", "description": "A fiery, dangerous landscape.", "order_index": 5},
                    {"id": "volcano_island", "name": "Volcano Island", "description": "A fiery, dangerous landscape.", "order_index": 5},
                    {"id": "lost_sea", "name": "Lost Sea", "description": "Uncharted and dangerous waters.", "order_index": 6},
                    {"id": "pirate_ship", "name": "Pirate King's Ship", "description": "The final showdown.", "order_index": 7},
                    {"id": "pirate_kings_ship", "name": "Pirate King's Ship", "description": "The final showdown.", "order_index": 7},
                ]
                
                for island_data in islands:
                    island_record = db.query(Island).filter(Island.id == island_data["id"]).first()
                    if not island_record:
                        logger.info(f"Seeding island: {island_data['id']}")
                        db.add(Island(**island_data))
                db.commit()
                logger.info("Islands verification and seeding complete.")

                admin_user = get_user_by_email(db, email="admin@sqlquest.com")
                if not admin_user:
                    logger.info("Seeding default admin user...")
                    hashed_pwd = get_password_hash("AdminPassword123!")
                    
                    admin_db = User(
                        email="admin@sqlquest.com",
                        hashed_password=hashed_pwd,
                        role=UserRole.ADMIN
                    )
                    db.add(admin_db)
                    db.commit()
                    db.refresh(admin_db)
                    
                    profile_db = PlayerProfile(
                        user_id=admin_db.id,
                        display_name="Admin",
                        avatar_id="pirate-boy"
                    )
                    db.add(profile_db)
                    db.commit()
                    logger.info("Default admin user successfully seeded.")
                else:
                    # Let's ensure if it exists, it has the ADMIN role
                    if admin_user.role != UserRole.ADMIN:
                        logger.info("Updating existing admin user role to ADMIN...")
                        admin_user.role = UserRole.ADMIN
                        db.add(admin_user)
                        db.commit()
                        logger.info("Updated role to ADMIN.")
                    logger.info("Admin user check complete.")
            except Exception as seed_err:
                logger.warning(f"Could not auto-seed admin user: {seed_err}")
            finally:
                db.close()
                
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

@app.get("/api/v1/debug-counts")
def debug_counts():
    from app.db.session import SessionLocal
    from sqlalchemy import text
    db = SessionLocal()
    try:
        tables = ["users", "player_profiles", "islands", "challenges", "rewards", "dialogues"]
        counts = {}
        for table in tables:
            res = db.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
            counts[table] = res
        # Check islands
        islands = db.execute(text("SELECT id, name FROM islands")).fetchall()
        counts["islands_list"] = [dict(row._mapping) for row in islands]
        return counts
    finally:
        db.close()
