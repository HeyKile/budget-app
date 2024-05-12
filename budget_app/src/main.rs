use budget_app::{
    config::{*}, config::{*}, establish_connection, routes::{auth_routes::*, category_routes::*, overage_routes::*, purchase_routes::*}, services::auth_service::validate_token, utils::auth_utils::get_token
};
use axum::{
    body::Body, extract::Request, http::{HeaderMap, StatusCode}, middleware::{self, Next}, response::{IntoResponse, Response}, routing::{delete, get, post}, Extension, Json, Router
};
use diesel::SqliteConnection;
use dotenvy::dotenv;
use serde_json::json;
use tower_sessions_sqlx_store::sqlx::query;
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
    
    let auth_routes = Router::new()
        .route("/logout", post(logout_handler))
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
        .layer(ServiceBuilder::new().layer(middleware::from_fn(auth_middleware))); // TODO: fix to work

    Router::new()
        .route("/", get(root))
        .route("/login", post(login_handler))
        .route("/register", post(register_handler))
        .nest("/auth", auth_routes)
        .layer(
            ServiceBuilder::new()
                .layer(Extension(conn.clone()))
                .layer(cors)
        )
}

async fn auth_middleware(request: Request, next: Next) -> Response {
    let headers = request.headers();
    let token = get_token(&headers);
    let is_valid = match token {
        None => false,
        Some(token) => validate_token(token)
    };

    if is_valid {
        next.run(request).await
    } else {
        Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .body(Body::from("unauthorized"))
            .unwrap()
    }
}


async fn root() -> impl IntoResponse {
    Json(json!({
        "message": "Successfully connected to server"
    }))
}