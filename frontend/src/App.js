import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Vinyl from './pages/Vinyl';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">Vinylla Store</Link>
        </header>
        <main>
          <Routes>
            <Route path="/vinyl/:path" element={<Vinyl />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
