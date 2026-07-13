from app.db.session import Base
# Import all models here for Alembic
from app.models.user import User, PlayerProfile
from app.models.progress import PlayerProgress, CompletedChallenge, AnalyticsEvent, ChallengeAttempt, PracticeAttempt
from app.models.content import Island, Challenge, Reward, Dialogue, Media
