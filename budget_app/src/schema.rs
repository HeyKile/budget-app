// @generated automatically by Diesel CLI.

diesel::table! {
    categories (id) {
        id -> Integer,
        user_id -> Integer,
        name -> Text,
        budget -> Nullable<Integer>,
    }
}

diesel::table! {
    purchases (id) {
        id -> Integer,
        desc -> Text,
        amount -> Integer,
        date -> Text,
        user_id -> Integer,
        cat_id -> Integer,
    }
}

diesel::table! {
    users (id) {
        id -> Integer,
        username -> Text,
        pw_hash -> Text,
    }
}

diesel::joinable!(categories -> users (user_id));
diesel::joinable!(purchases -> categories (cat_id));
diesel::joinable!(purchases -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    categories,
    purchases,
    users,
);
