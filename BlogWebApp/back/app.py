from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import threading
import time

app = Flask(__name__)
CORS(app)

# Database Configuration
db = pymysql.connect(host='localhost', user='root', password='root', db='text_blog')

# Define a function that checks the connection status every 2 seconds
def check_connection():
    global db # Use the global variable db
    while True:
        # Check the connection status every 2 seconds
        time.sleep(3)
        # Use the open attribute to test if the connection is open
            # Try to reconnect with the database using the same configuration


# Create a thread object with the target function
t = threading.Thread(target=check_connection)
# Start the thread
t.start()


class User:
    def __init__(self, username, password, id=None):
        self.id = id
        self.username = username
        self.password = password

    def save(self):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("CreateUser", (self.username, self.password))
        db.commit()
        # Close the cursor after the query is done
        cursor.close()
    
    @classmethod
    def get_by_id(cls, user_id):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("GetUserById", (user_id,))
        user_data = cursor.fetchone()
        # Close the cursor after the query is done
        cursor.close()
        if user_data:
            return cls(user_data[1], user_data[2], user_data[0])
        return None

    def update(self, new_username, new_password):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("UpdateUser", (self.id, new_username, new_password))
        db.commit()
        # Close the cursor after the query is done
        cursor.close()

    def delete(self):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("DeleteUser", (self.id,))
        db.commit()
        # Close the cursor after the query is done
        cursor.close()

    @classmethod
    def get_all(cls):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("GetAllUsers")
        users_data = cursor.fetchall()
        # Close the cursor after the query is done
        cursor.close()
        users = [{'id': user[0], 'username': user[1], 'password': user[2]} for user in users_data]
        return users
    
    @classmethod
    def login(cls, username, password):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("GetUserByUsername", (username,))
        user_data = cursor.fetchone()
        # Close the cursor after the query is done
        cursor.close()
        if user_data and user_data[2] == password:
            return cls(user_data[1], user_data[2], user_data[0])
        return None
    
class Post:
    def __init__(self, title, content, user_id, id=None):
        self.id = id
        self.title = title
        self.content = content
        self.user_id = user_id

    def save(self):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("CreatePost", (self.title, self.content, self.user_id))
        db.commit()
        # Close the cursor after the query is done
        cursor.close()

    @classmethod
    def get_by_id(cls, post_id):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("GetPostById", (post_id,))
        post_data = cursor.fetchone()
        # Close the cursor after the query is done
        cursor.close()
        if post_data:
            return cls(post_data[1], post_data[2], post_data[3], post_data[0])
        return None

    def update(self, new_title, new_content):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("UpdatePost", (self.id, new_title, new_content))
        db.commit()
        # Close the cursor after the query is done
        cursor.close()

    def delete(self):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("DeletePost", (self.id,))
        db.commit()
        # Close the cursor after the query is done
        cursor.close()

    @classmethod
    def get_all(cls):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("GetAllPosts")
        posts_data = cursor.fetchall()
        # Close the cursor after the query is done
        cursor.close()
        posts = [
            {
                'id': post[0],
                'title': post[1],
                'content': post[2],
                'user_id': post[3],
                'created_at': post[4],  # Assuming the 5th column is created_at
                'updated_at': post[5]   # Assuming the 6th column is updated_at
            }
            for post in posts_data
        ]
        return posts

class Comment:
    def __init__(self, post_id, user_id, content, id=None):
        self.id = id
        self.post_id = post_id
        self.user_id = user_id
        self.content = content

    def save(self):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("CreateComment", (self.post_id, self.user_id, self.content))
        db.commit()
        # Close the cursor after the query is done
        cursor.close()

    @classmethod
    def get_by_id(cls, comment_id):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("GetCommentById", (comment_id,))
        comment_data = cursor.fetchone()
        # Close the cursor after the query is done
        cursor.close()
        if comment_data:
            return cls(comment_data[1], comment_data[2], comment_data[3], comment_data[0])
        return None

    def update(self, new_content):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("UpdateComment", (self.id, new_content))
        db.commit()
        # Close the cursor after the query is done
        cursor.close()

    def delete(self):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("DeleteComment", (self.id,))
        db.commit()
        # Close the cursor after the query is done
        cursor.close()

    @classmethod
    def get_all(cls):
        # Create a new cursor for each request
        cursor = db.cursor()
        cursor.callproc("GetAllComments")
        comments_data = cursor.fetchall()
        # Close the cursor after the query is done
        cursor.close()
        comments = [{'id': comment[0], 'post_id': comment[1], 'user_id': comment[2], 'content': comment[3]} for comment in comments_data]
        return comments

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data['username']
    password = data['password']
    user = User(username, password)
    user.save()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.get_by_id(user_id)
    if user:
        return jsonify({'username': user.username, 'password': user.password}), 200
    return jsonify({'message': 'User not found'}), 404

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    new_username = data['username']
    new_password = data['password']
    user = User.get_by_id(user_id)
    if user:
        user.update(new_username, new_password)
        return jsonify({'message': 'User updated successfully'}), 200
    return jsonify({'message': 'User not found'}), 404

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.get_by_id(user_id)
    if user:
        user.delete()
        return jsonify({'message': 'User deleted successfully'}), 200
    return jsonify({'message': 'User not found'}), 404

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # Check if the username and password match a user in the database
    user = User.login(username, password)
    if user:
        # Return the user data as a JSON response
        return jsonify({
            'username': user.username,
            'password': user.password,
            'id': user.id
        }), 200
    else:
        return jsonify({'message': 'Login failed. Please check your credentials'}), 401


@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.get_all()
    return jsonify(users), 200

