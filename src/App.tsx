import { createBrowserHistory } from "history";
import React, { useState } from "react";
import { Route, Router, Switch } from "react-router";
import { Link } from "react-router-dom";
import { Api, ApiImpl } from "./api";
import { Input } from "./api/components";
import "./App.css";

export default function App() {
  const customHistory = createBrowserHistory();
  const api = ApiImpl("http://localhost:5000");

  return (
    <Router history={customHistory}>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Explore</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/login">
            <Login api={api} />
          </Route>
          <Route path="/">
            <Explore />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Explore() {
  return <h2>Home</h2>;
}

interface LoginInterface {
  api: Api;
}

function Login(props: LoginInterface) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function onSubmit() {
    const response = await props.api.login(email, password);
    console.log(response.authorization);
  }

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={onSubmit}>
        <Input value={email} onChange={setEmail}></Input>
        <Input type="password" value={password} onChange={setPassword}></Input>
        <button>Submit</button>
      </form>
    </div>
  );
}
