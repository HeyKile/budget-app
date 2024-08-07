from models.models import db, Purchase, Category
from werkzeug.security import check_password_hash
from sqlalchemy import func, text

def create_purchase(user_id, desc, amount, datetime, cat_id):
    try:
        purchase = Purchase(user_id=user_id, cat_id=cat_id, desc=desc, amount=amount, datetime=datetime)
        db.session.add(purchase)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return None
    
def get_purchases_by_user_id(user_id):
    try:
        return db.session.query(Purchase).filter_by(user_id=user_id).all()
    except Exception as e:
        print(e)
        return None
    
def get_recent_purchases_by_user_id(user_id):
    try:
        return db.session.query(Purchase).filter_by(user_id=user_id).order_by(Purchase.datetime.desc()).limit(5).all()
    except Exception as e:
        print(e)
        return None
    
def get_purchases_in_month(user_id, current_month, current_year):
    try:
        purchases = db.session.query(Purchase).filter(
            Purchase.user_id == user_id,
            func.strftime('%m', Purchase.datetime) == f'{current_month:02}',
            func.strftime('%Y', Purchase.datetime) == str(current_year)
        ).all()
        grouped_purchases = {}
        for purchase in purchases:
            cur_cat_id = purchase.cat_id
            if cur_cat_id not in grouped_purchases:
                grouped_purchases[cur_cat_id] = []
            grouped_purchases[cur_cat_id].append(purchase)
        return list(grouped_purchases.values())
    except Exception as e:
        print(e)
        return None