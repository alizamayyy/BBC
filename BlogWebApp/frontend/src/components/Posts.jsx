import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";
import ProfileCard from "./profileCard";
import ActiveUsersCard from "./activeUsersCard";
import Card from "@mui/material/Card";

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
    <div
      className="h-max"
      style={{
        background:
          "linear-gradient(0deg, #000517 0%, #000517 50%, #1b1a38 100%)",
      }}
    >
      <Navbar />
      <div className="mt-24 flex flex-row space-x-16 justify-center">
        <ProfileCard />
        <Card
          className="w-2/5 overflow-scroll flex flex-col justify-center items-center p-4"
          sx={{
            backgroundColor: "#000517",
            borderRadius: "20px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex flex-col w-5/6">
            <div>
              <form>
                <div className="flex flex-col space-y-5 ">
                  <h1 className="font-bold text-4xl text-center mb-4 mt-4 text-white">
                    Posts
                  </h1>
                  <input
                    className="py-2.5 px-4 rounded-lg"
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                  />
                  <textarea
                    className="py-2.5 px-4 rounded-lg"
                    placeholder="Content"
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                  />
                </div>
                <div className="">
                  <button
                    type="button"
                    className="bg-[#6788ff] hover:bg-blue-700 w-2/5 text-white font-bold px-4 rounded-xl focus:outline-none focus:shadow-outline h-9 mb-4 mt-5 float-right"
                    onClick={handleCreatePost}
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </div>
            <div className="text-white flex flex-col">
              <ul>
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
                        <p className="font-bold text-lg">
                          {usernames[post.user_id]}
                        </p>
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
                    {editingPost === post.id ? (
                      <div className="flex flex-col space-y-2">
                        <input
                          className="py-2.5 px-4 rounded-lg w-2/3 mt-4 ml-12"
                          type="text"
                          name="title"
                          value={editedPostData.title}
                          onChange={handleEditInputChange}
                        />
                        <textarea
                          className="py-2.5 px-4 rounded-lg w-2/3 ml-12"
                          name="content"
                          value={editedPostData.content}
                          onChange={handleEditInputChange}
                        />
                        <button
                          className="bg-[#6788ff] hover:bg-blue-700 w-1/5 text-white text-xs font-bold px-2 rounded-xl focus:outline-none focus:shadow-outline h-7 mb-4 ml-auto mr-28"
                          onClick={handleEditSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {user && user.id === post.user_id && (
                          <div>
                            <button
                              className="bg-red-500 hover:bg-red-700 w-1/4 ml-2 mr-12 text-white text-sm font-bold px-2 rounded-xl focus:outline-none focus:shadow-outline h-7 mb-4 mt-5 float-right"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete Post
                            </button>
                            <button
                              className="bg-[#6788ff] hover:bg-blue-700 w-1/4 text-white text-sm font-bold px-2 rounded-xl focus:outline-none focus:shadow-outline h-7 mb-4 mt-5 float-right"
                              onClick={() => handleUpdatePost(post.id)}
                            >
                              Update Post
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col ml-14 mr-6">
                      <h3 className="text-white text-lg font-semibold mb-2">
                        Comments
                      </h3>
                      {getCommentsForPost(post.id).map((comment) => (
                        <div key={comment.id}>
                          <div className="flex flex-row space-x-2 ml-4 text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <div>
                              <p className="font-bold text-md">
                                {usernames[comment.user_id]}
                              </p>
                            </div>
                          </div>
                          <div className="ml-12">
                            <p className="text-white text-sm">
                              {comment.content}
                            </p>
                          </div>

                          {editingComment === comment.id ? (
                            <div>
                              <textarea
                                className="py-2.5 px-4 rounded-lg w-2/3 ml-12 mt-2"
                                name="content"
                                value={editedCommentData.content}
                                onChange={(e) =>
                                  handleEditCommentInputChange(e, comment.id)
                                }
                              />
                              <button
                                className="bg-[#6788ff] hover:bg-blue-700 w-4/12 text-xs text-white font-bold px-2 rounded-xl focus:outline-none focus:shadow-outline h-7 mb-4 mt-1 ml-44"
                                onClick={() =>
                                  handleEditCommentSubmit(comment.id)
                                }
                              >
                                Submit
                              </button>
                            </div>
                          ) : (
                            <div>
                              {user && user.id === comment.user_id && (
                                <div className="ml-11">
                                  <button
                                    className="bg-[#6788ff] hover:bg-blue-700 w-4/12 text-xs text-white font-bold px-2 rounded-xl focus:outline-none focus:shadow-outline h-7 mb-4 mt-3 "
                                    onClick={() =>
                                      handleUpdateComment(comment.id)
                                    }
                                  >
                                    Update Comment
                                  </button>
                                  <button
                                    className="bg-red-500 hover:bg-red-700 w-4/12 text-xs text-white font-bold px-2 rounded-xl focus:outline-none focus:shadow-outline h-7 mb-4 mt-3 ml-1"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                  >
                                    Delete Comment
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="flex flex-row ml-4 mt-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <textarea
                          className="py-2.5 px-4 rounded-lg w-2/3 ml-2"
                          placeholder="Add a comment"
                          value={commentStates[post.id]?.content || ""}
                          onChange={(e) =>
                            setCommentStates((prevStates) => ({
                              ...prevStates,
                              [post.id]: { content: e.target.value },
                            }))
                          }
                        />
                      </div>

                      <button
                        className="bg-[#6788ff] hover:bg-blue-700 w-4/12 text-xs text-white font-bold px-2 rounded-xl focus:outline-none focus:shadow-outline h-7 mb-4 mt-3 ml-48"
                        onClick={() => handleCreateComment(post.id)}
                      >
                        Add Comment
                      </button>
                    </div>
                  </Card>
                ))}
              </ul>
            </div>
          </div>
        </Card>
        <ActiveUsersCard />
      </div>
    </div>
  );
}

export default Posts;
