import { createBrowserHistory } from "history";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router";
import { Link } from "react-router-dom";
import {
  Input,
  Form,
  Card,
  Button,
  Upload,
  message,
  Image,
  Menu,
  Dropdown,
} from "antd";
import {
  Api,
  ApiImpl,
  DownstreamError,
  LoginFailedError,
  UserAlreadyExistsError,
} from "./api";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import "./App.css";
import { AuthToken, Post } from "./models";
import HttpClient from "./api/client";
import Modal from "antd/lib/modal/Modal";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { useForm } from "antd/lib/form/Form";
import { Store } from "antd/lib/form/interface";
import "./App.css";
import { MenuInfo } from "rc-menu/lib/interface";
import Meta from "antd/lib/card/Meta";

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
  BY_USER = "by_user",
}

function HistoryAwareApp() {
  const [authToken, setAuthToken] = useState<string>("");
  const [posts, setPosts] = useState<Array<Post>>([]);
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
              <NewPost
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

interface NewPostProps {
  api: Api;
  visible: boolean;
  hideModal(): void;
  getPosts(sortBy: SortBy): void;
}

function NewPost(props: NewPostProps) {
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = useForm();

  function onSubmit() {
    form.validateFields().then(async (values: Store) => {
      const fileContainer: UploadChangeParam = values.file;
      const text: string = values.text;
      let result;
      console.log(values);
      setConfirmLoading(true);
      try {
        result = await props.api.newPost(
          fileContainer.file.originFileObj!!,
          text
        );
      } catch (e) {}
      setConfirmLoading(false);
      props.hideModal();
      try {
        await props.getPosts(SortBy.MOST_RECENT);
      } catch (e) {}
    });
  }

  function onChange(info: UploadChangeParam) {
    let newFileList: Array<UploadFile> = [];
    switch (info.file.status) {
      case "uploading":
        newFileList = [info.file];
        break;
      case "done":
        newFileList = [info.file];
        break;
      default:
        newFileList = [];
    }
    setFileList(newFileList);
  }

  function dummyRequest({ onSuccess }: any) {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  }

  function validateFiletype(file: UploadFile) {
    const acceptedFileTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
    ];

    if (!acceptedFileTypes.includes(file.type)) {
      message.error(`${file.name} is not in a file format that we support`);
      return false;
    } else {
      return true;
    }
  }

  return (
    <Modal
      title="New Post"
      visible={props.visible}
      onCancel={props.hideModal}
      okText="Submit"
      okButtonProps={{ disabled: fileList.length === 0 }}
      onOk={onSubmit}
      confirmLoading={confirmLoading}
    >
      <Form form={form} preserve={false} name="validate_other">
        <Form.Item
          name="file"
          label="Image"
          extra="Please upload a .png, .jpg, .jpeg, or .gif image"
        >
          <Upload
            customRequest={dummyRequest}
            onChange={onChange}
            fileList={fileList}
            name="logo"
            listType="picture"
            beforeUpload={validateFiletype}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="text" label="Subtitle">
          <Input required />
        </Form.Item>
      </Form>
    </Modal>
  );
}

interface ExploreProps {
  api: Api;
  posts: Array<Post>;
  getPosts(sortBy: SortBy): void;
}

function Explore(props: ExploreProps) {
  const [posts, setPosts] = useState<Array<Post> | null>(null);
  const [sortMethod, setSortMethod] = useState<SortBy>(SortBy.MOST_RECENT);

  useEffect(() => {
    props.getPosts(sortMethod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMethod]);

  function renderPosts(posts: Array<Post> | null): React.ReactNode {
    if (posts === null || posts.length === 0) {
      return;
    }

    function onSortMethodClick({ key }: MenuInfo) {
      if (key === SortBy.MOST_RECENT) {
        setSortMethod(SortBy.MOST_RECENT);
      } else {
        setSortMethod(SortBy.BY_USER);
      }
    }

    const dropdownMenu = (
      <Menu onClick={onSortMethodClick}>
        <Menu.Item key={SortBy.MOST_RECENT}>Most Recent</Menu.Item>
        <Menu.Item key={SortBy.BY_USER}>By User</Menu.Item>
      </Menu>
    );

    function renderMostRecent(posts: Array<Post>): React.ReactNode {
      return (
        <div className="feed">
          {posts.map((it, index) => (
            <Card className="card" key={index}>
              <Image
                className="image"
                src={it.images[0].full_src}
                alt="hello"
              />
              <Meta title={it.text ? it.text : ""} />
            </Card>
          ))}
        </div>
      );
    }

    function renderByUser(posts: Array<Post>): React.ReactNode {
      const seenUsers: Set<string> = new Set();
      const filteredPosts: Array<Post> = [];

      posts.forEach((it) => {
        if (!seenUsers.has(it.user_id)) {
          seenUsers.add(it.user_id);
          filteredPosts.push(it);
        }
      });

      return (
        <div className="rowFeed">
          {filteredPosts.map((it, index) => (
            <Card className="rowCard" key={index}>
              <Image
                className="image"
                src={it.images[0].full_src}
                alt="hello"
              />
              <Meta title={} />
            </Card>
          ))}
        </div>
      );
    }

    return (
      <>
        <Dropdown overlay={dropdownMenu} trigger={["click"]}>
          <Button type="text">
            Sort By <DownOutlined />
          </Button>
        </Dropdown>
        {sortMethod === SortBy.MOST_RECENT
          ? renderMostRecent(posts)
          : renderByUser(posts)}
      </>
    );
  }

  return (
    <div className="spaced">
      <h2 style={{ marginBottom: 0 }}>Explore</h2>
      {renderPosts(props.posts)}
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
