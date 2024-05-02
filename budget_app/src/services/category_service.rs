use crate::models::{Category, NewCategory};
use crate::schema::*;
use crate::purchase_service::*;
use crate::schema::categories::id;
use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;

/*
category functions
*/
pub fn create_category(conn: &mut SqliteConnection, new_category: NewCategory) -> Result<usize, diesel::result::Error> {
    diesel::insert_into(categories::table)
        .values(&new_category)
        .execute(conn)
}

pub fn get_categories(conn: &mut SqliteConnection) -> Result<Vec<Category>, diesel::result::Error> {
    categories::table.order(id.asc()).load(conn)
}

pub fn get_category_by_id(conn: &mut SqliteConnection, category_id: i32) -> Result<Category, diesel::result::Error> {
    categories::table.find(category_id).first(conn)
}

pub fn delete_category_by_id(conn: &mut SqliteConnection, category_id: i32) -> Result<usize, diesel::result::Error> {
    match delete_purchases_by_category(conn, category_id) {
        Err(error) => return Err(error),
        Ok(_) => {
            let target_category = categories::table.filter(id.eq(category_id));
            diesel::delete(target_category).execute(conn)
        }
    }
}