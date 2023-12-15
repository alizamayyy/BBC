from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

def create_connection():
    try:
        db = pymysql.connect(
            host="localhost", user="root", password="root", db="text_blog"
        )
        return db
    except pymysql.Error as e:
        print("Connection failed:", e)
        return None

class User:
    def __init__(self, username, password, id=None):
        self.id = id
        self.username = username
        self.password = password

    def save(self):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("CreateUser", (self.username, self.password))
            db.commit()
        except pymysql.Error as e:
            print("Query failed:", e)

    @classmethod
    def get_by_id(cls, user_id):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("GetUserById", (user_id,))
            user_data = cursor.fetchone()
            if user_data:
                return cls(user_data[1], user_data[2], user_data[0])
            return None
        except pymysql.Error as e:
            print("Query failed:", e)

    def update(self, new_username, new_password):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("UpdateUser", (self.id, new_username, new_password))
            db.commit()
        except pymysql.Error as e:
            print("Query failed:", e)

    def delete(self):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("DeleteUser", (self.id,))
            db.commit()
        except pymysql.Error as e:
            print("Query failed:", e)

    @classmethod
    def get_all(cls):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("GetAllUsers")
            users_data = cursor.fetchall()
            users = [
                {"id": user[0], "username": user[1], "password": user[2]}
                for user in users_data
            ]
            return users
        except pymysql.Error as e:
            print("Query failed:", e)

    @classmethod
    def login(cls, username, password):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("GetUserByUsername", (username,))
            user_data = cursor.fetchone()
            if user_data and user_data[2] == password:
                return cls(user_data[1], user_data[2], user_data[0])
            return None
        except pymysql.Error as e:
            print("Query failed:", e)

    @classmethod
    def get_post_count_by_user_id(cls, user_id):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("GetPostCountByUserId", (user_id,))
            post_count = cursor.fetchone()[0]
            return post_count
        except pymysql.Error as e:
            print("Query failed:", e)

    @classmethod
    def get_all_posts_by_user_id(cls, user_id):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("GetAllPostsByUserId", (user_id,))
            posts_data = cursor.fetchall()
            posts = [
                {
                    "id": post[0],
                    "title": post[1],
                    "content": post[2],
                    "user_id": post[3],
                    "created_at": post[4],
                    "updated_at": post[5],
                }
                for post in posts_data
            ]
            return posts
        except pymysql.Error as e:
            print("Query failed:", e)
    

class Post:
    def __init__(self, title, content, user_id, id=None):
        self.id = id
        self.title = title
        self.content = content
        self.user_id = user_id

    def save(self):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("CreatePost", (self.title, self.content, self.user_id))
            db.commit()
        except pymysql.Error as e:
            print("Query failed:", e)

    @classmethod
    def get_by_id(cls, post_id):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("GetPostById", (post_id,))
            post_data = cursor.fetchone()
            if post_data:
                return cls(post_data[1], post_data[2], post_data[3], post_data[0])
            return None
        except pymysql.Error as e:
            print("Query failed:", e)

    def update(self, new_title, new_content):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("UpdatePost", (self.id, new_title, new_content))
            db.commit()
        except pymysql.Error as e:
            print("Query failed:", e)

    def delete(self):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("DeletePost", (self.id,))
            db.commit()
        except pymysql.Error as e:
            print("Query failed:", e)

    @classmethod
    def get_all(cls):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("GetAllPosts")
            posts_data = cursor.fetchall()
            posts = [
                {
                    "id": post[0],
                    "title": post[1],
                    "content": post[2],
                    "user_id": post[3],
                    "created_at": post[4],
                    "updated_at": post[5],
                }
                for post in posts_data
            ]
            return posts
        except pymysql.Error as e:
            print("Query failed:", e)

