import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import SingleNote from './SingleNote';
const Navigator = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={<App />} />
        <Route path="/single-note" element={<SingleNote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Navigator
