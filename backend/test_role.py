from app.db.session import SessionLocal
from app.models.user import User, UserRole

db = SessionLocal()
user = db.query(User).filter(User.email == "goyalmohit1235@gmail.com").first()
print(f"Role: {user.role}")
print(f"Type: {type(user.role)}")
print(f"Equals UserRole.ADMIN: {user.role == UserRole.ADMIN}")

admin_user = db.query(User).filter(User.email == "admin@sqlquest.com").first()
print(f"Admin Role: {admin_user.role}")
print(f"Admin Type: {type(admin_user.role)}")
print(f"Admin Equals UserRole.ADMIN: {admin_user.role == UserRole.ADMIN}")
