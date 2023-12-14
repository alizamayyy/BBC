import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/users",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      alert("User created successfully!");
      setIsLogin(true);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register user.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Store the entire user object in localStorage
        localStorage.setItem("user", JSON.stringify(response.data));

        // Redirect to Home.jsx after successful login
        navigate("/home");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-row w-full h-screen justify-center items-center">
      <div className="w-2/4 bg-black">
        <h1>hello world</h1>
      </div>
      <div className="bg-[#161616] flex flex-col justify-center items-center w-2/4 h-[100%] align-right">
        <Card
          className="w-2/5 h-96 flex flex-col justify-center items-center p-8 shadow-2xl"
          sx={{
            backgroundColor: "#161616",
            borderRadius: "20px",
          }}
        >
          <div>
            {isLogin ? (
              <div className="flex flex-col justify-center items-center">
                <div>
                  <header className="">
                    <h1 className="text-4xl font-bold text-white mb-2">
                      Welcome back!
                    </h1>
                  </header>
                </div>
                <div>
                  <p className="text-white mb-6">Log into your account</p>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="flex flex-col w-64">
                    <input
                      className="shadow appearance-none rounded-xl bg-[#000000] py-2.5 px-4 text-gray-500 text-md leading-tight focus:shadow-outline focus:text-white mb-2"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      className="shadow appearance-none rounded-xl bg-[#000000] py-2.5 px-4 text-gray-500 text-md mb-5 leading-tight focus:shadow-outline"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 w-2/4 text-white font-bold px-4 rounded-xl focus:outline-none focus:shadow-outline h-9 mb-4"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <button
                  className="mt-4 text-blue-500 hover:text-blue-700 text-sm font-semibold"
                  onClick={toggleForm}
                >
                  Need an account? Register here
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <div>
                  <header className="">
                    <h1 className="text-4xl font-bold text-white mb-2">
                      Register now!
                    </h1>
                  </header>
                </div>
                <div>
                  <p className="text-white mb-6">
                    Sign in to &apos;App Name&apos;
                  </p>
                </div>
                <form onSubmit={handleRegister}>
                  <div className="flex flex-col w-64">
                    <input
                      className="shadow appearance-none rounded-xl bg-[#000000] py-2.5 px-4 text-gray-500 text-md leading-tight focus:shadow-outline focus:text-white mb-2"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      className="shadow appearance-none rounded-xl bg-[#000000] py-2.5 px-4 text-gray-500 text-md mb-5 leading-tight focus:shadow-outline"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 w-2/4 text-white font-bold px-4 rounded-xl focus:outline-none focus:shadow-outline h-9 mb-4"
                      type="submit"
                    >
                      Register
                    </button>
                  </div>
                </form>
                <button
                  className="mt-4 text-blue-500 hover:text-blue-700 text-sm font-semibold"
                  onClick={toggleForm}
                >
                  Already have an account? Login here
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;
