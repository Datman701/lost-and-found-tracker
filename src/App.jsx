import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LostItemsPage from "./pages/LostItemsPage";
import PostItemPage from "./pages/PostItemPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lost" element={<LostItemsPage />} />
          <Route path="/lost/post" element={<PostItemPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

