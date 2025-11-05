
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.tsx";
import Footer from "./components/footer.tsx";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Article from "./pages/Article";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Trending from "./pages/Trending";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/trending" element={<Trending />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
