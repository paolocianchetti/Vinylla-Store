import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Home from './pages/Home';
import Vinyl from './pages/Vinyl';
import Cart from './pages/Cart';
import { Store } from './Store';
import { useContext } from 'react';

function App() {
  const { state } = useContext(Store);
  // destrutturiamo l'oggetto cart dallo state
  const { cart } = state;

  return (
    <BrowserRouter>
      <div className="d-flex flex-column app-container">
        <header>
          <Navbar bg="success" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Vinylla Store</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Carrello
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vinyl/:path" element={<Vinyl />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">&copy; 2023 - Vinylla Store</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
