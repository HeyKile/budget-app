CREATE TABLE purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "desc" VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    cat_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(cat_id) REFERENCES categories(id)
);