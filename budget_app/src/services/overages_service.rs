use crate::models::Purchase;
use crate::utils::{
    overages_utils::*, 
    purchase_utils::get_purchases_by_month_by_category
};
use diesel::sqlite::SqliteConnection;

pub fn get_category_overages(conn: &mut SqliteConnection, category_id: i32) -> Result<Vec<Vec<Purchase>>, diesel::result::Error> {
    let monthly_category_purchases = match get_category_purchases_by_month(conn, category_id) {
        Err(error) => return Err(error),
        Ok(purchases) => purchases,
    };
    let mut monthly_overages: Vec<Vec<Purchase>> = Vec::new();
    for month_purchases in monthly_category_purchases {
        match get_overages_by_category(conn, month_purchases) {
            None => continue,
            Some(overages) => monthly_overages.push(overages),
        }
    };
    Ok(monthly_overages)
}

pub fn get_all_overages(conn: &mut SqliteConnection) -> Result<Vec<Vec<Vec<Purchase>>>, diesel::result::Error> {
    let all_purchases = match get_purchases_by_month_by_category(conn) {
        Err(error) => return Err(error),
        Ok(purchases) => purchases,
    };
    let mut overages_by_month: Vec<Vec<Vec<Purchase>>> = Vec::new();
    for month in all_purchases {
        let mut montly_overages: Vec<Vec<Purchase>> = Vec::new();
        for category in month {
            match get_overages_by_category(conn, category) {
                None => continue,
                Some(overages) => montly_overages.push(overages),
            }
        }
        if !montly_overages.is_empty() {
            overages_by_month.push(montly_overages);
        }
    }
    Ok(overages_by_month)
}