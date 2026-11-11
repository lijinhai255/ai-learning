import React from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

const About = () => {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
