import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Signin, Signup, Main, Search, Album, Community, Trades } from './pages';
import { Header, Footer } from './components';
import { AuthProvider } from './context/authContext';

function App() {
  return (
    <AuthProvider> {
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
    } </AuthProvider>
  );
}

export default App
