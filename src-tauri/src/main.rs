#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use coinnect_lib::{
    db::initialize_db,
    models::{User, Category, Source, Product, Movement},
    create_user, get_users, get_user_by_id, delete_user, update_user,
    create_category, get_categories, get_category_by_id, delete_category, update_category,
    create_source, get_sources, get_source_by_id, delete_source, update_source,
    create_product, get_products, get_product_by_id, delete_product, update_product,
    create_movement, get_movements, get_movements_by_user, delete_movement, update_movement
};
use tauri::Manager;

// ---------------- USERS ----------------
#[tauri::command]
fn add_user(name: String, email: Option<String>) {
    create_user(&name, email.as_deref());
}

#[tauri::command]
fn list_users() -> Vec<User> {
    get_users()
}

#[tauri::command]
fn get_user_by_id_cmd(id: i32) -> Option<User> {
    get_user_by_id(id)
}

#[tauri::command]
fn remove_user(id: i32) -> usize {
    delete_user(id)
}

#[tauri::command]
fn edit_user(id: i32, name: Option<String>, email: Option<String>) -> usize {
    update_user(id, name.as_deref(), email.as_deref())
}

// ---------------- CATEGORIES ----------------
#[tauri::command]
fn add_category(name: String, color: Option<String>) {
    create_category(&name, color.as_deref());
}

#[tauri::command]
fn list_categories() -> Vec<Category> {
    get_categories()
}

#[tauri::command]
fn get_category_by_id_cmd(id: i32) -> Option<Category> {
    get_category_by_id(id)
}

#[tauri::command]
fn remove_category(id: i32) -> usize {
    delete_category(id)
}

#[tauri::command]
fn edit_category(id: i32, name: Option<String>, color: Option<String>) -> usize {
    update_category(id, name.as_deref(), color.as_deref())
}

// ---------------- SOURCES ----------------
#[tauri::command]
fn add_source(name: String, color: Option<String>) {
    create_source(&name, color.as_deref());
}

#[tauri::command]
fn list_sources() -> Vec<Source> {
    get_sources()
}

#[tauri::command]
fn get_source_by_id_cmd(id: i32) -> Option<Source> {
    get_source_by_id(id)
}

#[tauri::command]
fn remove_source(id: i32) -> usize {
    delete_source(id)
}

#[tauri::command]
fn edit_source(id: i32, name: Option<String>, color: Option<String>) -> usize {
    update_source(id, name.as_deref(), color.as_deref())
}

// ---------------- PRODUCTS ----------------
#[tauri::command]
fn add_product(name: String, color: Option<String>) {
    create_product(&name, color.as_deref());
}

#[tauri::command]
fn list_products() -> Vec<Product> {
    get_products()
}

#[tauri::command]
fn get_product_by_id_cmd(id: i32) -> Option<Product> {
    get_product_by_id(id)
}

#[tauri::command]
fn remove_product(id: i32) -> usize {
    delete_product(id)
}

#[tauri::command]
fn edit_product(id: i32, name: Option<String>, color: Option<String>) -> usize {
    update_product(id, name.as_deref(), color.as_deref())
}

// ---------------- MOVEMENTS ----------------
#[tauri::command]
fn add_movement(user_id: i32, product_id: i32, category_id: i32, source_id: i32, weight: Option<f64>, price: Option<f64>) {
    create_movement(user_id, product_id, category_id, source_id, weight, price);
}

#[tauri::command]
fn list_movements() -> Vec<Movement> {
    get_movements()
}

#[tauri::command]
fn list_movements_by_user(user_id: i32) -> Vec<Movement> {
    get_movements_by_user(user_id)
}

#[tauri::command]
fn remove_movement(id: i32) -> usize {
    delete_movement(id)
}

#[tauri::command]
fn edit_movement(id: i32, weight: Option<f64>, price: Option<f64>) -> usize {
    update_movement(id, weight, price)
}

// ---------------- MAIN ----------------
fn main() {
    initialize_db();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // USERS
            add_user,
            list_users,
            get_user_by_id_cmd,
            remove_user,
            edit_user,
            // CATEGORIES
            add_category,
            list_categories,
            get_category_by_id_cmd,
            remove_category,
            edit_category,
            // SOURCES
            add_source,
            list_sources,
            get_source_by_id_cmd,
            remove_source,
            edit_source,
            // PRODUCTS
            add_product,
            list_products,
            get_product_by_id_cmd,
            remove_product,
            edit_product,
            // MOVEMENTS
            add_movement,
            list_movements,
            list_movements_by_user,
            remove_movement,
            edit_movement,
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
