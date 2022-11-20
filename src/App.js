import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./log_Sign.css";
//routes imports
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//pages imports
import Test from "./pages/test";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h>hola </h>} />
        <Route path="Test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
