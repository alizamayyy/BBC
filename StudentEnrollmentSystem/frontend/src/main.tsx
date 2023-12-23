import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import AppRouter from "./AppRouter"; // Your routing component
import "./index.css"; // Import your css file (optional)

ReactDOM.render(
  <Router>
    <AppRouter />
  </Router>,
  document.getElementById("root")
);
