from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SQL Quest API",
    description="Backend API for SQL Quest V2",
    version="2.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173", # Vite Dev Server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.router import api_router
from app.core.config import settings

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "SQL Quest V2 Backend is running"}
