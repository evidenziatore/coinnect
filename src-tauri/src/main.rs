#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use coinnect_lib::{db::initialize_db,
    models::{Category, Movement, MovementType, Product, Source, User},
};
use tauri::Manager;

fn main() {
    initialize_db();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            add_user,
            list_users,
            remove_user,
            edit_user,
            add_category,
            list_categories,
            remove_category,
            edit_category,
            add_product,
            list_products,
            remove_product,
            edit_product,
            add_movement_type,
            list_movement_types,
            remove_movement_type,
            edit_movement_type,
            add_movement,
            list_movements,
            remove_movement,
            edit_movement,
            get_category_by_id,
            get_product_by_id,
            get_movement_type_by_id,
            get_movements_by_user,
            get_source_by_id,
            add_source,
            list_sources,
            remove_source,
            edit_source
        ])
        .setup(|app| {
            let version = env!("CARGO_PKG_VERSION"); // legge la versione da Cargo.toml
            let title = format!("coinnect {}", version);

            if let Some(window) = app.handle().get_webview_window("main") {
                window.set_title(&title).unwrap();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Errore durante l'esecuzione dell'app Tauri");
}

// ---------------- USERS ----------------
#[tauri::command]
fn add_user(name: String, email: Option<String>) {
    coinnect_lib::create_user(&name, email.as_deref());
}

#[tauri::command]
fn list_users() -> Vec<User> {
    coinnect_lib::get_users()
}

#[tauri::command]
fn remove_user(id: i32) -> usize {
    coinnect_lib::delete_user(id)
}

#[tauri::command]
fn edit_user(id: i32, name: Option<String>, email: Option<String>) -> usize {
    coinnect_lib::update_user(id, name.as_deref(), email.as_deref())
}

// ---------------- CATEGORIES ----------------
#[tauri::command]
fn add_category(name: String, color: Option<String>) {
    coinnect_lib::create_category(&name, color.as_deref());
}

#[tauri::command]
fn list_categories() -> Vec<Category> {
    coinnect_lib::get_categories()
}

#[tauri::command]
fn get_category_by_id(categoryid: i32) -> Option<Category> {
    coinnect_lib::get_category_by_id(categoryid)
}

#[tauri::command]
fn remove_category(id: i32) -> usize {
    coinnect_lib::delete_category(id)
}

#[tauri::command]
fn edit_category(id: i32, name: Option<String>, color: Option<String>) -> usize {
    coinnect_lib::update_category(id, name.as_deref(), color.as_deref())
}

// ---------------- SOURCES ----------------
#[tauri::command]
fn add_source(name: String, color: Option<String>) {
    coinnect_lib::create_source(&name, color.as_deref());
}

#[tauri::command]
fn list_sources() -> Vec<Source> {
    coinnect_lib::get_sources()
}

#[tauri::command]
fn get_source_by_id(sourceid: i32) -> Option<Source> {
    coinnect_lib::get_source_by_id(sourceid)
}

#[tauri::command]
fn remove_source(id: i32) -> usize {
    coinnect_lib::delete_source(id)
}

#[tauri::command]
fn edit_source(id: i32, name: Option<String>, color: Option<String>) -> usize {
    coinnect_lib::update_source(id, name.as_deref(), color.as_deref())
}

// ---------------- PRODUCTS ----------------
#[tauri::command]
fn add_product(name: String, categoryid: i32, weight: Option<f64>) {
    coinnect_lib::create_product(&name, categoryid, weight);
}

#[tauri::command]
fn list_products() -> Vec<Product> {
    coinnect_lib::get_products()
}

#[tauri::command]
fn get_product_by_id(productid: i32) -> Option<Product> {
    coinnect_lib::get_product_by_id(productid)
}

#[tauri::command]
fn remove_product(id: i32) -> usize {
    coinnect_lib::delete_product(id)
}

#[tauri::command]
fn edit_product(id: i32, name: Option<String>, categoryid: Option<i32>, weight: Option<f64>) -> usize {
    coinnect_lib::update_product(id, name.as_deref(), categoryid, weight)
}

// ---------------- MOVEMENT TYPES ----------------
#[tauri::command]
fn add_movement_type(name: String, color: Option<String>, isincome: bool) {
    coinnect_lib::create_movement_type(&name, color.as_deref(), isincome);
}

#[tauri::command]
fn list_movement_types() -> Vec<MovementType> {
    coinnect_lib::get_movement_types()
}

#[tauri::command]
fn get_movement_type_by_id(typeid: i32) -> Option<MovementType> {
    coinnect_lib::get_movement_type_by_id(typeid)
}

#[tauri::command]
fn remove_movement_type(id: i32) -> usize {
    coinnect_lib::delete_movement_type(id)
}

#[tauri::command]
fn edit_movement_type(id: i32, name: Option<String>, color: Option<String>, isincome: Option<bool>) -> usize {
    coinnect_lib::update_movement_type(id, name.as_deref(), color.as_deref(), isincome)
}

// ---------------- MOVEMENTS ----------------
#[tauri::command]
fn add_movement(userid: i32, productid: i32, typeid: i32, amount: f64, date: Option<String>) {
    coinnect_lib::create_movement(userid, productid, typeid, amount, date.as_deref());
}

#[tauri::command]
fn list_movements() -> Vec<Movement> {
    coinnect_lib::get_movements()
}

#[tauri::command]
fn get_movements_by_user(userid: i32) -> Vec<Movement> {
    coinnect_lib::get_movements_by_user(userid)
}

#[tauri::command]
fn remove_movement(id: i32) -> usize {
    coinnect_lib::delete_movement(id)
}

#[tauri::command]
fn edit_movement(id: i32, userid: Option<i32>, productid: Option<i32>, typeid: Option<i32>, amount: Option<f64>, date: Option<String>) -> usize {
    coinnect_lib::update_movement(id, userid, productid, typeid, amount, date.as_deref())
}