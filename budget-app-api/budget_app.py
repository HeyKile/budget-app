from flask import (
    Flask, request, session, 
    url_for, redirect, g, render_template,
    jsonify
)
import os
from models.models import db, User, Category, Purchase

app = Flask(__name__)
app.debug = True

# config
DEBUG = True
SECRET_KEY = "development key but cooler"
SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(app.root_path, "budget.db")

app.config.from_object(__name__)
db.init_app(app)

@app.cli.command("initdb")
def initdb_command():
    if DEBUG:
        db.drop_all()
    db.create_all()

@app.route("/hello", methods=["GET", "POST"])
def root():
    return "hello"

# @app.route("/budget-app/api/user/create", methods=["POST"])
# def user_create():