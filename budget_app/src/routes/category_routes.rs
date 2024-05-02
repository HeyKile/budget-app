use crate::{
    config::*,
    utils::category_utils::check_new_category_valid,
    services::category_service::*,
};
use axum::{
    extract::Path, 
    http::StatusCode, 
    response::IntoResponse, 
    Extension, Json
};
use serde_json::{json, Value};

pub async fn get_all_categories_handler(state: Extension<AppState>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    match get_categories(&mut *conn) {
        Err(error) => (
            StatusCode::NOT_FOUND,
            Json(json!({
                "message": error.to_string()
            }))
        ),
        Ok(categories) => (
            StatusCode::OK,
            Json(json!({
                "categories": categories
            }))
        ),
    }
}

pub async fn get_category_handler(Path(GetIdParam { req_id }): Path<GetIdParam>, state: Extension<AppState>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    match get_category_by_id(&mut *conn, req_id) {
        Err(_) => (
            StatusCode::NOT_FOUND,
            Json(json!({
                "message": "category not found"
            }))
        ),
        Ok(category) => (
            StatusCode::OK,
            Json(json!({
                "category": category
            }))
        ),
    }
}

pub async fn post_category_handler(state: Extension<AppState>, Json(request): Json<Value>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    let new_category = match check_new_category_valid(Json(request)) {
        CategoryInput::InvalidParameters => return (
            StatusCode::BAD_REQUEST,
            Json(json!({
                "message": "invalid parameters"
            }))
        ),
        CategoryInput::Valid(new_category) => new_category,
    };
    match create_category(&mut *conn, new_category) {
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "message": error.to_string()
            }))
        ),
        Ok(_) => (
            StatusCode::OK,
            Json(json!({
                "message": "Category created successfully"
            }))
        ),
    }
}

pub async fn delete_category_handler(Path(GetIdParam { req_id }): Path<GetIdParam>, state: Extension<AppState>) -> impl IntoResponse {
    let mut conn = state.conn.lock().unwrap();
    match delete_category_by_id(&mut *conn, req_id) {
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "message": error.to_string()
            }))
        ),
        Ok(0) => (
            StatusCode::NOT_FOUND,
            Json(json!({
                "message": "Category not found"
            }))
        ),
        Ok(_) => (
            StatusCode::OK,
            Json(json!({
                "message": "Category successfully deleted"
            }))
        ),
    }
}