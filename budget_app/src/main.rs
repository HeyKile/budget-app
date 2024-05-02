use budget_app::{
    config::*, 
    routes::{category_routes::*, purchase_routes::*, overage_routes::*},
    establish_connection,
};
use axum::{
    response::IntoResponse, 
    routing::{delete, get, post},
     Extension, Json, Router
};
use diesel::SqliteConnection;
use dotenvy::dotenv;
use serde_json::json;
use std::{env, sync::{Arc, Mutex}};

#[tokio::main]
async fn main() {
    dotenv().ok();
    let server_address = env::var("SERVER_ADDRESS").expect("DATABASE_URL must be set");
    let state = AppState {
        conn: init_db_connection(),
    };
    let app: Router<> = init_router(state);
    let listener = tokio::net::TcpListener::bind(server_address).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn init_db_connection() -> Arc<Mutex<SqliteConnection>> {
    let conn = establish_connection();
    Arc::new(Mutex::new(conn))
}

fn init_router(conn: AppState) -> Router {
    Router::new()
        .route("/", get(root))
        .route("/categories/", get(get_all_categories_handler))
        .route("/categories/", post(post_category_handler))
        .route("/categories/:req_id", get(get_category_handler))
        .route("/categories/:req_id", delete(delete_category_handler))
        .route("/purchases/", get(get_all_purchases_handler))
        .route("/purchases/", post(post_purchase_handler))
        .route("/purchases/:req_id", get(get_purchase_handler))
        .route("/purchases/:req_id", delete(delete_purchase_handler))
        .route("/overages", post(overages_handler))
        .layer(Extension(conn))
}

async fn root() -> impl IntoResponse {
    Json(json!({
        "message": "Successfully connected to server"
    }))
}