from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
from app.models.progress import ChallengeStatus

class FleetShipStats(BaseModel):
    speed: float
    capacity: int

class FleetShipCosmetics(BaseModel):
    activeSkin: str

class FleetShip(BaseModel):
    name: str
    stats: FleetShipStats
    cosmetics: FleetShipCosmetics

class FleetData(BaseModel):
    activeShipId: Optional[str] = None
    ownedShipIds: List[str] = []
    ships: Dict[str, FleetShip] = {}

class PlayerProgressState(BaseModel):
    level: int
    xp: int
    coins: int
    gems: int = 0
    currentIsland: str
    currentNPC: str
    inventory: List[str]
    badges: List[str]
    completedIds: List[str]
    unlockedIds: List[str]
    currentChallengeId: str
    unlocks: Dict[str, bool]
    fleet: FleetData
    last_saved_at: Optional[datetime] = None

class ProgressSyncRequest(BaseModel):
    state: PlayerProgressState
    local_timestamp: datetime

class ProgressSyncResponse(BaseModel):
    status: str
    message: str
    state: PlayerProgressState
    server_timestamp: datetime