class Comment:
    def __init__(self, post_id, user_id, content, id=None):
        self.id = id
        self.post_id = post_id
        self.user_id = user_id
        self.content = content

    def save(self):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("CreateComment", (self.post_id, self.user_id, self.content))
            db.commit()
        except pymysql.Error as e:
            print("Query failed:", e)

    @classmethod
    def get_by_id(cls, comment_id):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("GetCommentById", (comment_id,))
            comment_data = cursor.fetchone()
            if comment_data:
                return cls(comment_data[1], comment_data[2], comment_data[3], comment_data[0])
            return None
        except pymysql.Error as e:
            print("Query failed:", e)

    def update(self, new_content):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("UpdateComment", (self.id, new_content))
            db.commit()
        except pymysql.Error as e:
            print("Query failed:", e)

    def delete(self):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("DeleteComment", (self.id,))
            db.commit()
        except pymysql.Error as e:
            print("Query failed:", e)

    @classmethod
    def get_all(cls):
        db = create_connection()
        cursor = db.cursor()
        try:
            cursor.callproc("GetAllComments")
            comments_data = cursor.fetchall()
            comments = [
                {
                    "id": comment[0],
                    "post_id": comment[1],
                    "user_id": comment[2],
                    "content": comment[3],
                }
                for comment in comments_data
            ]
            return comments
        except pymysql.Error as e:
            print("Query failed:", e)

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    user = User(username, password)
    user.save()
    return jsonify({"message": "User created successfully"}), 201

@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.get_by_id(user_id)
    if user:
        return jsonify({"username": user.username, "password": user.password}), 200
    return jsonify({"message": "User not found"}), 404

@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    new_username = data["username"]
    new_password = data["password"]
    user = User.get_by_id(user_id)
    if user:
        user.update(new_username, new_password)
        return jsonify({"message": "User updated successfully"}), 200
    return jsonify({"message": "User not found"}), 404

@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.get_by_id(user_id)
    if user:
        user.delete()
        return jsonify({"message": "User deleted successfully"}), 200
    return jsonify({"message": "User not found"}), 404

@app.route("/users/<int:user_id>/post_count", methods=["GET"])
def get_post_count_by_user_id(user_id):
    post_count = User.get_post_count_by_user_id(user_id)
    return jsonify({"post_count": post_count}), 200

@app.route("/users/<int:user_id>/posts", methods=["GET"])
def get_all_posts_by_user_id(user_id):
    posts = User.get_all_posts_by_user_id(user_id)
    return jsonify(posts), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]

    user = User.login(username, password)
    if user:
        return (
            jsonify(
                {"username": user.username, "password": user.password, "id": user.id}
            ),
            200,
        )
    else:
        return jsonify({"message": "Login failed. Please check your credentials"}), 401

@app.route("/users", methods=["GET"])
def get_all_users():
    users = User.get_all()
    return jsonify(users), 200

@app.route("/posts", methods=["POST"])
def create_post():
    data = request.get_json()
    title = data["title"]
    content = data["content"]
    user_id = data["user_id"]
    post = Post(title, content, user_id)
    post.save()
    return jsonify({"message": "Post created successfully"}), 201

