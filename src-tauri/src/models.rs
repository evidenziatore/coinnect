use serde::{Serialize, Deserialize};
use diesel::prelude::*;
use crate::schema::*;

// ---------------- USERS ----------------
#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: Option<String>,
    pub created_at: Option<String>,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub name: String,
    pub email: Option<String>,
    pub created_at: Option<String>,
}

// ---------------- CATEGORIES ----------------
#[derive(Queryable, Serialize, Deserialize, Debug)]
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

// ---------------- SOURCES ----------------
#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Source {
    pub id: i32,
    pub name: String,
    pub color: Option<String>,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = sources)]
pub struct NewSource {
    pub name: String,
    pub color: Option<String>,
}

// ---------------- PRODUCTS ----------------
#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub color: Option<String>,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = products)]
pub struct NewProduct {
    pub name: String,
    pub color: Option<String>,
}

// ---------------- MOVEMENTS ----------------
#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Movement {
    pub id: i32,
    pub user_id: i32,
    pub product_id: i32,
    pub category_id: i32,
    pub source_id: i32,
    pub weight: Option<f64>,
    pub price: Option<f64>,
    pub date: Option<String>,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = movements)]
pub struct NewMovement {
    pub user_id: i32,
    pub product_id: i32,
    pub category_id: i32,
    pub source_id: i32,
    pub weight: Option<f64>,
    pub price: Option<f64>,
    pub date: Option<String>,
}