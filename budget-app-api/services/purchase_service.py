from models.models import db, Purchase
from werkzeug.security import check_password_hash

def create_purchase(user_id, desc, amount, datetime, cat_id):
    try:
        purchase = Purchase(user_id=user_id, cat_id=cat_id, desc=desc, amount=amount, datetime=datetime)
        db.session.add(purchase)
        db.session.commit()
        return True
    except Exception as e:
        return str(e)
    
def get_purchases_by_user_id(user_id):
    try:
        return db.session.query(Purchase).filter_by(user_id=user_id).all()
    except Exception as _:
        return None
    
def get_recent_purchases_by_user_id(user_id):
    try:
        return db.session.query(Purchase).filter_by(user_id=user_id).order_by(Purchase.datetime.desc()).limit(5).all()
    except Exception as _:
        return None