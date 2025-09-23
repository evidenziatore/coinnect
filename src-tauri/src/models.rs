use serde::{Serialize, Deserialize};
use diesel::prelude::*;
use crate::schema::*;

// ---------------- USERS ----------------
#[derive(Queryable, Serialize)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: Option<String>,
    pub created_at: Option<String>, // SQLite salva le date come testo
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub name: String,
    pub email: Option<String>,
    pub created_at: Option<String>,
}

// ---------------- CATEGORIES ----------------
#[derive(Queryable, Serialize)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub color: Option<String>,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = categories)]
pub struct NewCategory {
    pub name: String,
    pub color: Option<String>,
}

// ---------------- PRODUCTS ----------------
#[derive(Queryable, Serialize)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub category_id: i32,
    pub weight: Option<f64>,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = products)]
pub struct NewProduct {
    pub name: String,
    pub category_id: i32,
    pub weight: Option<f64>,
}

// ---------------- MOVEMENT TYPES ----------------
#[derive(Queryable, Serialize)]
pub struct MovementType {
    pub id: i32,
    pub name: String,
    pub color: Option<String>,
    pub is_income: bool,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = movement_types)]
pub struct NewMovementType {
    pub name: String,
    pub color: Option<String>,
    pub is_income: bool,
}

// ---------------- MOVEMENTS ----------------
#[derive(Queryable, Serialize)]
pub struct Movement {
    pub id: i32,
    pub user_id: i32,
    pub product_id: i32,
    pub type_id: i32,
    pub amount: f64,
    pub date: Option<String>,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = movements)]
pub struct NewMovement {
    pub user_id: i32,
    pub product_id: i32,
    pub type_id: i32,
    pub amount: f64,
    pub date: Option<String>,
}
