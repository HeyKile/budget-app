use crate::{
    config::*,
    services::overages_service::*,
};
use axum::{
    http::StatusCode, 
    response::IntoResponse, 
    Extension, Json,
};
use serde_json::{json, Value};

pub async fn overages_handler(state: Extension<AppState>, Json(request): Json<Value>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    let category_id = request.get("category_id")
        .and_then(|num| num.as_i64())
        .map(|num| num as i32);
    match category_id {
        None => {
            match request.get("all_categories")
                .and_then(|all_purchases| all_purchases.as_bool())
                .unwrap_or(false) {
                false => return (
                    StatusCode::BAD_REQUEST,
                    Json(json!({
                        "message": "invalid parameter"
                    }))
                ),
                true => {
                    match get_all_overages(&mut *conn) {
                        Err(error) => (
                            StatusCode::INTERNAL_SERVER_ERROR,
                            Json(json!({
                                "message": error.to_string()
                            }))
                        ),
                        Ok(overages) => (
                            StatusCode::OK,
                            Json(json!({
                                "overages": overages
                            }))
                        ),
                    }
                }
            }
        },
        Some(category_id) => {
            match get_category_overages(&mut conn, category_id) {
                Err(error) => (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({
                        "message": error.to_string()
                    }))
                ),
                Ok(overages) => (
                    StatusCode::OK,
                    Json(json!({
                        "overages": overages
                    }))
                ),
            }
        },
    }
}