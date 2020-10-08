import { createBrowserHistory } from "history";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router";
import { Link } from "react-router-dom";
import { Input, Form, Card, Button, Upload, message } from "antd";
import {
  Api,
  ApiImpl,
  DownstreamError,
  LoginFailedError,
  UserAlreadyExistsError,
} from "./api";
import { UploadOutlined } from "@ant-design/icons";
import "./App.css";
import { AuthToken, Post } from "./models";
import HttpClient from "./api/client";
import Modal from "antd/lib/modal/Modal";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { useForm } from "antd/lib/form/Form";
import { Store } from "antd/lib/form/interface";

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

  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  function showModal() {
    setVisibleModal(true);
  }

  function hideModal() {
    setVisibleModal(false);
  }

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
            <>
              <li>
                <Link to="/explore">Explore</Link>
              </li>
              <li>
                <Link to="new_post">
                  <Button onClick={showModal}>New Post</Button>
                  <NewPost
                    hideModal={hideModal}
                    visible={visibleModal}
                    api={api.current}
                  />
                </Link>
              </li>
            </>
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

interface NewPostProps {
  api: Api;
  visible: boolean;
  hideModal(): void;
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
