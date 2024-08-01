use crate::schema::*;
use crate::schema::purchases::{cat_id, date};
use crate::models::{Purchase, NewPurchase};

use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;
use diesel::sql_query;
use diesel::sql_types::{Integer, Text};

/*
purchase functions
*/
pub fn create_purchase(conn: &mut SqliteConnection, new_purchase: NewPurchase) -> Result<usize, diesel::result::Error> {
    diesel::insert_into(purchases::table)
        .values(&new_purchase)
        .execute(conn)
}

pub fn get_purchases(conn: &mut SqliteConnection) -> Result<Vec<Purchase>, diesel::result::Error> {
    purchases::table.order(date.desc()).load(conn)
}

pub fn get_purchase_by_id(conn: &mut SqliteConnection, purchase_id: i32) -> Result<Purchase, diesel::result::Error> {
    purchases::table.find(purchase_id).first(conn)
}

pub fn get_purchases_by_category(conn: &mut SqliteConnection, category_id: i32) -> Result<Vec<Purchase>, diesel::result::Error> {
    purchases::table.filter(cat_id.is(category_id)).order(date.asc()).load(conn)
}

pub fn delete_purchases_by_category(conn: &mut SqliteConnection, category_id: i32) -> Result<usize, diesel::result::Error> {
    let category_purchases = purchases::table.filter(cat_id.eq(category_id));
    diesel::delete(category_purchases).execute(conn)
}

pub fn delete_purchase_by_id(conn: &mut SqliteConnection, pur_id: i32) -> Result<usize, diesel::result::Error> {
    use crate::schema::purchases::dsl::*;
    let target = purchases.filter(id.eq(pur_id));
    diesel::delete(target).execute(conn)
}

pub fn get_purchase_dates_for_category(conn: &mut SqliteConnection, category_id: i32) -> Result<Vec<String>, diesel::result::Error> {
    purchases::table.filter(cat_id.is(category_id)).order(date.asc()).select(date).load(conn)
}

// Note: input string in the format YYYY-MM-%%
pub fn get_purchases_by_year_month(conn: &mut SqliteConnection, year_month: String) -> Result<Vec<Purchase>, diesel::result::Error> {
    purchases::table.filter(date.like(year_month)).order(date.asc()).load(conn)
}
// Note: input string in the format YYYY-MM-%%
pub fn get_category_purchases_by_year_by_month(conn: &mut SqliteConnection, year_month: String, category_id: i32) -> Result<Vec<Purchase>, diesel::result::Error> {
    purchases::table.filter(date.like(year_month).and(cat_id.eq(category_id))).order(date.asc()).load(conn)
}

pub fn get_all_purchases_by_month(conn: &mut SqliteConnection) -> Result<Vec<Purchase>, diesel::result::Error> {
    purchases::table.order(date.asc()).load(conn)
}