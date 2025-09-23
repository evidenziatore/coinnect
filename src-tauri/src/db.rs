use dirs_next;
use std::fs;
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

pub fn establish_connection() -> SqliteConnection {
    // Trova la cartella AppData appropriata
    let appdata_dir = dirs_next::data_dir()
        .unwrap_or_else(|| std::path::PathBuf::from("."))
        .join("coinnect");
    if !appdata_dir.exists() {
        fs::create_dir_all(&appdata_dir).expect("Impossibile creare la cartella dati");
    }
    let db_path = appdata_dir.join("db.sqlite");
    let db_path_str = db_path.to_str().expect("Percorso db non valido");
    SqliteConnection::establish(db_path_str)
        .expect("Errore connessione al database")
}

pub fn initialize_db() {
    let mut conn = establish_connection();

    diesel::sql_query(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );"
    )
    .execute(&mut conn)
    .expect("Errore creazione tabella users");

    diesel::sql_query(
        "CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT
        );"
    )
    .execute(&mut conn)
    .expect("Errore creazione tabella categories");

    diesel::sql_query(
        "CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            weight REAL,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
        );"
    )
    .execute(&mut conn)
    .expect("Errore creazione tabella products");

    diesel::sql_query(
        "CREATE TABLE IF NOT EXISTS movement_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT,
            is_income BOOLEAN NOT NULL CHECK (is_income IN (0,1))
        );"
    )
    .execute(&mut conn)
    .expect("Errore creazione tabella movement_types");

    diesel::sql_query(
        "CREATE TABLE IF NOT EXISTS movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            type_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
            FOREIGN KEY (type_id) REFERENCES movement_types(id) ON DELETE RESTRICT
        );"
    )
    .execute(&mut conn)
    .expect("Errore creazione tabella movements");
}