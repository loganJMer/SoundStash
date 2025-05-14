import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Main from './pages/main';
import Search from './pages/search';
import Album from './pages/album';
import Community from './pages/community';
import Trades from './pages/trades';
import Header from './components/header';
import Footer from './components/footer';


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
        <Route path="/album/:id" element={
          <>
            <Header />
            <Album />
            <Footer />
          </>
        } />
        <Route path="/community" element={
          <>
            <Header />
            <Community />
            <Footer />
          </>
        } />
        <Route path="/trades" element={
          <>
            <Header />
            <Trades />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App
