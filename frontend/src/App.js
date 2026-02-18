import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNav from "./TopNav";
import Dashboard from "./Dashboard";
import Income from "./Income";
import RecentTransactions from "./RecentTransactions";

function App() {
  return (
    <Router>
      <TopNav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<RecentTransactions />} />
        <Route path="/income" element={<Income />} />
      </Routes>
    </Router>
  );
}

export default App;
