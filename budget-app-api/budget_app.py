from flask import (
    Flask, request, session, 
    url_for, redirect, g, render_template,
    jsonify, make_response
)
import os
from models.models import db, User, Category, Purchase
from http import HTTPStatus
from utils.user_utils import check_username_unique
from services.user_service import create_user, get_users
from werkzeug.security import generate_password_hash

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

@app.route("/budget-app/api/users/create", methods=["POST"])
def route_create_user():
    response = ""
    code = -1
    if not request.form["username"] or not request.form["password"]:
        response = jsonify({"Error": "username and password required"})
        code = HTTPStatus.BAD_REQUEST
    elif not check_username_unique(request.form["username"]):
        response = jsonify({"Error": "username and password required"})
        code = HTTPStatus.CONFLICT
    result = create_user(
        username=request.form["username"],
        pw_hash=generate_password_hash(request.form["password"])
    )
    if result != True:
        response = jsonify({"Error": result})
        code = HTTPStatus.INTERNAL_SERVER_ERROR
    else:
        response = jsonify({"Message": "successfully created user"})
        code = HTTPStatus.OK
    return make_response(response, code)

@app.route("/budget-app/api/users", methods=["GET"])
def route_get_users():
    response = ""
    code = -1
    (res_code, res_item) = get_users()
    if res_code == False:
        response = jsonify({"Error": res_item})
        code = HTTPStatus.INTERNAL_SERVER_ERROR
    else:
        response = jsonify({"Users": res_item})
        code = HTTPStatus.OK
    return make_response(response, code)