@app.route("/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    post = Post.get_by_id(post_id)
    if post:
        return (
            jsonify(
                {"title": post.title, "content": post.content, "user_id": post.user_id}
            ),
            200,
        )
    return jsonify({"message": "Post not found"}), 404

@app.route("/posts/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    data = request.get_json()
    new_title = data["title"]
    new_content = data["content"]
    post = Post.get_by_id(post_id)
    if post:
        post.update(new_title, new_content)
        return jsonify({"message": "Post updated successfully"}), 200
    return jsonify({"message": "Post not found"}), 404

@app.route("/posts/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    post = Post.get_by_id(post_id)
    if post:
        post.delete()
        return jsonify({"message": "Post deleted successfully"}), 200
    return jsonify({"message": "Post not found"}), 404

@app.route("/posts", methods=["GET"])
def get_all_posts():
    posts = Post.get_all()
    return jsonify(posts), 200

@app.route("/comments", methods=["POST"])
def create_comment():
    data = request.get_json()
    post_id = data["post_id"]
    user_id = data["user_id"]
    content = data["content"]
    comment = Comment(post_id, user_id, content)
    comment.save()
    return jsonify({"message": "Comment created successfully"}), 201

@app.route("/comments/<int:comment_id>", methods=["GET"])
def get_comment(comment_id):
    comment = Comment.get_by_id(comment_id)
    if comment:
        return (
            jsonify(
                {
                    "post_id": comment.post_id,
                    "user_id": comment.user_id,
                    "content": comment.content,
                }
            ),
            200,
        )
    return jsonify({"message": "Comment not found"}), 404

@app.route("/comments/<int:comment_id>", methods=["PUT"])
def update_comment(comment_id):
    data = request.get_json()
    new_content = data["content"]
    comment = Comment.get_by_id(comment_id)
    if comment:
        comment.update(new_content)
        return jsonify({"message": "Comment updated successfully"}), 200
    return jsonify({"message": "Comment not found"}), 404

@app.route("/comments/<int:comment_id>", methods=["DELETE"])
def delete_comment(comment_id):
    comment = Comment.get_by_id(comment_id)
    if comment:
        comment.delete()
        return jsonify({"message": "Comment deleted successfully"}), 200
    return jsonify({"message": "Comment not found"}), 404

@app.route("/comments", methods=["GET"])
def get_all_comments():
    comments = Comment.get_all()
    return jsonify(comments), 200

# Extra views

@app.route("/most_commented_posts", methods=["GET"])
def get_most_commented_posts():
    db = create_connection()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM most_commented_posts")
        most_commented_posts = cursor.fetchall()
        most_commented_posts = [
            {
                "id": post[0],
                "title": post[1],
                "content": post[2],
                "user_id": post[3],
                "created_at": post[4],
                "updated_at": post[5],
                "comment_count": post[6],
            }
            for post in most_commented_posts
        ]
        return jsonify(most_commented_posts), 200
    except pymysql.Error as e:
        print("Query failed:", e)
        return jsonify({"message": "Something went wrong"}), 500

@app.route("/recent_posts", methods=["GET"])
def get_recent_posts():
    db = create_connection()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM recent_posts")
        recent_posts = cursor.fetchall()
        recent_posts = [
            {
                "id": post[0],
                "title": post[1],
                "content": post[2],
                "user_id": post[3],
                "created_at": post[4],
                "updated_at": post[5],
            }
            for post in recent_posts
        ]
        return jsonify(recent_posts), 200
    except pymysql.Error as e:
        print("Query failed:", e)
        return jsonify({"message": "Something went wrong"}), 500

@app.route("/posts_without_comments", methods=["GET"])
def get_posts_without_comments():
    db = create_connection()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM posts_without_comments")
        posts_without_comments = cursor.fetchall()
        posts_without_comments = [
            {
                "post_id": post[0],
                "post_title": post[1],
                "post_content": post[2],
            }
            for post in posts_without_comments
        ]
        return jsonify(posts_without_comments), 200
    except pymysql.Error as e:
        print("Query failed:", e)
        return jsonify({"message": "Something went wrong"}), 500

@app.route("/posts_authors_comments", methods=["GET"])
def get_posts_authors_comments():
    db = create_connection()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM posts_authors_comments")
        posts_authors_comments = cursor.fetchall()
        posts_authors_comments = [
            {
                "post_id": post[0],
                "post_title": post[1],
                "post_content": post[2],
                "author_username": post[3],
                "comment_id": post[4],
                "comment_content": post[5],
                "commenter_id": post[6],
            }
            for post in posts_authors_comments
        ]
        return jsonify(posts_authors_comments), 200
    except pymysql.Error as e:
        print("Query failed:", e)
        return jsonify({"message": "Something went wrong"}), 500

if __name__ == "__main__":
    app.run(debug=True)