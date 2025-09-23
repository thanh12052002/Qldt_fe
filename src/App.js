import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import RegisterForm from "./pages/LoginSuccess.jsx";
import { AuthProvider } from "./context/user/AuthContext.jsx";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<RegisterForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
