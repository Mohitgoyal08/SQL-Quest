import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.api.deps import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db() -> Generator:
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db) -> Generator:
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def normal_user_token_headers(client: TestClient, db) -> dict:
    from app.crud.crud_user import create_user
    from app.schemas.user import UserCreate
    from app.core.security import create_access_token
    from app.models.user import UserRole
    import uuid

    email = f"normal_{uuid.uuid4()}@example.com"
    user_in = UserCreate(email=email, password="password123", display_name="Normal User")
    user = create_user(db, user_in)
    
    access_token = create_access_token(subject=user.id)
    return {"Authorization": f"Bearer {access_token}"}

@pytest.fixture(scope="function")
def admin_token_headers(client: TestClient, db) -> dict:
    from app.crud.crud_user import create_user
    from app.schemas.user import UserCreate
    from app.core.security import create_access_token
    from app.models.user import UserRole
    import uuid

    email = f"admin_{uuid.uuid4()}@example.com"
    user_in = UserCreate(email=email, password="password123", display_name="Admin User")
    user = create_user(db, user_in)
    user.role = UserRole.ADMIN
    db.commit()
    
    access_token = create_access_token(subject=user.id)
    return {"Authorization": f"Bearer {access_token}"}
