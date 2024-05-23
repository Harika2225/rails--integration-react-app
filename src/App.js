import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskReport from "./components/TaskReport";

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={TaskList} />
          <Route path="/report" component={TaskReport} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
