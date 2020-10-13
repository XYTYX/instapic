import { createBrowserHistory } from "history";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router";
import { Link } from "react-router-dom";
import { Button, message } from "antd";
import { ApiImpl, DownstreamError } from "./api";
import { Post } from "./models";
import HttpClient from "./api/client";
import { Cookies } from "react-cookie";
import "./App.css";
import { NewPostModal, Explore, Login, Signup } from "./components";
import { SortBy } from "./components/explore";

export default function App() {
  const customHistory = createBrowserHistory();

  return (
    <>
      <Router history={customHistory}>
        <HistoryAwareApp />
      </Router>
    </>
  );
}

export function HistoryAwareApp() {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [inherit, setInherit] = useState<boolean>(false);

  // On app load, attempt to automatically log in the user via auth token stored in a cookie
  const cookies = new Cookies();
  const cookieJWT = cookies.get("instapic_jwt");
  const [authToken, setAuthToken] = useState<string>(
    cookieJWT ? cookieJWT : ""
  );
  let httpClient = useRef(new HttpClient(authToken));
  let api = useRef(new ApiImpl(httpClient.current));

  useEffect(() => {
    // This hook sets up our clients with the proper auth token
    httpClient.current.setAuthToken(authToken);
    api.current.setClient(httpClient.current);
  }, [authToken]);

  function showModal() {
    setVisibleModal(true);
  }

  function hideModal() {
    setVisibleModal(false);
  }

  async function getPosts(sortBy: SortBy, offset: number, limit: number) {
    let posts: Array<Post>;
    try {
      posts = await api.current.getPosts(sortBy, offset, limit);
      setPosts(posts);
    } catch (e) {
      if (e instanceof DownstreamError) {
        message.error(
          "Our systems seem to be experiencing issues, please try again later"
        );
      } else {
        throw e;
      }
    }
  }

  async function logout() {
    // If the response is successful, log out the user, and delete the cookie containing the auth token
    await api.current.logout();
    cookies.remove("instapic_jwt");
    setAuthToken("");
  }

  // If the user does not have a valid auth token, show them the login and signup screens,
  // if they do have a valid auth token, show them the explore screen
  return (
    <div className="App" style={inherit ? { height: "inherit" } : undefined}>
      <div className="navBar">
        {!authToken && (
          <>
            <Link className="navBarButton" to="/login">
              <Button>Log In</Button>
            </Link>
            <Link className="navBarButton" to="/signup">
              <Button>Signup</Button>
            </Link>
          </>
        )}
        {authToken && (
          <>
            <Link className="navBarButton" to="/explore">
              <Button>Explore</Button>
            </Link>
            <Link className="navBarButton" to="new_post">
              <Button onClick={showModal}>New Post</Button>
              <NewPostModal
                getPosts={getPosts}
                hideModal={hideModal}
                visible={visibleModal}
                api={api.current}
              />
            </Link>
            <Button className="navBarButton" onClick={logout}>
              Log Out
            </Button>
          </>
        )}
      </div>
      <div className="body gradient">
        <p className="spaced"></p>
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
              <Explore
                setInherit={setInherit}
                posts={posts}
                getPosts={getPosts}
                api={api.current}
              />
            )}
          </Route>
          <Route path="/">
            {!authToken ? (
              <Redirect to="login" />
            ) : (
              <Explore
                setInherit={setInherit}
                posts={posts}
                getPosts={getPosts}
                api={api.current}
              />
            )}
          </Route>
        </Switch>
      </div>
    </div>
  );
}
