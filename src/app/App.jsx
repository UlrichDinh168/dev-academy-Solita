import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/shared/Header'
import AddJourney from './pages/AddJourney'
import AddStation from './pages/AddStation'
import Journey from './pages/Journey'
import Station from './pages/Station'

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Journey />} />
        <Route path="/station" element={<Station />} />
        <Route path="/add-journey" element={<AddJourney />} />
        <Route path="/add-station" element={<AddStation />} />
      </Routes>

    </Router>
  );
}

export default App;
