import { useContext } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Store } from './Store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Home from './pages/Home';
import Vinyl from './pages/Vinyl';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import Order from './pages/Order';

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  // destrutturiamo dallo state l'oggetto cart e i dati dell'utente
  // che ha effettuato il login
  const { cart, userInfo } = state;

  const logoutHandler = () => {
    contextDispatch({
      type: 'USER_LOGOUT',
    });
    // cancelliamo l'utente, i dati di spedizione
    // e il metodo di pagamento scelto dal localStorage
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingData');
    localStorage.removeItem('paymentMethod');
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column app-container">
        <ToastContainer position="bottom-center" limit={1} />
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
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profilo Utente</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/history">
                      <NavDropdown.Item>Ordini</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#logout"
                      onClick={logoutHandler}
                    >
                      Logout
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                )}
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order" element={<Order />} />
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
