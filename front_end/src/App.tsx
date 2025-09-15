import { Routes, Route } from "react-router-dom";
import ClientApp from "./clientApp";
import AdminApp from "./adminApp";
import LoginPage from "./admin/login/loginPage";
import PrivateRoute from "./privateRoutes";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<ClientApp />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminApp />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
