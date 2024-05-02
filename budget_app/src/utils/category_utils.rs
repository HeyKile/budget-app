use crate::CategoryInput;
use crate::models::NewCategory;
use crate::services::user_service::*;
use axum::Json;
use diesel::SqliteConnection;
use serde_json::Value;

pub fn check_new_category_valid(conn: &mut SqliteConnection, request: Json<Value>) -> CategoryInput<NewCategory> {
    let input_user_id = match request.get("user_id").and_then(|name| name.as_i64()).map(|num| num as i32) {
        None => return CategoryInput::InvalidParameters,
        Some(user_id) => match get_user_by_id(conn, user_id) {
            Err(_) => return CategoryInput::InvalidParameters,
            Ok(user) => user.id,
        }
    };
    let input_name = match request.get("name").and_then(|name| name.as_str()) {
        None => return CategoryInput::InvalidParameters,
        Some("") => return CategoryInput::InvalidParameters,
        Some(input_name) => input_name,
    };
    let input_budget = request.get("budget")
        .and_then(|num| num.as_i64())
        .map(|num| num as i32);
    CategoryInput::Valid(NewCategory{ user_id: input_user_id, name: input_name.to_string(), budget: input_budget })
}