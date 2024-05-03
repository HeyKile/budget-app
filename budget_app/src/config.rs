use diesel::SqliteConnection;
use serde::Deserialize;
use std::sync::{Arc, Mutex};

pub enum PurchaseInput<T> {
    InvalidCategory,
    InvalidParameters,
    Valid(T),
}

pub enum CategoryInput<T> {
    InvalidParameters,
    Valid(T),
}

#[derive(Clone)]
pub struct AppState {
    pub conn: Arc<Mutex<SqliteConnection>>,
}

#[derive(Deserialize)]
pub struct GetIdParam {
    pub req_id: i32,
}

pub enum NewUserInput<T> {
    // InvalidParameters,
    InvalidUsername,
    InvalidPassword,
    UsernameTaken,
    Valid(T),
}