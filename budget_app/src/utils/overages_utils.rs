use crate::{category_service::get_category_by_id, purchase_service::*};
use crate::models::Purchase;
use super::month_utils::get_unique_months;
use diesel::sqlite::SqliteConnection;

pub fn get_category_purchases_by_month(conn: &mut SqliteConnection, category_id: i32) -> Result<Vec<Vec<Purchase>>, diesel::result::Error> {
    match get_category_by_id(conn, category_id) {
        Err(error) => return Err(error),
        Ok(found) => found,
    };
    let purchase_dates = match get_purchase_dates_for_category(conn, category_id) {
        Err(error) => return Err(error),
        Ok(purchase_dates) => purchase_dates,
    };
    let unique_months = get_unique_months(purchase_dates);
    let mut ret_vector: Vec<Vec<Purchase>> = Vec::new();
    for year_month in unique_months {
        // let cur_month_purchases = get_purchases_by_year_month(conn, year_month);
        let cur_month_purchases = get_category_purchases_by_year_by_month(conn, year_month, category_id);
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

pub fn get_overages_by_category(conn: &mut SqliteConnection, purchases: Vec<Purchase>) -> Option<Vec<Purchase>> {
    let purchase = get_category_by_id(conn, purchases[0].cat_id);
    let category_budget = match purchase {
        Err(_) => return None,
        Ok(cat) => match cat.budget {
            None => return None,
            Some(n) => n,
        },
    };
    calc_overages(purchases, category_budget)
}

fn calc_overages(purchases: Vec<Purchase>, category_budget: i32) -> Option<Vec<Purchase>> {
    let mut count: i32 = 0;
    let mut overbudget_purchases = Vec::new();
    for purchase in purchases {
        count += purchase.amount;
        if count > category_budget {
            overbudget_purchases.push(purchase);
        }
    }
    if overbudget_purchases.is_empty() {
        None
    } else {
        Some(overbudget_purchases)
    }
}