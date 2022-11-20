import logo from './logo.svg';
import './App.css';
//routes imports
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//pages imports 
import Test from './pages/test';


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
