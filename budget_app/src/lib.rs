pub mod models;
pub mod schema;
pub mod services;
pub mod routes;
pub mod config;
pub mod utils;

use crate::config::*;
use crate::services::*;
use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

// this code came from the diesel getting started guide
// https://diesel.rs/guides/getting-started.html
pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}