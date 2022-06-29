import { Route, BrowserRouter, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageLayout from "./pages/PageLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecoilDemoParent from "./components/RecoilDemo/RecoilDemoParent";
import TenantForm from "./components/Dashboard/Tenants/TenantForm";
import Tenants from "./components/Dashboard/Tenants/Tenants";

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PageLayout />}>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="/dashboard/tenants" element={<Tenants />} />
                <Route path="/dashboard/tenant/new" element={<TenantForm />} />
              </Route>
            </Route>
            <Route path="/recoildemo" element={<RecoilDemoParent />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
