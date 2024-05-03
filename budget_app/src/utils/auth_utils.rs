use bcrypt::{hash, verify, DEFAULT_COST};
use diesel::SqliteConnection;

use crate::{models::User, user_service::get_user_by_id};

pub fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    hash(password, DEFAULT_COST)
}

pub fn verify_password(found_pw: &str, input_pw: &str) -> bool {
    match verify(input_pw, found_pw) {
        Err(_) => false,
        Ok(res) => res,
    }
}

pub fn validate_user(conn: &mut SqliteConnection, cur_id: i32) -> bool {
    match get_user_by_id(conn, cur_id) {
        Err(_) => false,
        Ok(_) => true,
    }
}