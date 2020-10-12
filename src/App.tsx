import { createBrowserHistory } from "history";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router";
import { Link } from "react-router-dom";
import { Input, Form, Button, message } from "antd";
import {
  Api,
  ApiImpl,
  DownstreamError,
  LoginFailedError,
  UserAlreadyExistsError,
} from "./api";
import { AuthToken, Post } from "./models";
import HttpClient from "./api/client";
import { Cookies } from "react-cookie";
import "./App.css";
import "./index.css";
import { NewPostModal, Explore } from "./components";

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

export enum SortBy {
  MOST_RECENT = "most_recent",
  BY_USERS = "by_users",
}

function HistoryAwareApp() {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const cookies = new Cookies();
  const cookieJWT = cookies.get("instapic_jwt");
  const [authToken, setAuthToken] = useState<string>(
    cookieJWT ? cookieJWT : ""
  );
  let httpClient = useRef(new HttpClient(authToken));
  let api = useRef(new ApiImpl(httpClient.current));

  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  function showModal() {
    setVisibleModal(true);
  }

  function hideModal() {
    setVisibleModal(false);
  }

  async function getPosts(sortBy: SortBy) {
    let posts: Array<Post>;
    posts = await api.current.getPosts(sortBy);
    setPosts(posts);
  }

  async function logout() {
    await api.current.logout();
    cookies.remove("instapic_jwt");
    setAuthToken("");
  }

  useEffect(() => {
    httpClient.current.setAuthToken(authToken);
    api.current.setClient(httpClient.current);
  }, [authToken]);

  return (
    <div className="App">
      <p className="spaced"></p>
      <nav>
        {!authToken && (
          <>
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
            <Link to="/signup">
              <Button>Signup</Button>
            </Link>
          </>
        )}
        {authToken && (
          <>
            <Link to="/explore">
              <Button>Explore</Button>
            </Link>
            <Link to="new_post">
              <Button onClick={showModal}>New Post</Button>
              <NewPostModal
                getPosts={getPosts}
                hideModal={hideModal}
                visible={visibleModal}
                api={api.current}
              />
            </Link>
            <Button onClick={logout}>Log Out</Button>
          </>
        )}
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
          {!authToken ? (
            <Redirect to="login" />
          ) : (
            <Explore posts={posts} getPosts={getPosts} api={api.current} />
          )}
        </Route>
        <Route path="/">
          {!authToken ? (
            <Redirect to="login" />
          ) : (
            <Explore posts={posts} getPosts={getPosts} api={api.current} />
          )}
        </Route>
      </Switch>
    </div>
  );
}

interface LoginProps {
  api: Api;
  setAuthToken(authToken: string): void;
}

function Login(props: LoginProps) {
  async function onSubmit({ email, password }: any) {
    let response: AuthToken;
    try {
      response = await props.api.login(email, password);
      const cookies = new Cookies();
      const d1 = new Date();
      const d2 = new Date();
      d2.setMinutes(d1.getMinutes() + 15);
      cookies.set("instapic_jwt", response.authorization, { expires: d2 });
      props.setAuthToken(response.authorization);
    } catch (e) {
      if (e instanceof LoginFailedError) {
        message.error(
          "Login unsuccessful, check your email and password. Did you mean to sign up?"
        );
      } else if (e instanceof DownstreamError) {
        message.error(
          "Our systems seem to be experiencing issues, please try again later"
        );
      } else {
        throw e;
      }
    }
  }

  return (
    <div className="authForm">
      <h2 className="spaced">Log In</h2>
      <Form onFinish={onSubmit}>
        <Form.Item
          required
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter an email" },
            { type: "email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          required
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password />
        </Form.Item>
        <button>Log In</button>
      </Form>
    </div>
  );
}

interface SignupProps {
  api: Api;
  setAuthToken(authToken: string): void;
}

function Signup(props: SignupProps) {
  async function onSubmit({ email, username, password }: any) {
    let response: AuthToken;
    try {
      response = await props.api.signup(email, username, password);
      props.setAuthToken(response?.authorization);
    } catch (e) {
      if (e instanceof UserAlreadyExistsError) {
        message.error(
          "That email or username already exists, did you mean to log in?"
        );
      } else {
        throw e;
      }
    }
  }

  return (
    <div className="authForm">
      <h2 className="spaced">Sign Up</h2>
      <Form onFinish={onSubmit}>
        <Form.Item
          required
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter an email" },
            { type: "email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          required
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter a username" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          required
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter a password" },
            {
              min: 8,
              message:
                "Make sure your password is at least 8 characters in length",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <button>Sign Up</button>
      </Form>
    </div>
  );
}
