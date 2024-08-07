from models.models import db, User
from werkzeug.security import check_password_hash

def create_user(username, pw_hash):
    try:
        new_user = User(username=username, pw_hash=pw_hash)
        db.session.add(new_user)
        db.session.commit()
        return True
    except Exception as e:
        return str(e)

def get_users():
    try:
        return (True, db.session.query(User).all())
    except Exception as e:
        return (False, str(e))

def get_user_by_username(username):
    try:
        return db.session.query(User).filter_by(username=username).first()
    except Exception as e:
        return str(e)
    
def get_user_by_id(user_id):
    try:
        return db.session.query(User).filter_by(id=user_id).first()
    except Exception as e:
        return None
    
def validate_login(username, password):
    try:
        user = get_user_by_username(username=username)
        if not check_password_hash(pwhash=user.pw_hash, password=password):
            raise ValueError("Passwords do not match") 
        return (user, None)
    except Exception as e:
        return (None, str(e))