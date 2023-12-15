import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";

const ProfileCard = () => {
    const [username, setUsername] = useState("");
    const [postCount, setPostCount] = useState(0);

    // Retrieve the currently logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            // Set the username from the logged-in user
            setUsername(user.username);

            // Fetch the number of posts for the logged-in user
            fetch(`http://localhost:5000/users/${user.id}/post_count`)
                .then((response) => response.json())
                .then((data) => setPostCount(data.post_count))
                .catch((error) => console.error("Error fetching post count:", error));
        }
    }, [user]);

    return (
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
            <h1 className="text-white text-2xl font-bold">{username}</h1>
            <p className="text-white">Posts: {postCount}</p>
        </Card>
    );
};

export default ProfileCard;
