use std::collections::HashSet;

pub fn get_unique_months(purchase_dates: Vec<String>) -> Vec<String> {
    let unique_months: Vec<String> = purchase_dates
        .into_iter()
        .filter_map(|date_string| {
            let mut temp = date_string.clone();
            if temp.len() >= 10 && temp.is_char_boundary(8) && temp.is_char_boundary(10) {
                temp.replace_range(8..10, "%%");
                Some(temp)
            } else {
                None
            }
        })
        .collect::<HashSet<String>>()
        .into_iter()
        .collect();
    unique_months
}