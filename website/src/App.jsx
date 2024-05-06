import React, {
  Suspense,
  lazy,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./styles.css";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Lazy load the components
import HomePage from "./pages/Home";
import Cookies from "js-cookie";
import MainPage from "./pages/Home";
import "./styles.css";
import Footer from "./components/Footer";
const AboutPage = lazy(() => import("./pages/About"));
const ContactPage = lazy(() => import("./pages/Contact"));
const CasesPage = lazy(() => import("./pages/Cases/Index"));
const CasePage = lazy(() => import("./pages/Cases/Show"));
const CaseCreatePage = lazy(() => import("./pages/Cases/Create"));
const CaseEditPage = lazy(() => import("./pages/Cases/Update"));
const CaseDeletePage = lazy(() => import("./pages/Cases/Delete"));
const RegisterPage = lazy(() => import("./pages/Users/Register"));
const LoginPage = lazy(() => import("./pages/Users/Login"));
const ProfilePage = lazy(() => import("./pages/Users/Profile"));
const LogoutPage = lazy(() => import("./pages/Users/Logout"));

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let user = Cookies.get("user");

    if (!user) return;

    user = JSON.parse(user);
    const fetchData = async () => {
      try {
        const userResp = await axios.get(`/api/users/${user.id}`);

        setUser(userResp.data);
      } catch (error) {
        Cookies.remove("user");
        setUser(null);
        return;
      }
    };

    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <ToastContainer />
        <Navigation user={user} />
        <Suspense
          fallback={<div className="text-2xl text-center">Loading...</div>}
        >
          {" "}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/cases/:id" element={<CasePage />} />
            <Route path="/cases/create" element={<CaseCreatePage />} />
            <Route path="/cases/:id/update" element={<CaseEditPage />} />
            <Route path="/cases/:id/delete" element={<CaseDeletePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
