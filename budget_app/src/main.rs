use budget_app::{
    config::{*}, config::{*}, establish_connection, routes::{auth_routes::*, category_routes::*, overage_routes::*, purchase_routes::*}, services::auth_service::validate_token, utils::auth_utils::get_token
};
use axum::{
    extract::Request, http::{HeaderMap, StatusCode}, middleware::{self, Next}, response::{IntoResponse, Response}, routing::{delete, get, post}, Extension, Json, Router
};
use diesel::SqliteConnection;
use dotenvy::dotenv;
use serde_json::json;
use std::{env, sync::{Arc, Mutex}};
use tower::{ServiceBuilder, ServiceExt, Service};
use http::{header, request, Method};
use tower_http::cors::{Any, CorsLayer};

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
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::DELETE])
        .allow_headers(vec![header::CONTENT_TYPE])
        .allow_origin(Any); // unsafe, but fine for now...
    Router::new()
        .route("/", get(root))
        .route("/login", post(login_handler))
        .route("/logout", post(logout_handler))
        .route("/register", post(register_handler))
        .route("/categories/", get(get_all_categories_handler))
        .route("/categories/", post(post_category_handler))
        .route("/categories/:req_id", get(get_category_handler))
        .route("/categories/:req_id", delete(delete_category_handler))
        .route("/purchases/", get(get_all_purchases_handler))
        .route("/purchases/", post(post_purchase_handler))
        .route("/purchases/:req_id", get(get_purchase_handler))
        .route("/purchases/:req_id", delete(delete_purchase_handler))
        .route("/overages", post(overages_handler))
        .route("/users", get(get_users_handler))
        .layer(cors)
        .layer(Extension(conn))
}

async fn auth(headers: HeaderMap, request: Request, next: Next) -> Result<Response, StatusCode> {
    match get_token(&headers) {
        Some(token) if validate_token(token) => {
            let response = next.run(request).await;
            Ok(response)
        },
        _ => Err(StatusCode::UNAUTHORIZED)
    }
}

async fn root() -> impl IntoResponse {
    Json(json!({
        "message": "Successfully connected to server"
    }))
}