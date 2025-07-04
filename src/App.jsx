import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
// import Footer from "./components/Footer.jsx";
import Welcome from "./components/Welcome.jsx";
import Chat from "./components/chat.jsx";
function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>

      {/* <Footer /> */}
    </Router>
  );
}

export default App;
