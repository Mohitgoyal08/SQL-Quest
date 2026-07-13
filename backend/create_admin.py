from app.db.session import SessionLocal
from app.crud.crud_user import create_user
from app.schemas.user import UserCreate
from app.models.user import UserRole

db = SessionLocal()
admin_in = UserCreate(
    email="admin@sqlquest.com",
    password="AdminPassword123!",
    display_name="Admin",
    role=UserRole.ADMIN
)
try:
    create_user(db=db, obj_in=admin_in)
    print("Admin user created.")
except Exception as e:
    print(f"Error: {e}")
