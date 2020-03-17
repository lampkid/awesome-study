import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

  import ReactLifeCycle from './pages/ReactLifeCycle';


  export default function AppRouter() {
      return (
        <Router>
            <ul>
                <li><Link to="/">Home</Link></li>

                <li><Link to="/learn-react/nested-lifecycle">React nested lifecycle</Link></li>
            </ul>

            <Switch>
                <Route path="/learn-react/nested-lifecycle">
                    <ReactLifeCycle />
                </Route>
            </Switch>
        </Router>
      );

  }