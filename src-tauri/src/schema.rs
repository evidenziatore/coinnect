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
        category_id -> Integer,
        weight -> Nullable<Double>,
    }
}

diesel::table! {
    movement_types (id) {
        id -> Integer,
        name -> Text,
        color -> Nullable<Text>,
        is_income -> Bool,
    }
}

diesel::table! {
    movements (id) {
        id -> Integer,
        user_id -> Integer,
        product_id -> Integer,
        type_id -> Integer,
        amount -> Double,
        date -> Nullable<Text>,
    }
}

diesel::joinable!(products -> categories (category_id));
diesel::joinable!(movements -> users (user_id));
diesel::joinable!(movements -> products (product_id));
diesel::joinable!(movements -> movement_types (type_id));

diesel::allow_tables_to_appear_in_same_query!(
    users,
    categories,
    products,
    movement_types,
    movements,
);
