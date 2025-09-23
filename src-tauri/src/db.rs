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
}