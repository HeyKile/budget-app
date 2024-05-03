use crate::{
    config::*,
    services::user_service::*,
    utils::{auth_utils::*, user_utils::{validate_new_user_inputs}},
};
use axum::{
    http::StatusCode, 
    response::IntoResponse, 
    Extension, Json
};
use serde_json::{json, Value};

pub fn status_bad_request() -> (StatusCode, axum::Json<Value>) {
    (StatusCode::BAD_REQUEST,
    Json(json!({
        "message": "invalid parameters"
    })))
}

