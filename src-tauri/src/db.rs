use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;
use std::env;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL deve essere impostato");
    SqliteConnection::establish(&database_url)
        .expect("Errore connessione al database")
}

pub fn initialize_db() {
    let mut conn = establish_connection();

    diesel::sql_query(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );"
    )
    .execute(&mut conn)
    .expect("Errore creazione tabella users");
}