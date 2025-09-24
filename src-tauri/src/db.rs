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

    diesel::sql_query("PRAGMA foreign_keys = ON;")
    .execute(&mut conn)
    .expect("Errore nell'attivare i foreign key");

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
        "CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT
        );"
    )
    .execute(&mut conn)
    .expect("Errore creazione tabella sources");

    diesel::sql_query(
        "CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT
        );"
    )
    .execute(&mut conn)
    .expect("Errore creazione tabella products");

    diesel::sql_query(
        "CREATE TABLE IF NOT EXISTS movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            source_id INTEGER NOT NULL,
            weight REAL,
            price REAL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
            FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE RESTRICT
        );"
    )
    .execute(&mut conn)
    .expect("Errore creazione tabella movements");
}