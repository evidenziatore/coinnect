pub mod db;
pub mod models;
pub mod schema;

use diesel::prelude::*;
use crate::db::establish_connection;
use crate::models::{User, NewUser};
use crate::schema::users;

pub fn create_user(name: &str) -> usize {
    let mut conn = establish_connection(); 
    let new_user = NewUser { name: name.to_string() };

    diesel::insert_into(users::table)
        .values(&new_user)
        .execute(&mut conn) 
        .expect("Errore inserimento utente")
}

pub fn get_users() -> Vec<User> {
    let mut conn = establish_connection();
    users::table
        .load::<User>(&mut conn) 
        .expect("Errore lettura utenti")
}