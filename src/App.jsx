import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Page404 from "./pages/Page404";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <AuthProvider>
      <div className="flex min-h-screen w-full flex-col bg-slate-200 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route
            exact
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
        <ToastContainer theme="dark" />
      </div>
    </AuthProvider>
  );
};

export default App;
