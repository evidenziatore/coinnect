pub mod db;
pub mod models;
pub mod schema;

use diesel::prelude::*;
use crate::db::establish_connection;
use crate::models::*;
use crate::schema::*;

// ---------------- USERS ----------------
pub fn create_user(name: &str, email: Option<&str>) -> usize {
    let mut conn = establish_connection();
    let new_user = NewUser {
        name: name.to_string(),
        email: email.map(|s| s.to_string()),
        created_at: None,
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

pub fn get_user_by_id(user_id: i32) -> Option<User> {
    let mut conn = establish_connection();
    users::table.filter(users::id.eq(user_id))
        .first::<User>(&mut conn)
        .ok()
}

pub fn delete_user(user_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(users::table.filter(users::id.eq(user_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione utente")
}

pub fn update_user(user_id: i32, new_name: Option<&str>, new_email: Option<&str>) -> usize {
    #[derive(AsChangeset)]
    #[diesel(table_name = users)]
    struct UpdateUser<'a> {
        name: Option<&'a str>,
        email: Option<&'a str>,
    }

    let mut conn = establish_connection();
    let changes = UpdateUser { name: new_name, email: new_email };
    diesel::update(users::table.filter(users::id.eq(user_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento utente")
}

// ---------------- CATEGORIES ----------------
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
    categories::table.filter(categories::id.eq(category_id))
        .first::<Category>(&mut conn)
        .ok()
}

pub fn delete_category(category_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(categories::table.filter(categories::id.eq(category_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione categoria")
}

pub fn update_category(category_id: i32, new_name: Option<&str>, new_color: Option<&str>) -> usize {
    #[derive(AsChangeset)]
    #[diesel(table_name = categories)]
    struct UpdateCategory<'a> {
        name: Option<&'a str>,
        color: Option<&'a str>,
    }

    let mut conn = establish_connection();
    let changes = UpdateCategory { name: new_name, color: new_color };
    diesel::update(categories::table.filter(categories::id.eq(category_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento categoria")
}

// ---------------- SOURCES ----------------
pub fn create_source(name: &str, color: Option<&str>) -> usize {
    let mut conn = establish_connection();
    let new_source = NewSource { name: name.to_string(), color: color.map(|s| s.to_string()) };
    diesel::insert_into(sources::table)
        .values(&new_source)
        .execute(&mut conn)
        .expect("Errore inserimento source")
}

pub fn get_sources() -> Vec<Source> {
    let mut conn = establish_connection();
    sources::table.load::<Source>(&mut conn).expect("Errore lettura sources")
}

pub fn get_source_by_id(source_id: i32) -> Option<Source> {
    let mut conn = establish_connection();
    sources::table.filter(sources::id.eq(source_id))
        .first::<Source>(&mut conn)
        .ok()
}

pub fn delete_source(source_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(sources::table.filter(sources::id.eq(source_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione source")
}

pub fn update_source(source_id: i32, new_name: Option<&str>, new_color: Option<&str>) -> usize {
    #[derive(AsChangeset)]
    #[diesel(table_name = sources)]
    struct UpdateSource<'a> {
        name: Option<&'a str>,
        color: Option<&'a str>,
    }

    let mut conn = establish_connection();
    let changes = UpdateSource { name: new_name, color: new_color };
    diesel::update(sources::table.filter(sources::id.eq(source_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento source")
}

// ---------------- PRODUCTS ----------------
pub fn create_product(name: &str, color: Option<&str>) -> usize {
    let mut conn = establish_connection();
    let new_product = NewProduct { name: name.to_string(), color: color.map(|s| s.to_string()) };
    diesel::insert_into(products::table)
        .values(&new_product)
        .execute(&mut conn)
        .expect("Errore inserimento product")
}

pub fn get_products() -> Vec<Product> {
    let mut conn = establish_connection();
    products::table.load::<Product>(&mut conn).expect("Errore lettura products")
}

pub fn get_product_by_id(product_id: i32) -> Option<Product> {
    let mut conn = establish_connection();
    products::table.filter(products::id.eq(product_id))
        .first::<Product>(&mut conn)
        .ok()
}

pub fn delete_product(product_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(products::table.filter(products::id.eq(product_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione product")
}

pub fn update_product(product_id: i32, new_name: Option<&str>, new_color: Option<&str>) -> usize {
    #[derive(AsChangeset)]
    #[diesel(table_name = products)]
    struct UpdateProduct<'a> {
        name: Option<&'a str>,
        color: Option<&'a str>,
    }

    let mut conn = establish_connection();
    let changes = UpdateProduct { name: new_name, color: new_color };
    diesel::update(products::table.filter(products::id.eq(product_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento product")
}

// ---------------- MOVEMENTS ----------------
pub fn create_movement(user_id: i32, product_id: i32, category_id: i32, source_id: i32, weight: Option<f64>, price: Option<f64>, date: Option<String>) -> usize {
    let mut conn = establish_connection();
    let new_movement = NewMovement {
        user_id,
        product_id,
        category_id,
        source_id,
        weight,
        price,
        date,
    };
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
    movements::table.filter(movements::user_id.eq(user_id))
        .load::<Movement>(&mut conn)
        .expect("Errore lettura movimenti per utente")
}

pub fn delete_movement(movement_id: i32) -> usize {
    let mut conn = establish_connection();
    diesel::delete(movements::table.filter(movements::id.eq(movement_id)))
        .execute(&mut conn)
        .expect("Errore eliminazione movimento")
}

pub fn update_movement(
    movement_id: i32,
    product_id: i32,
    category_id: i32,
    source_id: i32,
    weight: Option<f64>,
    price: Option<f64>,
    date: Option<String>
) -> usize {
    #[derive(AsChangeset)]
    #[diesel(table_name = movements)]
    struct UpdateMovement {
        product_id: i32,
        category_id: i32,
        source_id: i32,
        weight: Option<f64>,
        price: Option<f64>,
        date: Option<String>,
    }

    let mut conn = establish_connection();
    let changes = UpdateMovement {
        product_id,
        category_id,
        source_id,
        weight,
        price,
        date,
    };

    diesel::update(movements::table.filter(movements::id.eq(movement_id)))
        .set(changes)
        .execute(&mut conn)
        .expect("Errore aggiornamento movimento")
}
