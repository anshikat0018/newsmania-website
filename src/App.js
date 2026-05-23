import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import Liked from "./pages/Liked";
import BlogByTag from "./pages/BlogByTag";
import Article from "./pages/Article";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

import NotFound from "./components/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-up" element={<Register />}/>
        <Route path="/sign-in" element={<Login />}/>
        <Route path="*" element={<NotFound />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="saved" element={<Saved />} />
          <Route path="liked" element={<Liked />} />
          <Route path="profile" element={<Profile />} />
          <Route path="blogs/tag/:tag" element={<BlogByTag />} />
          <Route path="article/:id" element={<Article />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}