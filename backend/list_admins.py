from app.db.session import SessionLocal
from app.models.user import User, UserRole

db = SessionLocal()
admins = db.query(User).filter(User.role == UserRole.ADMIN).all()
for a in admins:
    print(f"Admin: {a.email}, Role: {a.role.value}")
