import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddGereedschap from "./gereedschap/AddGereedschap";
import EditGereedschap from "./gereedschap/EditGereedschap";
import ViewGereedschap from "./gereedschap/ViewGereedschap";
import UploadGereedschap from "./gereedschap/UploadGereedschap";
import Registration from "./components/Registration";
import RegistrationSucces from "./components/RegistrationSucces";
import Login from "./components/Login";
import LoginSucces from "./components/LoginSucces";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Navbar />

          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/loginSucces" element={<LoginSucces />} />
            <Route exact path="/registration" element={<Registration />} />
            <Route
              exact
              path="/registrationSucces"
              element={<RegistrationSucces />}
            />

            <Route
              exact
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/addgereedschap"
              element={
                <ProtectedRoute>
                  <AddGereedschap />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/editgereedschap/:id"
              element={
                <ProtectedRoute>
                  <EditGereedschap />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/uploadgereedschap"
              element={
                <ProtectedRoute>
                  <UploadGereedschap />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/viewgereedschap/:id"
              element={
                <ProtectedRoute>
                  <ViewGereedschap />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
