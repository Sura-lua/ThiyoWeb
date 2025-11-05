import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TableProvider } from './contexts/TableContext';
import { ProductProvider } from './contexts/ProductContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import TableSelector from './components/TableSelector';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TableProvider>
          <ProductProvider>
            <Routes>
              <Route path="/" element={<TableSelector />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </ProductProvider>
        </TableProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
