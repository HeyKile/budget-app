use crate::models::{User, NewUser};
use crate::schema::*;
use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;

pub fn create_user(conn: &mut SqliteConnection, new_user: NewUser) -> Result<usize, diesel::result::Error> {
    diesel::insert_into(users::table)
        .values(new_user)
        .execute(conn)
}