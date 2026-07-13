from app.db.session import SessionLocal
from app.models.content import Island

db = SessionLocal()

islands = [
    {"id": "merchant_hub", "name": "Merchant Isles", "description": "A bustling trade hub.", "order_index": 1},
    {"id": "jungle", "name": "Jungle of Queries", "description": "A dense jungle full of mysteries.", "order_index": 2},
    {"id": "crystal_caverns", "name": "Crystal Caverns", "description": "Glowing underground caverns.", "order_index": 3},
    {"id": "volcano", "name": "Volcano Island", "description": "A fiery, dangerous landscape.", "order_index": 4},
    {"id": "lost_sea", "name": "Lost Sea", "description": "Uncharted and dangerous waters.", "order_index": 5},
    {"id": "pirate_ship", "name": "Pirate King's Ship", "description": "The final showdown.", "order_index": 6},
]

for island_data in islands:
    island = db.query(Island).filter(Island.id == island_data["id"]).first()
    if not island:
        db.add(Island(**island_data))

db.commit()
print("Islands seeded successfully.")
