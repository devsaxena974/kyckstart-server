CREATE TABLE businesses (
    business_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(200),
    phone VARCHAR(20),
    address VARCHAR(500),
    city VARCHAR(250),
    state VARCHAR(250),
    country VARCHAR(250),
    email VARCHAR(255),
    description VARCHAR(1000),
    image_path VARCHAR(1000),
    num_members integer DEFAULT 0,
    website VARCHAR(1000)
);

CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    email VARCHAR(500),
    business VARCHAR(500)
);

CREATE TABLE users (
    email_id SERIAL PRIMARY KEY,
    email VARCHAR(500),
    user_type VARCHAR(100)
);