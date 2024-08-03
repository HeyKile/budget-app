from flask import (
    Flask, request, session, 
    url_for, redirect, g, render_template,
    jsonify, make_response
)
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
import os
from models.models import db, User, Category, Purchase
from http import HTTPStatus
from utils.user_utils import check_username_unique
from services.user_service import create_user, get_users, validate_login
from werkzeug.security import generate_password_hash
from datetime import timedelta

app = Flask(__name__)
app.debug = True

# config
DEBUG = True
SECRET_KEY = "development key but cooler"
SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(app.root_path, "budget.db")

app.config.from_object(__name__)
app.config['SECRET_KEY'] = 'your_strong_secret_key'
app.config["JWT_SECRET_KEY"] = 'your_jwt_secret_key'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

# JWT Init
jwt = JWTManager(app)

db.init_app(app)

@app.cli.command("initdb")
def initdb_command():
    if DEBUG:
        db.drop_all()
    db.create_all()

@app.route("/hello", methods=["GET", "POST"])
def root():
    return "hello"

# TODO: Make this work lil bro
@app.route("/budget-app/api/users/create", methods=["POST"])
def create_user_handler():
    response = ""
    code = -1
    if not request.json["username"] or not request.json["password"]:
        response = jsonify({"Error": "username and password required"})
        code = HTTPStatus.BAD_REQUEST
    elif not check_username_unique(request.json["username"]):
        response = jsonify({"Error": "username taken"})
        code = HTTPStatus.CONFLICT
    else:
        result = create_user(
            username=request.json["username"],
            pw_hash=generate_password_hash(request.json["password"])
        )
        if result != True:
            response = jsonify({"Error": "unable to create user"})
            code = HTTPStatus.INTERNAL_SERVER_ERROR
        else:
            response = jsonify({"Message": "successfully created user"})
            code = HTTPStatus.OK
    return make_response(response), code

@app.route("/budget-app/api/users", methods=["GET"])
def get_users_handler():
    response = ""
    code = -1
    (res_code, res_item) = get_users()
    if res_code == False:
        response = jsonify({"Error": "There was an error retrieving users"})
        code = HTTPStatus.INTERNAL_SERVER_ERROR
    else:
        response = jsonify({"Users": [user.to_dict() for user in res_item]})
        code = HTTPStatus.OK
    return make_response(response), code

@app.route("/budget-app/api/users/login", methods=["POST"])
def login_handler():
    (response, code) = ("", -1)
    if not request.json["username"] or not request.json["password"]:
        response = jsonify({"Error": "username and password required"})
        code = HTTPStatus.BAD_REQUEST
        return make_response(response), code
    (user_id, err) = validate_login(username=request.json["username"], password=request.json["password"])
    if user_id is None:
        response = jsonify({"Error": err})
        code = HTTPStatus.NOT_FOUND
        return make_response(response), code
    access_token = create_access_token(identity=user_id)
    response = jsonify({
        "Message": "Successfully logged in user",
        "Access Token": access_token
    })
    code = HTTPStatus.OK
    return make_response(response), code

if __name__ == '__main__':
    app.run(debug=True)