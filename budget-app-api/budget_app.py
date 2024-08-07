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
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin
from services.category_service import create_category, get_all_categories, get_categories_by_id, get_category_by_cat_id, get_category_by_id
from services.purchase_service import create_purchase, get_purchases_by_user_id, get_purchases_in_month, get_recent_purchases_by_user_id

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
    
@app.route("/budget-app/api/category/get-specific", methods=["GET"])
@jwt_required()
def get_category_handler():
    if request.method == "OPTIONS":
        return make_response(jsonify({"message": "CORS preflight"}), HTTPStatus.OK)
    
    user_id = get_jwt_identity()
    if get_user_by_id(user_id) is None:
        return jsonify({"message": "user cannot be found"}), HTTPStatus.GONE
    
    if not request.json["catId"]:
        return jsonify({"message": "No category specified"}), HTTPStatus.BAD_REQUEST
    
    category = get_category_by_cat_id(user_id=user_id, cat_id=request.json["catId"])
    if category is None:
        return jsonify({ "category": [] }), HTTPStatus.OK
    else:
        return jsonify({ "category": category.to_dict() }), HTTPStatus.OK

@app.route("/budget-app/api/purchase/create", methods=["POST"])
@jwt_required()
def create_purchase_handler():
    if request.method == "OPTIONS":
        return make_response(jsonify({"message": "CORS preflight"}), HTTPStatus.OK)
    
    user_id = get_jwt_identity()
    if get_user_by_id(user_id) is None:
        return jsonify({"message": "user cannot be found"}), HTTPStatus.UNAUTHORIZED
    
    purchase_data = request.json
    print(purchase_data)
    if (
        not purchase_data["desc"]
        or not purchase_data["amount"]
        or not purchase_data["date"]
        or not purchase_data["cat_id"]
    ):
        return jsonify({"message": "all fields required"}), HTTPStatus.BAD_REQUEST
        
    category = get_category_by_id(cat_id=purchase_data["cat_id"])
    if category is None:
        return jsonify({"message": "category can not be found"}), HTTPStatus.GONE

    try:
        purchase_datetime = datetime.strptime(purchase_data["date"], "%Y-%m-%d")
    except ValueError:
        return jsonify({"message": "invalid datetime format"}), HTTPStatus.BAD_REQUEST

    res = create_purchase(
        user_id=user_id,
        cat_id=category.id,
        desc=purchase_data["desc"],
        amount=purchase_data["amount"],
        datetime=purchase_datetime
    )
    if res != True:
        return jsonify({"message": f"Failed to create purchase: {res}"}), HTTPStatus.INTERNAL_SERVER_ERROR
    else:
        return jsonify({"message": "successfully created purchase"}), HTTPStatus.OK
    
@app.route("/budget-app/api/purchase/get", methods=["GET"])
@jwt_required()
def get_purchases_handler():
    if request.method == "OPTIONS":
        return make_response(jsonify({"message": "CORS preflight"}), HTTPStatus.OK)
    
    user_id = get_jwt_identity()
    if get_user_by_id(user_id) is None:
        return jsonify({"message": "user cannot be found"}), HTTPStatus.UNAUTHORIZED
    
    purchases = get_purchases_by_user_id(user_id=user_id)
    if purchases == None:
        return jsonify({"purchases": []}), HTTPStatus.OK
    else:
        return jsonify({"purchases": [purchase.to_dict() for purchase in purchases]}), HTTPStatus.OK

@app.route("/budget-app/api/purchase/get-recents", methods=["GET"])
@jwt_required()
def get_recent_purchases_handler():
    if request.method == "OPTIONS":
        return make_response(jsonify({"message": "CORS preflight"}), HTTPStatus.OK)
    
    user_id = get_jwt_identity()
    if get_user_by_id(user_id) is None:
        return jsonify({"message": "user cannot be found"}), HTTPStatus.UNAUTHORIZED
    
    purchases = get_recent_purchases_by_user_id(user_id=user_id)
    if purchases == None:
        return jsonify({"purchases": []}), HTTPStatus.OK
    else:
        return jsonify({"purchases": [purchase.to_dict() for purchase in purchases]}), HTTPStatus.OK

# TODO: finish working on graph
@app.route("/budget-app/api/overview/graph-info", methods=["GET"])
@jwt_required()
def get_overview_graph_info_handler():
    if request.method == "OPTIONS":
        return make_response(jsonify({"message": "CORS preflight"}), HTTPStatus.OK)
    
    user_id = get_jwt_identity()
    if get_user_by_id(user_id) is None:
        return jsonify({"message": "user cannot be found"}), HTTPStatus.UNAUTHORIZED
    
    current_date = datetime.now()
    purchases = get_purchases_in_month(user_id=user_id, current_month=current_date.month, current_year=current_date.year)
    if purchases is None:
        return jsonify({"purchases": []}), HTTPStatus.OK
    else:
        purchases_array = []
        for group in purchases:
            current_category = []
            for purchase in group:
                current_category.append(purchase.to_dict())
            purchases_array.append(current_category)
        return jsonify({"purchases": purchases_array}), HTTPStatus.OK

if __name__ == '__main__':
    app.run(debug=True, port=5000)