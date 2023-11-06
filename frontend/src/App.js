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
import OrderDetail from './pages/OrderDetail';
import OrderList from './pages/OrderList';
import UserProfile from './pages/UserProfile';

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  // destrutturiamo dallo state l'oggetto cart e i dati dell'utente
  // che ha effettuato il login
  const { cart, userInfo } = state;

  const logoutHandler = () => {
    contextDispatch({
      type: 'USER_LOGOUT',
    });
    // cancelliamo l'utente, i dati di spedizione,
    // il metodo di pagamento scelto dal localStorage e
    // indirizziamo l'utente sulla pagina di login
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingData');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column app-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="success" expand="lg" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Vinylla Store</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto w-100 justify-content-end">
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
                      <LinkContainer to="/orderlist">
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
              </Navbar.Collapse>
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
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order" element={<Order />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/orderlist" element={<OrderList />} />
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
