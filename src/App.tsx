import { createBrowserHistory } from "history";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { ApiImpl } from "./api";
import { Post } from "./models";
import HttpClient from "./api/client";
import { Cookies } from "react-cookie";
import "./App.css";
import "./index.css";
import { NewPostModal, Explore, Login, Signup } from "./components";

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

  async function getPosts(sortBy: SortBy, offset: number, limit: number) {
    let posts: Array<Post>;
    posts = await api.current.getPosts(sortBy, offset, limit);
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
            <Link className="topBarButton" to="/login">
              <Button>Log In</Button>
            </Link>
            <Link className="topBarButton" to="/signup">
              <Button>Signup</Button>
            </Link>
          </>
        )}
        {authToken && (
          <>
            <Link className="topBarButton" to="/explore">
              <Button>Explore</Button>
            </Link>
            <Link className="topBarButton" to="new_post">
              <Button onClick={showModal}>New Post</Button>
              <NewPostModal
                getPosts={getPosts}
                hideModal={hideModal}
                visible={visibleModal}
                api={api.current}
              />
            </Link>
            <Button className="topBarButton" onClick={logout}>
              Log Out
            </Button>
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
