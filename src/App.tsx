import { createBrowserHistory } from "history";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router";
import { Link } from "react-router-dom";
import { Input, Form, Card } from "antd";
import {
  Api,
  ApiImpl,
  DownstreamError,
  LoginFailedError,
  UserAlreadyExistsError,
} from "./api";
import "./App.css";
import { AuthToken, Post } from "./models";
import HttpClient from "./api/client";

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
  const [authToken, setAuthToken] = useState<string>("");
  let httpClient = useRef(new HttpClient(authToken));
  let api = useRef(new ApiImpl(httpClient.current));

  useEffect(() => {
    httpClient.current.setAuthToken(authToken);
    api.current.setClient(httpClient.current);
  }, [authToken]);

  return (
    <div className="App">
      <nav>
        <ul>
          {!authToken && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
          {authToken && (
            <li>
              <Link to="/explore">Explore</Link>
            </li>
          )}
        </ul>
      </nav>

      <Switch>
        <Route path="/login">
          {authToken ? (
            <Redirect to="/" />
          ) : (
            <Login api={api.current} setAuthToken={setAuthToken} />
          )}
        </Route>
        <Route path="/signup">
          {authToken ? (
            <Redirect to="/" />
          ) : (
            <Signup api={api.current} setAuthToken={setAuthToken} />
          )}
        </Route>
        <Route path="/explore">
          {!authToken ? <Redirect to="login" /> : <Explore api={api.current} />}
        </Route>
        <Route path="/">
          {!authToken ? <Redirect to="login" /> : <Explore api={api.current} />}
        </Route>
      </Switch>
    </div>
  );
}

interface ExploreProps {
  api: Api;
}

export enum SortBy {
  MOST_RECENT = "most_recent",
  BY_USER = "by_user",
}

function Explore(props: ExploreProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Array<Post> | null>(null);
  const [sortMethod, setSortMethod] = useState<SortBy>(SortBy.MOST_RECENT);

  useEffect(() => {
    async function getPosts() {
      let posts: Array<Post>;
      posts = await props.api.getPosts(sortMethod);
      setPosts(posts);
    }
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMethod]);

  function renderPosts(posts: Array<Post> | null): React.ReactNode {
    if (posts === null) {
      return;
    }

    console.log(posts);

    return (
      <>
        {posts.map((it, index) => (
          <Card key={index} title={it.text}>
            {it.created_on}
          </Card>
        ))}
      </>
    );
  }

  return (
    <div>
      <h2>Explore</h2>
      {renderPosts(posts)}
    </div>
  );
}

interface LoginProps {
  api: Api;
  setAuthToken(authToken: string): void;
}

function Login(props: LoginProps) {
  const [error, setError] = useState<string>("");

  async function onSubmit({ email, password }: any) {
    let response: AuthToken;
    try {
      response = await props.api.login(email, password);
      props.setAuthToken(response.authorization);
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
  setAuthToken(authToken: string): void;
}

function Signup(props: SignupProps) {
  const [error, setError] = useState<string>("");

  async function onSubmit({ email, username, password }: any) {
    let response: AuthToken;
    try {
      response = await props.api.signup(email, username, password);
      props.setAuthToken(response?.authorization);
    } catch (e) {
      switch (e) {
        case e instanceof UserAlreadyExistsError: {
          setError("Email is already registered, did you mean to log in?");
          break;
        }
        default: {
          throw e;
        }
      }
    }
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
