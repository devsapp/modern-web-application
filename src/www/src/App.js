import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import BasicLoyout from "./layout/index";
import "@b-design/ui/dist/index.css";
import "./App.scss";



function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/hubs/special-view" push />} />
        <Route exact path="*" component={BasicLoyout} />
      </Switch>
    </div>
  );
}

export default App;
