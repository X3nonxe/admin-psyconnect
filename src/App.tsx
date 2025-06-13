import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/home/Home';
import Users from './pages/users/Users';
import Psikologs from './pages/psikolog/Psikologs';
import Products from './pages/products/Products';
import User from './pages/user/User';
import Product from './pages/product/Product';
import Login from './pages/login/Login';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Menu from './components/menu/Menu';
import './styles/global.scss';

// Query Client untuk caching API
const queryClient = new QueryClient();

const Layout = () => (
  <div className="main">
    <Navbar />
    <div className="container">
      <div className="menuContainer">
        <Menu />
      </div>
      <div className="contentContainer">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </div>
    </div>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  // Rute Publik
  {
    path: '/login',
    element: <Login />,
  },

  // Rute Privat (Semua rute di bawah ini diproteksi)
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: '/users', element: <Users /> },
      { path: '/psikolog', element: <Psikologs /> },
      { path: '/products', element: <Products /> },
      { path: '/users/:id', element: <User /> },
      { path: '/products/:id', element: <Product /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
