from fastapi import APIRouter
from app.api.v1 import auth, player, progress, admin, content

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(player.router, prefix="/player", tags=["player"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(content.router, prefix="/content", tags=["content"])
