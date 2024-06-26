CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE book_idea (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_path TEXT,
    image_discription TEXT,
    story TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

DROP TABLE book_idea;
