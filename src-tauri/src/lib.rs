pub mod db;
pub mod models;
pub mod schema;

use diesel::prelude::*;
use crate::db::establish_connection;
use crate::models::{User, NewUser};
use crate::schema::users;

pub fn create_user(name: &str, email: Option<&str>) -> usize {
    let mut conn = establish_connection(); 

    let new_user = NewUser {
        name: name.to_string(),
        email: email.map(|s| s.to_string()), // email opzionale
        created_at: None, // lascia che SQLite metta CURRENT_TIMESTAMP
    };

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

pub fn delete_user(user_id: i32) -> usize {
    let mut conn = establish_connection();

    diesel::delete(users::table.filter(users::id.eq(user_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione utente")
}

pub fn update_user(user_id: i32, new_name: Option<&str>, new_email: Option<&str>) -> usize {
    let mut conn = establish_connection();

    diesel::update(users::table.filter(users::id.eq(user_id)))
        .set((
            new_name.map(|name| users::name.eq(name)),
            new_email.map(|email| users::email.eq(email)),
        ))
        .execute(&mut conn)
        .expect("Errore aggiornamento utente")
}