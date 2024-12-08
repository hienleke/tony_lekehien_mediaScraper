import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './component/Home/Home'; // Home component to list URLs
import Detail from './component/Detail/Detail'; // Detail component to show image or video for a specific URL

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the URL Viewer</h1>
        </header>

        {/* Define Routes for Home and Detail components */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
