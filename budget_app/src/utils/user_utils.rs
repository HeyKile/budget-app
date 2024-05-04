use axum::{Extension, Json};
use diesel::{sqlite::SqliteConnection, prelude::*};
use serde_json::{json, Value};
use crate::{
    models::{NewUser, User}, schema::{users::*, *}, AppState, NewUserInput
};
use super::auth_utils::parse_username_password;

pub fn validate_new_user_inputs(conn: &mut SqliteConnection, request: &Value) -> NewUserInput<(String, String)> {
    let (input_username, input_pw) = match parse_username_password(&request) {
        None => return NewUserInput::InvalidParameters,
        Some(parsed_input) => parsed_input,
    };
    match unique_username(conn, &input_username) {
        false => {
            println!("username taken?");
            NewUserInput::UsernameTaken
        },
        true => NewUserInput::Valid((input_username, input_pw)),
    }
}

fn unique_username(conn: &mut SqliteConnection, target_username: &str) -> bool {
    let maybe_user: Result<User, diesel::result::Error> = users::table.filter(username.eq(target_username)).get_result(conn);
    match maybe_user {
        Err(_) => true,
        Ok(_) => false,
    }
}