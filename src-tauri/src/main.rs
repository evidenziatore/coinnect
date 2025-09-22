use coinnect_lib::{create_user, db::initialize_db, get_users, models::User};

fn main() {
    initialize_db();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_user, list_users])
        .run(tauri::generate_context!())
        .expect("Errore durante l'esecuzione dell'app Tauri");
}

#[tauri::command]
fn add_user(name: String) {
    create_user(&name);
}

#[tauri::command]
fn list_users() -> Vec<User> {
    get_users()
}