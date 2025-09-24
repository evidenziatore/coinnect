// @generated automatically by Diesel CLI o scritto a mano
diesel::table! {
    users (id) {
        id -> Integer,
        name -> Text,
        email -> Nullable<Text>,
        created_at -> Nullable<Text>,
    }
}

diesel::table! {
    categories (id) {
        id -> Integer,
        name -> Text,
        color -> Nullable<Text>,
    }
}

diesel::table! {
    sources (id) {
        id -> Integer,
        name -> Text,
        color -> Nullable<Text>,
    }
}

diesel::table! {
    products (id) {
        id -> Integer,
        name -> Text,
        color -> Nullable<Text>,
    }
}

diesel::table! {
    movements (id) {
        id -> Integer,
        user_id -> Integer,
        product_id -> Integer,
        category_id -> Integer,
        source_id -> Integer,
        weight -> Nullable<Double>,
        price -> Nullable<Double>,
        date -> Nullable<Text>,
    }
}

// Definizione delle relazioni (joinable!)
diesel::joinable!(movements -> users (user_id));
diesel::joinable!(movements -> products (product_id));
diesel::joinable!(movements -> categories (category_id));
diesel::joinable!(movements -> sources (source_id));

diesel::allow_tables_to_appear_in_same_query!(
    users,
    categories,
    sources,
    products,
    movements,
);