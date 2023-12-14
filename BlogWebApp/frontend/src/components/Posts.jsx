import { useState, useEffect } from "react";
import axios from "axios";

function Posts() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [editedPostData, setEditedPostData] = useState({
    title: "",
    content: "",
  });
  const [comments, setComments] = useState([]);
  const [commentStates, setCommentStates] = useState({}); // New state for comment text areas
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentData, setEditedCommentData] = useState({ content: "" });
  const [usernames, setUsernames] = useState({}); // New state for storing usernames

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      const user = JSON.parse(userDataString);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [newPost, editingPost]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchPosts = () => {
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        setPosts(response.data);
        // Loop through the posts and fetch the usernames of the authors
        response.data.forEach((post) => {
          fetchUsername(post.user_id);
        });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  const fetchComments = () => {
    axios
      .get("http://localhost:5000/comments")
      .then((response) => {
        setComments(response.data);
        // Loop through the comments and fetch the usernames of the authors
        response.data.forEach((comment) => {
          fetchUsername(comment.user_id);
        });
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  // A helper function to fetch the username of a user by user_id
  const fetchUsername = (user_id) => {
    // Check if the username is already in the state
    if (usernames[user_id]) {
      return;
    }
    // Otherwise, make a request to the API
    axios
      .get(`http://localhost:5000/users/${user_id}`)
      .then((response) => {
        // Update the usernames state with the new username
        setUsernames((prevUsernames) => ({
          ...prevUsernames,
          [user_id]: response.data.username,
        }));
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
      });
  };

  const handleCreatePost = async () => {
    try {
      const postData = {
        title: newPost.title,
        content: newPost.content,
        user_id: user.id,
      };

      const response = await axios.post(
        "http://localhost:5000/posts",
        postData
      );

      setPosts([...posts, response.data]);
      setNewPost({ title: "", content: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdatePost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);

    if (postToEdit && user && postToEdit.user_id === user.id) {
      setEditingPost(postId);
      setEditedPostData({
        title: postToEdit.title,
        content: postToEdit.content,
      });
    } else {
      console.error("You do not have permission to edit this post.");
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPostData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const updatedPost = {
        title: editedPostData.title,
        content: editedPostData.content,
      };

      await axios.put(
        `http://localhost:5000/posts/${editingPost}`,
        updatedPost
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPost ? { ...post, ...updatedPost } : post
        )
      );

      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = (postId) => {
    const postToDelete = posts.find((post) => post.id === postId);

    if (postToDelete && user && postToDelete.user_id === user.id) {
      const confirmed = window.confirm(
        "Are you sure you want to delete this post?"
      );

      if (confirmed) {
        axios
          .delete(`http://localhost:5000/posts/${postId}`)
          .then(() => {
            const updatedPosts = posts.filter((post) => post.id !== postId);
            setPosts(updatedPosts);
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
          });
      }
    } else {
      console.error("You do not have permission to delete this post.");
    }
  };

  const handleCreateComment = async (postId) => {
    try {
      const commentData = {
        content: commentStates[postId]?.content || "", // Use specific comment state
        user_id: user.id,
        post_id: postId,
      };

      const response = await axios.post(
        "http://localhost:5000/comments",
        commentData
      );

      setCommentStates((prevStates) => ({
        ...prevStates,
        [postId]: { content: "" },
      }));

      // Fetch the updated comments from the server
      await fetchComments();

      // Now update the local state with the new comment
      setComments((prevComments) => [...prevComments, response.data]);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleUpdateComment = (commentId) => {
    const commentToEdit = comments.find((comment) => comment.id === commentId);

    if (commentToEdit && user && commentToEdit.user_id === user.id) {
      setEditingComment(commentId);
      setEditedCommentData({ content: commentToEdit.content });
    } else {
      console.error("You do not have permission to edit this comment.");
    }
  };

  const handleEditCommentInputChange = (e) => {
    const { value } = e.target;
    setEditedCommentData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  const handleEditCommentSubmit = async (commentId) => {
    try {
      const updatedComment = {
        content: editedCommentData.content,
      };

      await axios.put(
        `http://localhost:5000/comments/${commentId}`,
        updatedComment
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, ...updatedComment } : comment
        )
      );

      setEditingComment(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = (commentId) => {
    const commentToDelete = comments.find(
      (comment) => comment.id === commentId
    );

    if (commentToDelete && user && commentToDelete.user_id === user.id) {
      const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
      );

      if (confirmed) {
        axios
          .delete(`http://localhost:5000/comments/${commentId}`)
          .then(() => {
            const updatedComments = comments.filter(
              (comment) => comment.id !== commentId
            );
            setComments(updatedComments);
          })
          .catch((error) => {
            console.error("Error deleting comment:", error);
          });
      }
    } else {
      console.error("You do not have permission to delete this comment.");
    }
  };

  const getCommentsForPost = (postId) => {
    return comments.filter((comment) => comment.post_id === postId);
  };

  return (
    <div>
      <h1>Posts</h1>
      <form>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button type="button" onClick={handleCreatePost}>
          Create Post
        </button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Posted by: {usernames[post.user_id]}</p>
            <p>Created At: {post.created_at}</p>
            {post.updated_at && <p>Updated At: {post.updated_at}</p>}
            {editingPost === post.id ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={editedPostData.title}
                  onChange={handleEditInputChange}
                />
                <textarea
                  name="content"
                  value={editedPostData.content}
                  onChange={handleEditInputChange}
                />
                <button onClick={handleEditSubmit}>Submit</button>
              </div>
            ) : (
              <div>
                {user && user.id === post.user_id && (
                  <>
                    <button onClick={() => handleUpdatePost(post.id)}>
                      Update Post
                    </button>
                    <button onClick={() => handleDeletePost(post.id)}>
                      Delete Post
                    </button>
                  </>
                )}
              </div>
            )}
            <div>
              {getCommentsForPost(post.id).map((comment) => (
                <div key={comment.id}>
                  <p>{comment.content}</p>
                  <p>Commented by: {usernames[comment.user_id]}</p>
                  {editingComment === comment.id ? (
                    <div>
                      <textarea
                        name="content"
                        value={editedCommentData.content}
                        onChange={(e) =>
                          handleEditCommentInputChange(e, comment.id)
                        }
                      />
                      <button
                        onClick={() => handleEditCommentSubmit(comment.id)}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div>
                      {user && user.id === comment.user_id && (
                        <>
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                          >
                            Update Comment
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Delete Comment
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <textarea
                placeholder="Add a comment"
                value={commentStates[post.id]?.content || ""}
                onChange={(e) =>
                  setCommentStates((prevStates) => ({
                    ...prevStates,
                    [post.id]: { content: e.target.value },
                  }))
                }
              />
              <button onClick={() => handleCreateComment(post.id)}>
                Add Comment
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
