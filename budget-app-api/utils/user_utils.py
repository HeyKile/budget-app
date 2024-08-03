from models.models import db, User
from services.user_service import get_user_by_username

def check_username_unique(username):
    if get_user_by_username(username=username) is None:
        return True
    return False