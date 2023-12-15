import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import Navbar from "./navbar";
import ActiveUsersCard from "./activeUsersCard";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [editUser, setEditUser] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Retrieve the currently logged-in user from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (userData) {
      // Set the user state from the logged-in user
      setUser(userData);

      // Fetch the number of posts for the logged-in user
      axios
        .get(`http://localhost:5000/users/${userData.id}/post_count`)
        .then((response) => setPostCount(response.data.post_count))
        .catch((error) => console.error("Error fetching post count:", error));

      // Fetch the posts for the logged-in user
      axios
        .get(`http://localhost:5000/users/${userData.id}/posts`)
        .then((response) => setPosts(response.data))
        .catch((error) => console.error("Error fetching posts:", error));
    }
  }, [userData.id]);

  // Handle the edit user dialog
  const handleEditUserOpen = () => {
    setEditUser(true);
    setUsername(user.username);
    setPassword(user.password);
  };

  const handleEditUserClose = () => {
    setEditUser(false);
  };

  const handleEditUserSubmit = () => {
    axios
      .put(`http://localhost:5000/users/${user.id}`, {
        username,
        password,
      })
      .then((response) => {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        alert("User updated successfully!");
      })
      .catch((error) => console.error("Error updating user:", error));
    setEditUser(false);
  };

  // Handle the delete user dialog
  const handleDeleteUserOpen = () => {
    setDeleteUser(true);
  };

  const handleDeleteUserClose = () => {
    setDeleteUser(false);
  };

  const handleDeleteUserSubmit = () => {
    axios
      .delete(`http://localhost:5000/users/${user.id}`)
      .then((response) => {
        alert("User deleted successfully!");
        localStorage.removeItem("user");
        window.location.reload();
      })
      .catch((error) => console.error("Error deleting user:", error));
    setDeleteUser(false);
  };

  // Handle the edit post dialog
  const handleEditPostOpen = (post) => {
    setEditPost(true);
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleEditPostClose = () => {
    setEditPost(false);
  };

  const handleEditPostSubmit = () => {
    axios
      .put(`http://localhost:5000/posts/${selectedPost.id}`, {
        title,
        content,
      })
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post.id === response.data.id ? response.data : post
        );
        setPosts(updatedPosts);
        alert("Post updated successfully!");
      })
      .catch((error) => console.error("Error updating post:", error));
    setEditPost(false);
  };

  // Handle the delete post dialog
  const handleDeletePostOpen = (post) => {
    setDeletePost(true);
    setSelectedPost(post);
  };

  const handleDeletePostClose = () => {
    setDeletePost(false);
  };

  const handleDeletePostSubmit = () => {
    axios
      .delete(`http://localhost:5000/posts/${selectedPost.id}`)
      .then((response) => {
        const updatedPosts = posts.filter(
          (post) => post.id !== selectedPost.id
        );
        setPosts(updatedPosts);
        alert("Post deleted successfully!");
      })
      .catch((error) => console.error("Error deleting post:", error));
    setDeletePost(false);
  };

  return (
    <div
      className="h-max"
      style={{
        background:
          "linear-gradient(0deg, #000517 0%, #000517 50%, #1b1a38 100%)",
      }}
    >
      <Navbar />
      <div className="mt-24 flex flex-row space-x-16 justify-center">
        <Card
          className="w-1/5 h-96 flex flex-col justify-center items-center p-8"
          sx={{
            backgroundColor: "#1b1a38",
            borderRadius: "20px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-24 h-24 text-white mb-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h1 className="text-white text-2xl font-bold">{user?.username}</h1>
          <p className="text-white">Posts: {postCount}</p>
          <div className="flex flex-row space-x-4 mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditUserOpen}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteUserOpen}
            >
              Delete
            </Button>
          </div>
        </Card>
        <Card
          className="w-2/5 overflow-scroll flex flex-col justify-center items-center p-4"
          sx={{
            backgroundColor: "#000517",
            borderRadius: "20px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex flex-col w-5/6">
            <h1 className="font-bold text-4xl text-center mb-4 mt-4 text-white">
              My Posts
            </h1>
            <ul className="text-white">
              {posts.map((post) => (
                <Card
                  className="mb-4 mt-4 p-6"
                  style={{ backgroundColor: "#000826", borderRadius: "20px" }}
                  key={post.id}
                >
                  <div className="flex flex-row space-x-2 mb-4 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-bold text-lg">{user?.username}</p>
                      <p className="font-light text-sm italic">
                        {post.created_at}
                      </p>
                    </div>
                  </div>
                  <div className="ml-14 text-white">
                  <h2 className="font-bold text-2xl mb-1">{post.title}</h2>
                    <p className="mb-4">{post.content}</p>

                    {post.updated_at && (
                      <p className="font-light text-xs italic">
                        Updated: {post.updated_at}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row space-x-4 mt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditPostOpen(post)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeletePostOpen(post)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </ul>
          </div>
        </Card>
        <ActiveUsersCard />
      </div>
      {/* Edit user dialog */}
      <Dialog open={editUser} onClose={handleEditUserClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can change your username and password here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditUserClose}>Cancel</Button>
          <Button onClick={handleEditUserSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Delete user dialog */}
      <Dialog open={deleteUser} onClose={handleDeleteUserClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteUserClose}>Cancel</Button>
          <Button onClick={handleDeleteUserSubmit}>Delete</Button>
        </DialogActions>
      </Dialog>
      {/* Edit post dialog */}
      <Dialog open={editPost} onClose={handleEditPostClose}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can change the title and content of your post here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            variant="standard"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditPostClose}>Cancel</Button>
          <Button onClick={handleEditPostSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Delete post dialog */}
      <Dialog open={deletePost} onClose={handleDeletePostClose}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeletePostClose}>Cancel</Button>
          <Button onClick={handleDeletePostSubmit}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
