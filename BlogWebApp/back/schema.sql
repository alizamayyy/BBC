    CREATE DATABASE IF NOT EXISTS text_blog;

    USE text_blog;

    CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );


    DELIMITER $$

    DROP TRIGGER IF EXISTS update_post_updated_at$$
    CREATE TRIGGER update_post_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    BEGIN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END$$

    DROP TRIGGER IF EXISTS update_comment_updated_at$$
    CREATE TRIGGER update_comment_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    BEGIN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END$$

    DELIMITER ;


    CREATE OR REPLACE VIEW most_commented_posts AS
    SELECT posts.*, COUNT(*) AS comment_count
    FROM posts
    INNER JOIN comments ON posts.id = comments.post_id
    GROUP BY posts.id
    ORDER BY comment_count DESC;

    CREATE OR REPLACE VIEW recent_posts AS
    SELECT * FROM posts
    ORDER BY created_at DESC
    LIMIT 10;

    DELIMITER $$

    -- Users
    -- Create User
    DROP PROCEDURE IF EXISTS CreateUser$$
    CREATE PROCEDURE CreateUser(IN username VARCHAR(255), IN password VARCHAR(255))
    BEGIN
        INSERT INTO users (username, password) VALUES (username, password);
    END$$

    -- Get User by ID
    DROP PROCEDURE IF EXISTS GetUserById$$
    CREATE PROCEDURE GetUserById(IN user_id INT)
    BEGIN
        SELECT * FROM users WHERE id = user_id;
    END$$

    -- Get User by Username
    DROP PROCEDURE IF EXISTS GetUserByUsername$$
    CREATE PROCEDURE GetUserByUsername(IN in_username VARCHAR(255))
    BEGIN
        SELECT * FROM users WHERE username = in_username;
    END$$

    -- Update User
    DROP PROCEDURE IF EXISTS UpdateUser$$
    CREATE PROCEDURE UpdateUser(IN user_id INT, IN new_username VARCHAR(255), IN new_password VARCHAR(255))
    BEGIN
        UPDATE users SET username = new_username, password = new_password WHERE id = user_id;
    END$$

    -- Delete User
    DROP PROCEDURE IF EXISTS DeleteUser$$
    CREATE PROCEDURE DeleteUser(IN user_id INT)
    BEGIN
        DELETE FROM users WHERE id = user_id;
    END$$

    -- Get All Users
    DROP PROCEDURE IF EXISTS GetAllUsers$$
    CREATE PROCEDURE GetAllUsers()
    BEGIN
        SELECT * FROM users;
    END$$

    -- Posts
    -- Create Post
    DROP PROCEDURE IF EXISTS CreatePost$$
    CREATE PROCEDURE CreatePost(IN title VARCHAR(255), IN content TEXT, IN user_id INT)
    BEGIN
        INSERT INTO posts (title, content, user_id) VALUES (title, content, user_id);
    END$$

    -- Get Post by ID
    DROP PROCEDURE IF EXISTS GetPostById$$
    CREATE PROCEDURE GetPostById(IN post_id INT)
    BEGIN
        SELECT * FROM posts WHERE id = post_id;
    END$$

    -- Update Post
    DROP PROCEDURE IF EXISTS UpdatePost$$
    CREATE PROCEDURE UpdatePost(IN post_id INT, IN new_title VARCHAR(255), IN new_content TEXT)
    BEGIN
        UPDATE posts SET title = new_title, content = new_content WHERE id = post_id;
    END$$

    -- Delete Post
    DROP PROCEDURE IF EXISTS DeletePost$$
    CREATE PROCEDURE DeletePost(IN post_id INT)
    BEGIN
        DELETE FROM posts WHERE id = post_id;
    END$$

    -- Get All Posts
    DROP PROCEDURE IF EXISTS GetAllPosts$$
    CREATE PROCEDURE GetAllPosts()
    BEGIN
        SELECT * FROM posts;
    END$$

    -- Comments
    -- Create Comment
    DROP PROCEDURE IF EXISTS CreateComment$$
    CREATE PROCEDURE CreateComment(IN post_id INT, IN user_id INT, IN content TEXT)
    BEGIN
        INSERT INTO comments (post_id, user_id, content) VALUES (post_id, user_id, content);
    END$$

    -- Get Comment by ID
    DROP PROCEDURE IF EXISTS GetCommentById$$
    CREATE PROCEDURE GetCommentById(IN comment_id INT)
    BEGIN
        SELECT * FROM comments WHERE id = comment_id;
    END$$

    -- Update Comment
    DROP PROCEDURE IF EXISTS UpdateComment$$
    CREATE PROCEDURE UpdateComment(IN comment_id INT, IN new_content TEXT)
    BEGIN
        UPDATE comments SET content = new_content WHERE id = comment_id;
    END$$

    -- Delete Comment
    DROP PROCEDURE IF EXISTS DeleteComment$$
    CREATE PROCEDURE DeleteComment(IN comment_id INT)
    BEGIN
        DELETE FROM comments WHERE id = comment_id;
    END$$

    -- Get All Comments
    DROP PROCEDURE IF EXISTS GetAllComments$$
    CREATE PROCEDURE GetAllComments()
    BEGIN
        SELECT * FROM comments;
    END$$



    DELIMITER ;

    CREATE OR REPLACE VIEW posts_without_comments AS
    SELECT posts.id AS post_id, posts.title AS post_title, posts.content AS post_content
    FROM comments
    RIGHT JOIN posts ON comments.post_id = posts.id
    WHERE comments.id IS NULL;

    SELECT posts.id AS post_id, posts.title AS post_title, posts.content AS post_content, comments.id AS comment_id, comments.content AS comment_content
    FROM posts
    INNER JOIN comments ON posts.id = comments.post_id
    WHERE posts.user_id = comments.user_id;

    DELIMITER $$

    DROP TRIGGER IF EXISTS delete_post_comments$$
    CREATE TRIGGER delete_post_comments
    AFTER DELETE ON posts
    FOR EACH ROW
    BEGIN
        DELETE FROM comments WHERE post_id = OLD.id;
    END$$

    DELIMITER ;

    CREATE OR REPLACE VIEW posts_authors_comments AS
    SELECT 
        p.id AS post_id, 
        p.title AS post_title, 
        p.content AS post_content, 
        u.username AS author_username, 
        c.id AS comment_id, 
        c.content AS comment_content, 
        c.user_id AS commenter_id
    FROM 
        posts p
    INNER JOIN users u ON p.user_id = u.id
    INNER JOIN comments c ON p.id = c.post_id;
