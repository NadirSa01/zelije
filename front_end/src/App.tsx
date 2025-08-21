import { Routes, Route } from "react-router-dom";
import ClientApp from "./clientApp";
import AdminApp from "./adminApp";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<ClientApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </div>
  );
}

export default App;
