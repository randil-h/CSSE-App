import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import LandingPage from "./pages/landingPage";
import {Route, Routes} from "react-router-dom";
import LoadingAnimation from "./components/utility/LoadingAnimation";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/customers_pages/Customers";
import Collectors from "./pages/collectors_pages/Collectors";
import Schedules from "./pages/schedules_pages/Schedules";
import Transactions from "./pages/transactions_pages/Transactions";
import Reports from "./pages/reports_pages/Reports";

function App() {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // Simulate 2 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="App">
        {loading ? (
            <LoadingAnimation/>
        ) : (
            <Routes>
              <Route path="/" element={<LandingPage/>}/>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/customers/home" element={<Customers />} />
              <Route path="/collectors/home" element={<Collectors />} />
              <Route path="/schedules/home" element={<Schedules />} />
              <Route path="/transactions/home" element={<Transactions />} />
              <Route path="/reports/home" element={<Reports />} />
            </Routes>
        )}
      </div>
  );
}

export default App;
