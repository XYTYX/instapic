import { createBrowserHistory } from "history";
import React, { useEffect, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router";
import { Link } from "react-router-dom";
import { Input, Form } from "antd";
import {
  Api,
  ApiImpl,
  DownstreamError,
  LoginFailedError,
  UserAlreadyExistsError,
} from "./api";
import "./App.css";

export default function App() {
  const customHistory = createBrowserHistory();

  return (
    <div className="App">
      <Router history={customHistory}>
        <HistoryAwareApp />
      </Router>
    </div>
  );
}

function HistoryAwareApp() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const api = new ApiImpl("http://localhost:5000");

  return (
    <div className="App">
      <nav>
        <ul>
          {!loggedIn && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
          {loggedIn && (
            <li>
              <Link to="/">Explore</Link>
            </li>
          )}
        </ul>
      </nav>

      <Switch>
        <Route path="/login">
          {loggedIn ? (
            <Redirect to="/" />
          ) : (
            <Login api={api} setLoggedIn={setLoggedIn} />
          )}
        </Route>
        <Route path="/signup">
          {loggedIn ? (
            <Redirect to="/" />
          ) : (
            <Signup api={api} setLoggedIn={setLoggedIn} />
          )}
        </Route>
        <Route path="/">
          <Explore api={api} />
        </Route>
      </Switch>
    </div>
  );
}

interface ExploreProps {
  api: Api;
}

function Explore(props: ExploreProps) {
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    await props.api.
  });
  return <h2>Explore</h2>;
}

interface LoginProps {
  api: Api;
  setLoggedIn(loggedIn: boolean): void;
}

function Login(props: LoginProps) {
  const [error, setError] = useState<string>("");

  async function onSubmit({ email, password }: any) {
    let response;
    try {
      response = await props.api.login(email, password);
    } catch (e) {
      switch (e) {
        case e instanceof LoginFailedError: {
          setError(
            "Login unsuccessful, check your email and password. Did you mean to sign up?"
          );
          break;
        }
        case e instanceof DownstreamError: {
          setError(
            "Our systems seem to be experiencing issues, please try again later"
          );
          break;
        }
      }
    }
    console.log(response?.authorization);
    props.setLoggedIn(true);
  }

  return (
    <div>
      <h2>Login</h2>
      <Form onFinish={onSubmit}>
        <Form.Item label="Email" name="email">
          <Input required />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password required />
        </Form.Item>
        <button>Submit</button>
      </Form>
    </div>
  );
}

interface SignupProps {
  api: Api;
  setLoggedIn(loggedIn: boolean): void;
}

function Signup(props: SignupProps) {
  const [error, setError] = useState<string>("");

  async function onSubmit({ email, username, password }: any) {
    let response;
    try {
      response = await props.api.signup(email, username, password);
    } catch (e) {
      switch (e) {
        case e instanceof UserAlreadyExistsError: {
          setError("Email is already registered, did you mean to log in?");
          break;
        }
      }
    }
    console.log(response?.authorization);
    props.setLoggedIn(true);
  }

  return (
    <div>
      <h2>Sign up</h2>
      <Form onFinish={onSubmit}>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>
        <button>Submit</button>
      </Form>
    </div>
  );
}
