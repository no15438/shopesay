CREATE DATABASE IF NOT EXISTS shopping_site;
USE shopping_site;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fullname VARCHAR(100),
    address TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL, -- 评分
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO categories (name, description) VALUES 
('Electronics', 'Electronic gadgets and devices'),
('Clothing', 'Apparel and fashion items'),
('Home Appliances', 'Household appliances and utilities'),
('Furniture', 'Office and home furniture'),
('Toys', 'Toys and games for kids')
ON DUPLICATE KEY UPDATE description=VALUES(description);

INSERT INTO users (username, password, email, fullname, is_admin) VALUES
('admin', '$2b$10$yourhashedpassword', 'admin@example.com', 'Admin User', TRUE),
('johndoe', '$2b$10$hashedpasswordforuser', 'johndoe@example.com', 'John Doe', FALSE),
('janedoe', '$2b$10$hashedpasswordforuser', 'janedoe@example.com', 'Jane Doe', FALSE)
ON DUPLICATE KEY UPDATE email=VALUES(email);

INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('Smartphone', 'Latest model smartphone with advanced features', 699.99, 50, 'smartphone.jpg', 1),
('Laptop', 'High-performance laptop for work and gaming', 1299.99, 30, 'laptop.jpg', 1),
('T-shirt', 'Comfortable cotton t-shirt in various sizes', 19.99, 100, 'tshirt.jpg', 2),
('Air Conditioner', 'Energy-efficient air conditioner for your home', 499.99, 20, 'ac.jpg', 3),
('Desk Chair', 'Ergonomic office chair for long hours', 149.99, 15, 'chair.jpg', 4),
('Toy Robot', 'Interactive toy robot for kids', 29.99, 60, 'toy_robot.jpg', 5)
ON DUPLICATE KEY UPDATE price=VALUES(price), stock=VALUES(stock);

INSERT INTO cart_items (user_id, product_id, quantity) VALUES
(2, 1, 2), -- John Doe added 2 Smartphones
(2, 3, 1), -- John Doe added 1 T-shirt
(3, 4, 1)  -- Jane Doe added 1 Air Conditioner
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);

INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES
(2, 719.97, 'completed', '123 Main Street, Cityville'),
(3, 499.99, 'pending', '456 Elm Street, Townsville')
ON DUPLICATE KEY UPDATE total_amount=VALUES(total_amount);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 699.99), -- Smartphone
(1, 3, 1, 19.99),  -- T-shirt
(2, 4, 1, 499.99); -- Air Conditioner

INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(2, 1, 5, 'Excellent smartphone with great features!'),
(3, 2, 4, 'Laptop is fast, but the battery life could be better.'),
(2, 3, 3, 'The T-shirt is comfortable, but the size runs small.');