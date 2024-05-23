import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ExampleComponent from "./components/TaskList";
import TaskReport from "./components/TaskReport";

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={ExampleComponent} />
          <Route path="/report" component={TaskReport} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
