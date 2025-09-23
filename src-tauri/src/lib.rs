pub mod db;
pub mod models;
pub mod schema;

use diesel::prelude::*;
use crate::db::establish_connection;
use crate::models::*;
use crate::schema::*;

// ---------------- USERS ----------------
#[derive(AsChangeset)]
#[diesel(table_name = users)]
pub struct UpdateUser<'a> {
    pub name: Option<&'a str>,
    pub email: Option<&'a str>,
}

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
    users::table.load::<User>(&mut conn).expect("Errore lettura utenti")
}

pub fn delete_user(user_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(users::table.filter(users::id.eq(user_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione utente")
}

pub fn update_user(user_id: i32, new_name: Option<&str>, new_email: Option<&str>) -> usize {
    let mut conn = establish_connection();
    let changes = UpdateUser { name: new_name, email: new_email };
    diesel::update(users::table.filter(users::id.eq(user_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento utente")
}

// ---------------- CATEGORIES ----------------
#[derive(AsChangeset)]
#[diesel(table_name = categories)]
pub struct UpdateCategory<'a> {
    pub name: Option<&'a str>,
    pub color: Option<&'a str>,
}

pub fn create_category(name: &str, color: Option<&str>) -> usize {
    let mut conn = establish_connection();
    let new_category = NewCategory { name: name.to_string(), color: color.map(|s| s.to_string()) };
    diesel::insert_into(categories::table)
        .values(&new_category)
        .execute(&mut conn)
        .expect("Errore inserimento categoria")
}

pub fn get_categories() -> Vec<Category> {
    let mut conn = establish_connection();
    categories::table.load::<Category>(&mut conn).expect("Errore lettura categorie")
}

pub fn get_category_by_id(category_id: i32) -> Option<Category> {
    let mut conn = establish_connection();
    categories::table
        .filter(categories::id.eq(category_id))
        .first::<Category>(&mut conn)
        .ok() // restituisce Some(Category) se trovato, None altrimenti
}

pub fn delete_category(category_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(categories::table.filter(categories::id.eq(category_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione categoria")
}

pub fn update_category(category_id: i32, new_name: Option<&str>, new_color: Option<&str>) -> usize {
    let mut conn = establish_connection();
    let changes = UpdateCategory { name: new_name, color: new_color };
    diesel::update(categories::table.filter(categories::id.eq(category_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento categoria")
}

// ---------------- PRODUCTS ----------------
#[derive(AsChangeset)]
#[diesel(table_name = products)]
pub struct UpdateProduct<'a> {
    pub name: Option<&'a str>,
    pub category_id: Option<i32>,
    pub weight: Option<f64>,
}

pub fn create_product(name: &str, category_id: i32, weight: Option<f64>) -> usize {
    let mut conn = establish_connection();
    let new_product = NewProduct { name: name.to_string(), category_id, weight };
    diesel::insert_into(products::table)
        .values(&new_product)
        .execute(&mut conn)
        .expect("Errore inserimento prodotto")
}

pub fn get_products() -> Vec<Product> {
    let mut conn = establish_connection();
    products::table.load::<Product>(&mut conn).expect("Errore lettura prodotti")
}

pub fn get_product_by_id(product_id: i32) -> Option<Product> {
    let mut conn = establish_connection();
    products::table
        .filter(products::id.eq(product_id))
        .first::<Product>(&mut conn)
        .ok()
}

pub fn delete_product(product_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(products::table.filter(products::id.eq(product_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione prodotto")
}

pub fn update_product(product_id: i32, new_name: Option<&str>, new_category_id: Option<i32>, new_weight: Option<f64>) -> usize {
    let mut conn = establish_connection();
    let changes = UpdateProduct { name: new_name, category_id: new_category_id, weight: new_weight };
    diesel::update(products::table.filter(products::id.eq(product_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento prodotto")
}

// ---------------- MOVEMENT TYPES ----------------
#[derive(AsChangeset)]
#[diesel(table_name = movement_types)]
pub struct UpdateMovementType<'a> {
    pub name: Option<&'a str>,
    pub color: Option<&'a str>,
    pub is_income: Option<bool>,
}

pub fn create_movement_type(name: &str, color: Option<&str>, is_income: bool) -> usize {
    let mut conn = establish_connection();
    let new_type = NewMovementType { name: name.to_string(), color: color.map(|s| s.to_string()), is_income };
    diesel::insert_into(movement_types::table)
        .values(&new_type)
        .execute(&mut conn)
        .expect("Errore inserimento tipo movimento")
}

pub fn get_movement_types() -> Vec<MovementType> {
    let mut conn = establish_connection();
    movement_types::table.load::<MovementType>(&mut conn).expect("Errore lettura tipi movimento")
}

pub fn get_movement_type_by_id(type_id: i32) -> Option<MovementType> {
    let mut conn = establish_connection();
    movement_types::table
        .filter(movement_types::id.eq(type_id))
        .first::<MovementType>(&mut conn)
        .ok()
}

pub fn delete_movement_type(type_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(movement_types::table.filter(movement_types::id.eq(type_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione tipo movimento")
}

pub fn update_movement_type(type_id: i32, new_name: Option<&str>, new_color: Option<&str>, new_is_income: Option<bool>) -> usize {
    let mut conn = establish_connection();
    let changes = UpdateMovementType { name: new_name, color: new_color, is_income: new_is_income };
    diesel::update(movement_types::table.filter(movement_types::id.eq(type_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento tipo movimento")
}

// ---------------- MOVEMENTS ----------------
#[derive(AsChangeset)]
#[diesel(table_name = movements)]
pub struct UpdateMovement<'a> {
    pub user_id: Option<i32>,
    pub product_id: Option<i32>,
    pub type_id: Option<i32>,
    pub amount: Option<f64>,
    pub date: Option<&'a str>,
}

pub fn create_movement(user_id: i32, product_id: i32, type_id: i32, amount: f64, date: Option<&str>) -> usize {
    let mut conn = establish_connection();
    let new_movement = NewMovement { user_id, product_id, type_id, amount, date: date.map(|s| s.to_string()) };
    diesel::insert_into(movements::table)
        .values(&new_movement)
        .execute(&mut conn)
        .expect("Errore inserimento movimento")
}

pub fn get_movements() -> Vec<Movement> {
    let mut conn = establish_connection();
    movements::table.load::<Movement>(&mut conn).expect("Errore lettura movimenti")
}

pub fn get_movements_by_user(user_id: i32) -> Vec<Movement> {
    let mut conn = establish_connection();
    movements::table
        .filter(movements::user_id.eq(user_id))
        .load::<Movement>(&mut conn)
        .expect("Errore lettura movimenti per utente")
}

pub fn delete_movement(movement_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(movements::table.filter(movements::id.eq(movement_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione movimento")
}

pub fn update_movement(movement_id: i32, new_user_id: Option<i32>, new_product_id: Option<i32>, new_type_id: Option<i32>, new_amount: Option<f64>, new_date: Option<&str>) -> usize {
    let mut conn = establish_connection();
    let changes = UpdateMovement {
        user_id: new_user_id,
        product_id: new_product_id,
        type_id: new_type_id,
        amount: new_amount,
        date: new_date,
    };
    diesel::update(movements::table.filter(movements::id.eq(movement_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento movimento")
}
