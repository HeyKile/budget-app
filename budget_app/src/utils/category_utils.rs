use crate::CategoryInput;
use crate::models::NewCategory;
use axum::Json;
use serde_json::Value;

pub fn check_new_category_valid(request: Json<Value>) -> CategoryInput<NewCategory> {
    let input_name = match request.get("name").and_then(|name| name.as_str()) {
        None => return CategoryInput::InvalidParameters,
        Some("") => return CategoryInput::InvalidParameters,
        Some(input_name) => input_name,
    };
    let input_budget = request.get("budget")
        .and_then(|num| num.as_i64())
        .map(|num| num as i32);
    CategoryInput::Valid(NewCategory{ name: input_name.to_string(), budget: input_budget })

}