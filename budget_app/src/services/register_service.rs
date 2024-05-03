use crate::models::{User, NewUser};
use crate::schema::*;
use crate::schema::users::id;
use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;

// pub fn register_user() -