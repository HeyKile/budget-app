from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy import Integer, Column, String, ForeignKey, DateTime, Text, Float
from sqlalchemy.sql import func
from datetime import datetime, timezone

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# users table
class User(db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(64), nullable=False, unique=True)
    pw_hash = Column(String(64), nullable=False)

    def __init__(self, username, pw_hash):
        self.username = username
        self.pw_hash = pw_hash

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username
        }

# categoires table
class Category(db.Model):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(64), nullable=False)
    budget = Column(Integer)

    def __init__(self, user_id, name, budget):
        self.user_id = user_id
        self.name = name
        self.budget = budget

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "budget": self.budget
        }

# purchases table
class Purchase(db.Model):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    cat_id = Column(Integer, ForeignKey("categories.id"))
    desc = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    datetime = Column(db.DateTime, nullable=False)

    def __init__(self, user_id, cat_id, desc, amount, datetime):
        self.user_id = user_id
        self.cat_id = cat_id
        self.desc = desc
        self.amount = amount
        self.datetime = datetime

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "cat_id": self.cat_id,
            "desc": self.desc,
            "amount": self.amount,
            "datetime": self.datetime
        }