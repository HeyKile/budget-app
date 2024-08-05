from flask import (
    Flask, request, session, 
    url_for, redirect, g, render_template,
    jsonify, make_response
)
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
import os
from models.models import db, User, Category, Purchase
from http import HTTPStatus
from utils.user_utils import check_username_unique
from services.user_service import create_user, get_user_by_id, get_users, validate_login
from werkzeug.security import generate_password_hash
from datetime import timedelta
from flask_cors import CORS, cross_origin
from services.category_service import create_category, get_all_categories, get_categories_by_id

app = Flask(__name__)
app.debug = True
CORS(app, resources={r"/budget-app/api/*": {"origins": "http://localhost:3000"}})

# config
DEBUG = True
SECRET_KEY = "development key but cooler"
SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(app.root_path, "budget.db")

app.config.from_object(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'your_strong_secret_key'
app.config["JWT_SECRET_KEY"] = 'your_jwt_secret_key'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)
blacklist = set() # could make this a database table...
db.init_app(app)

@app.cli.command("initdb")
def initdb_command():
    if DEBUG:
        db.drop_all()
    db.create_all()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_data):
    jti = jwt_data['jti']
    return jti in blacklist

@app.route("/hello", methods=["GET", "POST"])
def root():
    return "hello"

@app.route("/budget-app/api/users/register", methods=["POST"])
def create_user_handler():
    response, code = "", -1
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
            response = jsonify({"message": "successfully created user"})
            code = HTTPStatus.OK
    return make_response(response), code

@app.route("/budget-app/api/users", methods=["GET"])
def get_users_handler():
    response, code = "", -1
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
    if request.method == "OPTIONS":
        return make_response(jsonify({"message": "CORS preflight"}), HTTPStatus.OK)
    response, code = "", -1
    if not request.json["username"] or not request.json["password"]:
        response = jsonify({"Error": "username and password required"})
        code = HTTPStatus.BAD_REQUEST
        return make_response(response), code
    (user, err) = validate_login(username=request.json["username"], password=request.json["password"])
    if user is None:
        response = jsonify({"Error": err})
        code = HTTPStatus.NOT_FOUND
        return make_response(response), code
    access_token = create_access_token(identity=user.id)
    response = jsonify({
        "message": "Successfully logged in user",
        "access_token": access_token,
        "user": user.to_dict()
    })
    code = HTTPStatus.OK
    return make_response(response), code

@app.route("/budget-app/api/users/logout", methods=["POST"])
@jwt_required()
def logout_handler():
    response, code = "", -1
    jti = get_jwt()['jti']
    blacklist.add(jti)
    response = jsonify({"message": "Successfully logged out"})
    code = HTTPStatus.OK
    return make_response(response), code

@app.route("/budget-app/api/users/validate-token", methods=["GET"])
@jwt_required()
def validate_token_handler():
    if request.method == "OPTIONS":
        return make_response(jsonify({"message": "CORS preflight"}), HTTPStatus.OK)
    return jsonify({"valid": True}), HTTPStatus.OK

@app.route("/budget-app/api/category/create", methods=["POST"])
@jwt_required()
def create_category_handler():
    if request.method == "OPTIONS":
        return make_response(jsonify({"message": "CORS preflight"}), HTTPStatus.OK)
    user_id = get_jwt_identity()
    if get_user_by_id(user_id) is None:
        return jsonify({"message": "user cannot be found"}), HTTPStatus.GONE
    category_data = request.json
    if not category_data["name"] or not category_data["budget"]:
        return jsonify({"message": "Name and budget required"}), HTTPStatus.BAD_REQUEST
    res = create_category(user_id=user_id, name=category_data["name"], budget=category_data["budget"])
    if res is not True:
        return jsonify({"message": "Error creating category"}), HTTPStatus.INTERNAL_SERVER_ERROR
    return jsonify({"message": "Successfully created category"}), HTTPStatus.OK

@app.route("/budget-app/api/category/get", methods=["GET"])
@jwt_required()
def get_categories_handler():
    if request.method == "OPTIONS":
        return make_response(jsonify({"message": "CORS preflight"}), HTTPStatus.OK)
    user_id = get_jwt_identity()
    if get_user_by_id(user_id) is None:
        return jsonify({"message": "user cannot be found"}), HTTPStatus.GONE
    categories = get_categories_by_id(user_id=user_id)
    if categories is None:
        return jsonify({ "categories": [] }), HTTPStatus.OK
    else:
        return jsonify({ "categories": [category.to_dict() for category in categories] }), HTTPStatus.OK

if __name__ == '__main__':
    app.run(debug=True, port=5000)