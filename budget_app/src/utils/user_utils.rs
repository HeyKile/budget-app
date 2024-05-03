use axum::{Extension, Json};
use diesel::{sqlite::SqliteConnection, prelude::*};
use serde_json::{json, Value};
use crate::{
    models::{NewUser, User}, schema::{users::*, *}, AppState, NewUserInput
};

pub fn validate_new_user_inputs(conn: &mut SqliteConnection, request: Json<Value>) -> NewUserInput<(String, String)> {
    let input_username = match request.get("username").and_then(|name| name.as_str()) {
        None => {
            return NewUserInput::InvalidUsername
        },
        Some(input_username) => input_username.to_string(),
    };
    let input_pw = match request.get("password").and_then(|pw| pw.as_str()) {
        None => {
            println!("password not found");
            return NewUserInput::InvalidPassword
        },
        Some(input_pw) => input_pw.to_string(),
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