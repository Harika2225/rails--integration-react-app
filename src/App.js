import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskList from "./components/TaskList";
import CustomerList from "./components/CustomerList";
import TaskReport from "./components/TaskReport";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/customer" element={<CustomerList />} />
          <Route path="/report" element={<TaskReport />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
