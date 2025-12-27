import { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./store";
import AuthProvider from "@/providers/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";

import Layout from "./components/layout/Layout";

const BlogList = lazy(() => import("./pages/BlogList"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const MyBlogs = lazy(() => import("./pages/MyBlogs"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
    }}
  >
    Loading...
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<BlogList />} />
                <Route path="/blogs/:id" element={<BlogDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/blogs/new"
                  element={
                    <ProtectedRoute>
                      <BlogEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blogs/edit/:id"
                  element={
                    <ProtectedRoute>
                      <BlogEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-blogs"
                  element={
                    <ProtectedRoute>
                      <MyBlogs />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
