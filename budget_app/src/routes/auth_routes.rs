use crate::{
    config::*,
    services::user_service::*,
    utils::auth_utils::*,
};
use axum::{
    http::StatusCode, 
    response::IntoResponse, 
    Extension, Json
};
use serde_json::{json, Value};

pub async fn login_handler(state: Extension<AppState>, Json(request): Json<Value>) -> impl IntoResponse {
    let intput_username = match request.get("username").and_then(|name| name.as_str()) {
        None => return return_bad_request(),
        Some("") => return return_bad_request(),
        Some(username) => username,
    };
    let input_pw = match request.get("password").and_then(|name| name.as_str()) {
        None => return return_bad_request(),
        Some("") => return return_bad_request(),
        Some(pw) => match hash_password(pw) {
            Err(_) => return return_bad_request(),
            Ok(hash_pw) => hash_pw,
        },
    };
    let mut conn = state.conn.lock().unwrap();
    match get_user_by_credentials(&mut conn, intput_username.to_string(), input_pw) {
        Err(_) => return_bad_request(),
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
        None => return return_bad_request(),
        Some(user_id) => user_id,
    };
    let mut conn = state.conn.lock().unwrap();
    match get_user_by_id(&mut conn, input_user_id) {
        Err(_) => return_bad_request(),
        Ok(_) => (
            StatusCode::OK,
            Json(json!({
                "message": "successfully logged out",
            }))
        ),
    }
}

fn return_bad_request() -> (StatusCode, axum::Json<Value>) {
    (StatusCode::BAD_REQUEST,
    Json(json!({
        "message": "invalid parameters"
    })))
}