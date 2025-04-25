import React from 'react';
import Nav from "./components/Nav";
import Home from "./components/Home";
import './parallax.css';  // Add this import

const App = () => {
  return (
    <div>
      <Nav />
      <Home />
    </div>
  );
};

export default App;