@app.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    title = data['title']
    content = data['content']
    user_id = data['user_id']
    post = Post(title, content, user_id)
    post.save()
    return jsonify({'message': 'Post created successfully'}), 201

@app.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.get_by_id(post_id)
    if post:
        return jsonify({'title': post.title, 'content': post.content, 'user_id': post.user_id}), 200
    return jsonify({'message': 'Post not found'}), 404

@app.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    data = request.get_json()
    new_title = data['title']
    new_content = data['content']
    post = Post.get_by_id(post_id)
    if post:
        post.update(new_title, new_content)
        return jsonify({'message': 'Post updated successfully'}), 200
    return jsonify({'message': 'Post not found'}), 404

@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Post.get_by_id(post_id)
    if post:
        post.delete()
        return jsonify({'message': 'Post deleted successfully'}), 200
    return jsonify({'message': 'Post not found'}), 404

@app.route('/posts', methods=['GET'])
def get_all_posts():
    posts = Post.get_all()
    return jsonify(posts), 200

@app.route('/comments', methods=['POST'])
def create_comment():
    data = request.get_json()
    post_id = data['post_id']
    user_id = data['user_id']
    content = data['content']
    comment = Comment(post_id, user_id, content)
    comment.save()
    return jsonify({'message': 'Comment created successfully'}), 201

@app.route('/comments/<int:comment_id>', methods=['GET'])
def get_comment(comment_id):
    comment = Comment.get_by_id(comment_id)
    if comment:
        return jsonify({'post_id': comment.post_id, 'user_id': comment.user_id, 'content': comment.content}), 200
    return jsonify({'message': 'Comment not found'}), 404

@app.route('/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    data = request.get_json()
    new_content = data['content']
    comment = Comment.get_by_id(comment_id)
    if comment:
        comment.update(new_content)
        return jsonify({'message': 'Comment updated successfully'}), 200
    return jsonify({'message': 'Comment not found'}), 404

@app.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    comment = Comment.get_by_id(comment_id)
    if comment:
        comment.delete()
        return jsonify({'message': 'Comment deleted successfully'}), 200
    return jsonify({'message': 'Comment not found'}), 404

@app.route('/comments', methods=['GET'])
def get_all_comments():
    comments = Comment.get_all()
    return jsonify(comments), 200

@app.route('/users/<int:user_id>/posts_and_comments', methods=['GET'])
def get_user_posts_and_comments(user_id):
    # Create a new cursor for each request
    cursor = db.cursor()
    cursor.execute("SELECT * FROM user_posts_and_comments WHERE user_id = %s", (user_id,))
    data = cursor.fetchall()
    # Close the cursor after the query is done
    cursor.close()
    result = [{'post_id': row[0], 'post_title': row[1], 'post_content': row[2], 'comment_id': row[3], 'comment_content': row[4]} for row in data]
    return jsonify(result), 200

@app.route('/posts/recent', methods=['GET'])
def get_recent_posts():
    # Create a new cursor for each request
    cursor = db.cursor()
    cursor.execute("SELECT * FROM recent_posts")
    data = cursor.fetchall()
    # Close the cursor after the query is done
    cursor.close()
    result = [{'id': row[0], 'title': row[1], 'content': row[2], 'user_id': row[3], 'created_at': row[4], 'updated_at': row[5]} for row in data]
    return jsonify(result), 200

@app.route('/posts/most_commented', methods=['GET'])
def get_most_commented_posts():
    # Create a new cursor for each request
    cursor = db.cursor()
    cursor.execute("SELECT * FROM most_commented_posts")
    data = cursor.fetchall()
    # Close the cursor after the query is done
    cursor.close()
    result = [{'post_id': row[0], 'title': row[1], 'content': row[2], 'comment_count': row[3]} for row in data]
    return jsonify(result), 200

@app.route('/users/<int:user_id>/posts_comments', methods=['GET'])
def get_user_posts_comments(user_id):
    # Create a new cursor for each request
    cursor = db.cursor()
    cursor.execute("SELECT * FROM user_posts_and_comments WHERE user_id = %s", (user_id,))
    data = cursor.fetchall()
    # Close the cursor after the query is done
    cursor.close()
    result = [{'post_id': row[0], 'post_title': row[1], 'post_content': row[2], 'comment_id': row[3], 'comment_content': row[4]} for row in data]
    return jsonify(result), 200

@app.route('/posts/without_comments', methods=['GET'])
def get_posts_without_comments():
    # Create a new cursor for each request
    cursor = db.cursor()
    cursor.execute("SELECT * FROM posts_without_comments")
    data = cursor.fetchall()
    # Close the cursor after the query is done
    cursor.close()
    result = [{'post_id': row[0], 'title': row[1], 'content': row[2]} for row in data]
    return jsonify(result), 200


@app.route('/posts/authors_comments', methods=['GET'])
def get_posts_authors_comments():
    # Create a new cursor for each request
    cursor = db.cursor()
    cursor.execute("SELECT * FROM posts_authors_comments")
    data = cursor.fetchall()
    # Close the cursor after the query is done
    cursor.close()
    result = [
        {
            'post_id': row[0], 
            'post_title': row[1], 
            'post_content': row[2], 
            'author_username': row[3], 
            'comment_id': row[4], 
            'comment_content': row[5], 
            'commenter_id': row[6]
        } 
        for row in data
    ]
    return jsonify(result), 200


if __name__ == '__main__':
    app.run(debug=True)


import time
# Assuming you have already created a db object with the database configuration
while True:
    # Check the connection status every 2 seconds
    time.sleep(2)
