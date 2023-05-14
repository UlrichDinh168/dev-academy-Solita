import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddJourney from './pages/AddJourney';
import AddStation from './pages/AddStation';
import Journey from './pages/Journey';
import Station from './pages/Station';
import Statistics from './pages/Statistics';
import NotFound from './pages/NotFound';
import ResponsiveAppBar from './components/shared/Navbar';

const App = () => {
  return (
    <Router>
      <ResponsiveAppBar />
      <Routes>
        <Route exact path='/' element={<Journey />} />
        <Route path='/station' element={<Station />} />
        <Route path='/add-journey' element={<AddJourney />} />
        <Route path='/add-station' element={<AddStation />} />
        <Route path='/statistics' element={<Statistics />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
