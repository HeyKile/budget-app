use crate::{
    config::*,
    utils::purchase_utils::*,
    services::purchase_service::*,
};
use axum::{
    extract::Path, 
    http::StatusCode, 
    response::IntoResponse, 
    Extension, Json,
};
use serde_json::{json, Value};

pub async fn get_all_purchases_handler(state: Extension<AppState>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    match get_purchases(&mut *conn) {
        Err(error) => (
            StatusCode::NOT_FOUND,
            Json(json!({
                "message": error.to_string()
            }))
        ),
        Ok(purchases) => (
            StatusCode::OK,
            Json(json!({
                "purchases": purchases
            }))
        ),
    }
}

pub async fn get_purchase_handler(Path(GetIdParam { req_id }): Path<GetIdParam>, state: Extension<AppState>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    match get_purchase_by_id(&mut *conn, req_id) {
        Err(error) => (
            StatusCode::NOT_FOUND,
            Json(json!({
                "message": error.to_string()
            }))
        ),
        Ok(purchase) => (
            StatusCode::OK,
            Json(json!({
                "purchase": purchase
            }))
        ),
    }
}

pub async fn post_purchase_handler(state: Extension<AppState>, Json(request): Json<Value>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    let new_purchase = match check_new_purchase_valid(&mut *conn, Json(request)) {
        PurchaseInput::InvalidParameters => return (
            StatusCode::BAD_REQUEST,
            Json(json!({
                "message": "Invalid parameters",
            }))
        ),
        PurchaseInput::InvalidCategory => return (
            StatusCode::NOT_FOUND,
            Json(json!({
                "message": "No category for given id"
            }))
        ),
        PurchaseInput::Valid(new_purchase) => new_purchase,
    };
    match create_purchase(&mut *conn, new_purchase) {
        Err(error) => (
            StatusCode::NOT_FOUND,
            Json(json!({
                "message": error.to_string()
            }))
        ),
        Ok(_) => (
            StatusCode::OK,
            Json(json!({
                "message": "purchase made successfully"
            }))
        ),
    }
}

pub async fn delete_purchase_handler(Path(GetIdParam { req_id }): Path<GetIdParam>, state: Extension<AppState>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    match delete_purchase_by_id(&mut *conn, req_id) {
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "message": error.to_string()
            }))
        ),
        Ok(0) => (
            StatusCode::NOT_FOUND,
            Json(json!({
                "message": "Purchase was not found"
            }))
        ),
        Ok(_) => (
            StatusCode::OK,
            Json(json!({
                "message": "Purchase successfully deleted"
            }))
        ),
    }
}