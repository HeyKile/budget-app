use diesel::prelude::*;
use diesel::Insertable;
use serde::Deserialize;
use serde::Serialize;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[derive(Serialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub pw_hash: String
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::users)]
#[derive(Serialize, Deserialize)]
pub struct NewUser {
    pub username: String,
    pub pw_hash: String
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::categories)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[derive(Serialize)]
pub struct Category {
    pub id: i32,
    pub user_id: i32,
    pub name: String,
    pub budget: Option<i32>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::categories)]
#[derive(Serialize, Deserialize)]
pub struct NewCategory {
    pub user_id: i32,
    pub name: String,
    pub budget: Option<i32>,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::purchases)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[derive(Serialize)]
pub struct Purchase {
    pub id: i32,
    pub desc: String,
    pub amount: i32,
    pub date: String,
    pub user_id: i32,
    pub cat_id: i32,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::purchases)]
#[derive(Serialize, Deserialize)]
pub struct NewPurchase {
    pub user_id: i32,
    pub desc: String,
    pub amount: i32,
    pub date: String,
    pub cat_id: i32
}