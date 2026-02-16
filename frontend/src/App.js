import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNav from "./TopNav";
import Dashboard from "./Dashboard";
import Income from "./Income";

function App() {
  return (
    <Router>
      <TopNav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/income" element={<Income />} />
        {/* Transactions page will go here later */}
      </Routes>
    </Router>
  );
}

export default App;