import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Store } from './Store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getError } from './errors';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
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
import Search from './components/Search';
import SearchResult from './pages/SearchResult';

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

  // definiamo uno state per la sidebar
  const [sidebarActive, setSidebarActive] = useState(false);

  // definiamo uno state per i generi musicali
  const [genres, setGenres] = useState([]);

  const getGenres = async () => {
    try {
      const { data } = await axios.get(`/api/vinyls/genres`);
      setGenres(data);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarActive
            ? 'd-flex flex-column app-container contract-container'
            : 'd-flex flex-column app-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="success" expand="lg" variant="dark">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarActive(!sidebarActive)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Vinylla Store</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Search />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Carrello
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce(
                          (acc, current) => acc + current.quantity,
                          0
                        )}
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
        <div
          className={
            sidebarActive
              ? 'd-flex flex-column justify-content-between flex-wrap sidebar-nav open-sidebar'
              : 'd-flex flex-column justify-content-between flex-wrap sidebar-nav'
          }
        >
          <Nav className="flex-column w-100 p-2 text-white">
            <Nav.Item>
              <strong>Genere</strong>
            </Nav.Item>
            {genres.map((genre) => (
              <Nav.Item key={genre}>
                <LinkContainer
                  to={{ pathname: '/search', search: `?genre=${genre}` }}
                  onClick={() => setSidebarActive(false)}
                >
                  <Nav.Link>{genre}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vinyl/:path" element={<Vinyl />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/search" element={<SearchResult />} />
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
