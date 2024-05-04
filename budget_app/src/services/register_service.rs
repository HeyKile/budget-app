use crate::models::{User, NewUser};
use crate::user_service::create_user;
use crate::utils::auth_utils::{hash_password, parse_username_password};
use crate::utils::user_utils::validate_new_user_inputs;
use crate::{schema::*, NewUserInput};
use crate::schema::users::id;
use axum::Json;
use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;
use http::StatusCode;
use serde_json::{json, Value};

pub enum RegisterResult {
    InvalidParameters,
    UsernameTaken,
    ServerError,
    Success
}

pub fn register_user(conn: &mut SqliteConnection, request: &Value) -> RegisterResult {
    let (input_username, input_pw) = match validate_new_user_inputs(conn, request) {
        NewUserInput::InvalidParameters => return RegisterResult::InvalidParameters,
        NewUserInput::UsernameTaken => return RegisterResult::UsernameTaken,
        NewUserInput::Valid(parsed_inputs) => parsed_inputs,
    };
    let input_pw_hash = match hash_password(&input_pw) {
        Err(_) => return RegisterResult::ServerError,
        Ok(pw) => pw,
    };
    match create_user(conn, NewUser{ username: input_username, pw_hash: input_pw_hash }) {
        Err(_) => RegisterResult::ServerError,
        Ok(_) => RegisterResult::Success
    }
}