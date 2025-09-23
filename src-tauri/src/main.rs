use coinnect_lib::{create_user, db::initialize_db, delete_user, get_users, models::User, update_user};

fn main() {
    initialize_db();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_user, list_users, remove_user, edit_user])
        .run(tauri::generate_context!())
        .expect("Errore durante l'esecuzione dell'app Tauri");
}

#[tauri::command]
fn add_user(name: String, email: Option<String>) {
    create_user(&name, email.as_deref());
}

#[tauri::command]
fn list_users() -> Vec<User> {
    get_users()
}

#[tauri::command]
fn remove_user(id: i32) -> usize {
    delete_user(id)
}

#[tauri::command]
fn edit_user(id: i32, name: Option<String>, email: Option<String>) -> usize {
    update_user(id, name.as_deref(), email.as_deref())
}
