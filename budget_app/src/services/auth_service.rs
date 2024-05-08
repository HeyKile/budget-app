use diesel::SqliteConnection;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use dotenvy::dotenv;
use std::{env, time::{SystemTime, UNIX_EPOCH}};

use crate::{user_service::get_user_by_username, utils::auth_utils::verify_password};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    sub: String,
    exp: usize,
}

pub fn validate_login(conn: &mut SqliteConnection, request: Value) -> Option<String> {
    let input_username = request.get("username").and_then(|username| username.as_str())?;
    let input_pw = request.get("password").and_then(|password| password.as_str())?;
    let found_user = match get_user_by_username(conn, input_username) {
        Err(_) => return None,
        Ok(user) => user
    };
    if !verify_password(&found_user.pw_hash, input_pw) {
        return None
    }
    match generate_token(found_user.id) {
        Err(_) => None,
        Ok(token) => Some(token),
    }
}

pub fn generate_token(user_id: i32) -> Result<String, jsonwebtoken::errors::Error> {
    dotenv().ok();
    let new_claims = Claims {
        sub: user_id.to_string(),
        exp: 100000000,
    };
    let header = Header::default();
    let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY must be set");
    let key = EncodingKey::from_secret(secret_key.as_ref());
    encode(&header, &new_claims, &key)
}

pub fn validate_token(token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    dotenv().ok();
    let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY must be set");
    let validation = Validation::default();
    match decode::<Claims>(token, &DecodingKey::from_secret(secret_key.as_ref()), &validation) {
        Err(e) => Err(e),
        Ok(decoded_token) => Ok(decoded_token.claims)
    }
}

pub fn check_token_valid(token: &str) -> bool {
    dotenv().ok();
    let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY must be set");
    let validation = Validation::default();
    let token_data = match decode::<Claims>(token, &DecodingKey::from_secret(secret_key.as_ref()), &validation) {
        Err(_) => return false,
        Ok(decoded_token) => decoded_token.claims
    };
    let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() as usize;
    token_data.exp <= now
}