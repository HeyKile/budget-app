from models.models import db, Category
from werkzeug.security import check_password_hash

def create_category(user_id, name, budget):
    try:
        new_category = Category(user_id=user_id, name=name, budget=budget)
        db.session.add(new_category)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return None
    
def get_categories_by_id(user_id):
    try:
        return db.session.query(Category).filter_by(user_id=user_id).all()
    except Exception as e:
        print(f"Error in get_categories_by_id: \n${e}")
        return None

def get_all_categories():
    try:
        return db.session.query(Category).all()
    except Exception as e:
        print(e)
        return None
    
def get_category_by_id(cat_id):
    try:
        return db.session.query(Category).filter_by(id=cat_id).first()
    except Exception as e:
        print(e)
        return None
    
def get_category_by_cat_id(user_id, cat_id):
    try:
        return db.session.query(Category).filter_by(id=cat_id, user_id=user_id).first()
    except Exception as e:
        print(e)
        return None