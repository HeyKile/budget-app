use crate::models::{User, NewUser};
use crate::schema::*;
use crate::schema::users::id;
use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;

use self::users::{pw_hash, username};

pub fn create_user(conn: &mut SqliteConnection, new_user: NewUser) -> Result<usize, diesel::result::Error> {
    diesel::insert_into(users::table)
        .values(new_user)
        .execute(conn)
}

pub fn get_user_by_id(conn: &mut SqliteConnection, user_id: i32) -> Result<User, diesel::result::Error> {
    users::table.find(user_id).first(conn)
}

pub fn delete_user(conn: &mut SqliteConnection, target_user_id: i32) -> Result<usize, diesel::result::Error> {
    diesel::delete(users::table.filter(id.eq(target_user_id))).execute(conn)
}

pub fn get_user_by_credentials(conn: &mut SqliteConnection, input_username: String, input_pw: String) -> Result<User, diesel::result::Error> {
    users::table.find(id)
        .filter(username.eq(input_username))
        .filter(pw_hash.eq(input_pw))
        .first(conn)
}

pub fn get_user_by_username(conn: &mut SqliteConnection, target_username: &str) -> Result<User, diesel::result::Error> {
    users::table.filter(username.eq(target_username)).first(conn)
}

pub fn get_users(conn: &mut SqliteConnection) -> Result<Vec<User>, diesel::result::Error> {
    users::table.load(conn)
}