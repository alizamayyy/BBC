import Card from "@mui/material/Card";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import ProfileCard from "./profileCard";

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
  const [commentStates, setCommentStates] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentData, setEditedCommentData] = useState({ content: "" });
  const [usernames, setUsernames] = useState({});
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const user = JSON.parse(userDataString);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, [newPost, editingPost, filter]);

  const fetchPosts = () => {
    let endpoint = "";
    switch (filter) {
      case "Most Commented Posts":
        endpoint = "/most_commented_posts";
        break;
      case "Posts Without Comments":
        endpoint = "/posts_without_comments";
        break;
      case "All Posts":
      default:
        endpoint = "/posts";
        break;
    }

    axios
      .get(`http://localhost:5000${endpoint}`)
      .then((response) => {
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setPosts(sortedPosts);
        sortedPosts.forEach((post) => {
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
        response.data.forEach((comment) => {
          fetchUsername(comment.user_id);
        });
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  const fetchUsername = (user_id) => {
    if (!usernames[user_id]) {
      axios
        .get(`http://localhost:5000/users/${user_id}`)
        .then((response) => {
          setUsernames((prevUsernames) => ({
            ...prevUsernames,
            [user_id]: response.data.username,
          }));
        })
        .catch((error) => {
          console.error("Error fetching username:", error);
        });
    }
  };

  const handleCreatePost = async () => {
    try {
      const postData = {
        title: newPost.title,
        content: newPost.content,
        user_id: user.id,
      };

      await axios.post("http://localhost:5000/posts", postData);
      setNewPost({ title: "", content: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdatePost = async () => {
    try {
      const updatedPost = {
        title: editedPostData.title,
        content: editedPostData.content,
      };

      await axios.put(
        `http://localhost:5000/posts/${editingPost}`,
        updatedPost
      );
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCreateComment = async (postId) => {
    try {
      const commentData = {
        content: commentStates[postId]?.content || "",
        user_id: user.id,
        post_id: postId,
      };

      await axios.post("http://localhost:5000/comments", commentData);
      setCommentStates((prevStates) => ({
        ...prevStates,
        [postId]: { content: "" },
      }));
      fetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleUpdateComment = async () => {
    try {
      const updatedComment = {
        content: editedCommentData.content,
      };

      await axios.put(
        `http://localhost:5000/comments/${editingComment}`,
        updatedComment
      );
      setEditingComment(null);
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditedPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFilterClick = (filterName) => {
    setFilter(filterName);
  };

  function getCommentsForPost(postId) {
    console.log(comments);
    return comments.filter((comment) => comment.post_id === postId);
  }

  const handleEditCommentInputChange = (event, commentId) => {
    const { value } = event.target;
    setEditedCommentData({ content: value });
    setEditingComment(commentId);
  };

  const handleEditCommentSubmit = async (commentId) => {
    try {
      // Make an API call to update the comment
      await axios.put(
        `http://localhost:5000/comments/${commentId}`,
        editedCommentData
      );

      // Update the comments in the frontend to reflect the change
      // This might involve fetching the updated comments list or updating the state directly
      fetchComments();

      // Reset the editing state
      setEditingComment(null);
      setEditedCommentData({ content: "" });
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  const handleEditSubmit = async () => {
    try {
      // Make an API call to update the post
      await axios.put(
        `http://localhost:5000/posts/${editingPost}`,
        editedPostData
      );

      // Update the posts in the frontend to reflect the changes
      // This could involve fetching the updated posts list or updating the state directly
      fetchPosts();

      // Reset the editing state
      setEditingPost(null);
      setEditedPostData({ title: "", content: "" });
    } catch (error) {
      console.error("Error updating post:", error);
    }
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
        <div className="w-1/5 flex flex-col">
          <ProfileCard />
          <Card
            sx={{
              height: "fit-content",
              backgroundColor: "#1b1a38",
              borderRadius: "20px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
            }}
          >
            <div className="flex flex-col justify-center mt-4 items-center pb-5">
              <h2 className="font-bold text-2xl text-center mb-4 mt-4 text-white">
                Filters
              </h2>
              <button
                onClick={() => handleFilterClick("All Posts")}
                className="my-5 text-white"
              >
                All Posts
              </button>
              <hr className="w-4/5" />
              <button
                onClick={() => handleFilterClick("Most Commented Posts")}
                className="my-5 text-white"
              >
                Most Commented Posts
              </button>
              <hr className="w-4/5" />
              <button
                onClick={() => handleFilterClick("Posts Without Comments")}
                className="my-5 text-white"
              >
                Posts Without Comments
              </button>
            </div>
          </Card>
        </div>
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
            {filter && (
              <div className="mt-4 mb-4">
                <h2 className="text-white text-lg font-semibold">{filter}:</h2>
              </div>
            )}
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
                              onClick={() => {
                                setEditingPost(post.id);
                                setEditedPostData({
                                  title: post.title,
                                  content: post.content,
                                });
                              }}
                            >
                              Update Post
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col ml-14 mr-6">
                      <h3 className="text-white text-lg font-semibold mb-2 mt-4">
                        Comments
                      </h3>
                      {console.log(getCommentsForPost(1))}
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
                          <div className="ml-12 mb-2">
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
                                    className="bg-[#6788ff] hover:bg-blue-700 w-4/12 text-xs text-white font-bold px-2 rounded-xl focus:outline-none focus:shadow-outline mb-4 mt-3"
                                    onClick={() => {
                                      setEditingComment(comment.id);
                                      setEditedCommentData({
                                        content: comment.content,
                                      });
                                    }}
                                  >
                                    Update Comment
                                  </button>
                                  <button
                                    className="bg-red-500 hover:bg-red-700 w-4/12 text-xs text-white font-bold px-2 rounded-xl focus:outline-none focus:shadow-outline mb-4 mt-3 ml-1"
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
        {/* ActiveUsersCard component or any other component */}
      </div>
    </div>
  );
}

export default Posts;
