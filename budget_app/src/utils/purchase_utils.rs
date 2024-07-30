use crate::user_service::get_user_by_id;
use crate::{category_service::*, PurchaseInput};
use crate::models::NewPurchase;
use crate::purchase_service::*;
use crate::models::Purchase;
use crate::schema::*;
use crate::schema::purchases::date;
use super::month_utils::get_unique_months;
use axum::Json;
use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;
use regex::Regex;
use serde_json::Value;
use std::collections::HashMap;

pub fn check_new_purchase_valid(conn: &mut SqliteConnection, request: Json<Value>) -> PurchaseInput<NewPurchase> {
    let input_user_id = match request.get("user_id")
        .and_then(|num| num.as_i64())
        .map(|num| num as i32) {
            None => return PurchaseInput::InvalidParameters,
            Some(id) => match get_user_by_id(conn, id) {
                Err(_) => return PurchaseInput::InvalidParameters,
                Ok(_) => id,
            }
    };
    let input_desc = match request.get("desc").and_then(|desc| desc.as_str()) {
        None => return PurchaseInput::InvalidParameters,
        Some(desc) => desc,
    };
    let input_amount = match request.get("amount")
        .and_then(|num| num.as_str())
        .and_then(|num_str| num_str.parse::<i32>().ok()) {
            None => return PurchaseInput::InvalidParameters,
            Some(amount) => amount,
    };
    let input_date = match request.get("date").and_then(|input_date| input_date.as_str()) {
        None => return PurchaseInput::InvalidParameters,
        Some(date_str) => date_str.to_string()
    };
    let category_id = match request.get("cat_id")
        .and_then(|num| num.as_str())
        .and_then(|num_str| num_str.parse::<i32>().ok()) {
            None => return PurchaseInput::InvalidCategory,
            Some(category_id) => match get_category_by_id(conn, category_id) {
                Err(_) => return PurchaseInput::InvalidCategory,
                Ok(_) => category_id
            }
    };
    PurchaseInput::Valid(NewPurchase{ user_id: input_user_id, desc: input_desc.to_owned(), amount: input_amount, date: input_date, cat_id: category_id})
}

pub fn check_input_date(input_date: String) -> Option<String> {
    let date_regex = match Regex::new(r"^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$") {
        Err(_) => return None,
        Ok(regex) => regex,
    };
    println!("{}", &input_date);
    if date_regex.is_match(&input_date) {
        Some(input_date)
    } else {
        None
    }
}

pub fn get_purchases_by_month(conn: &mut SqliteConnection) -> Result<Vec<Vec<Purchase>>, diesel::result::Error> {
    // get all purchase dates
    let purchase_dates: Result<Vec<String>, diesel::result::Error> = purchases::table.select(date).load(conn);
    let purchase_dates = match purchase_dates {
        Ok(dates) => dates,
        Err(e) => return Err(e),
    };
    let unique_months: Vec<String> = get_unique_months(purchase_dates);
    let mut ret_vector:Vec<Vec<Purchase>> = Vec::new();
    for year_month in unique_months {
        let cur_month_purchases = get_purchases_by_year_month(conn, year_month);
        match cur_month_purchases {
            Err(_) => continue,
            Ok(mut cur) => {
                cur.sort_by(|a, b|b.cat_id.cmp(&a.cat_id));
                ret_vector.push(cur)
            },
        }
    };
    Ok(ret_vector)
}

pub fn get_purchases_by_month_by_category(conn: &mut SqliteConnection) -> Result<Vec<Vec<Vec<Purchase>>>, diesel::result::Error> {
    let all_purchases = get_purchases_by_month(conn);
    match all_purchases {
        Err(error) => return Err(error),
        Ok(purchases) => {
            let mut res_vec: Vec<Vec<Vec<Purchase>>> = Vec::new();
            for purchase in purchases {
                res_vec.push(sort_purchases_by_category(purchase));
            }
            Ok(res_vec)
        },
    }
}

fn sort_purchases_by_category(purchases: Vec<Purchase>) -> Vec<Vec<Purchase>> {
    let mut sorted_purchases = purchases;
    sorted_purchases.sort_by(|a, b|a.date.cmp(&b.date)); // make sure dates are descending
    let mut purchases_map: HashMap<i32, Vec<Purchase>>  = HashMap::new();
    for purchase in sorted_purchases {
        purchases_map.entry(purchase.cat_id).or_insert_with(Vec::new).push(purchase);
    }
    let mut purchases_by_category = Vec::new();
    for (_, value) in purchases_map {
        purchases_by_category.push(value);
    }
    purchases_by_category
}