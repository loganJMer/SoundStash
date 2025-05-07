import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Main from './pages/Main';
import Header from './components/Header';
import Footer from './components/Footer';
import Search from './pages/Search';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <>
            <Header />
            <Main />
            <Footer />
          </>
        } />
        <Route path="/search" element={
          <>
            <Header />
            <Search />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App
