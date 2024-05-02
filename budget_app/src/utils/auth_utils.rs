use bcrypt::{hash, DEFAULT_COST};
use diesel::SqliteConnection;

use crate::user_service::get_user_by_id;

pub fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    hash(password, DEFAULT_COST)
}

pub fn validate_user(conn: &mut SqliteConnection, cur_id: i32) -> bool {
    match get_user_by_id(conn, cur_id) {
        Err(_) => false,
        Ok(_) => true,
    }
}