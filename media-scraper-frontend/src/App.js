import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './component/Home/Home'; // Home component to list URLs
import Detail from './component/Home/Detail/Detail'; // Detail component to show image or video for a specific URL
import Login from './component/Login/Login'
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>scraped_urls email: lekehien5431@gmail.com  phone:  +84762110602</h1>
        </header>

        {/* Define Routes for Home and Detail components */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
