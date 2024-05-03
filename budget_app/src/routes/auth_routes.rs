use crate::{
    config::*, models::NewUser, services::user_service::*, utils::{auth_utils::*, status_code_utils::*, user_utils::validate_new_user_inputs}
};
use axum::{
    http::StatusCode, 
    response::IntoResponse, 
    Extension, Json
};
use serde_json::{json, Value};

pub async fn login_handler(state: Extension<AppState>, Json(request): Json<Value>) -> impl IntoResponse {
    let intput_username = match request.get("username").and_then(|name| name.as_str()) {
        None => return status_bad_request(),
        Some("") => return status_bad_request(),
        Some(username) => username,
    };
    let input_pw = match request.get("password").and_then(|name| name.as_str()) {
        None => return status_bad_request(),
        Some("") => return status_bad_request(),
        Some(pw) => match hash_password(pw) {
            Err(_) => return status_bad_request(),
            Ok(hash_pw) => hash_pw,
        },
    };
    let mut conn = state.conn.lock().unwrap();
    match get_user_by_credentials(&mut conn, intput_username.to_string(), input_pw) {
        Err(_) => status_bad_request(),
        Ok(user) => (
            StatusCode::OK,
            Json(json!({
                "message": "successfully logged in",
                "user_id": user.id,
            }))
        ),
    }
}

pub async fn logout_handler(state: Extension<AppState>, Json(request): Json<Value>) -> impl IntoResponse {
    let input_user_id = match request.get("user_id").and_then(|name| name.as_i64()).map(|num| num as i32) {
        None => return status_bad_request(),
        Some(user_id) => user_id,
    };
    let mut conn = state.conn.lock().unwrap();
    match get_user_by_id(&mut conn, input_user_id) {
        Err(_) => status_bad_request(),
        Ok(_) => (
            StatusCode::OK,
            Json(json!({
                "message": "successfully logged out",
            }))
        ),
    }
}

pub async fn register_handler(state: Extension<AppState>, Json(request): Json<Value>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    let (input_username, input_password) = match validate_new_user_inputs(&mut conn, Json(request)) {
        NewUserInput::InvalidParameters => return status_bad_request(),
        NewUserInput::UsernameTaken => return (
            StatusCode::CONFLICT,
            Json(json!({
                "message": "username already taken"
            })),
        ),
        NewUserInput::Valid(valid_user) => valid_user,
    };
    let input_pw_hash = match hash_password(&input_password) {
        Err(_) => return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "message": "error processing request"
            })),
        ),
        Ok(pw) => pw,
    };
    match create_user(&mut conn, NewUser{ username: input_username, pw_hash: input_pw_hash }) {
        Err(_) => (
            StatusCode::MOVED_PERMANENTLY,
            Json(json!({
                "message": "in create",
            }))
        ),
        Ok(_) => (
            StatusCode::OK,
            Json(json!({
                "message": "successfully register user"
            })),
        ),
    }
}