import { message, Input } from "antd";
import Form from "antd/lib/form/Form";
import React from "react";
import FormItem from "antd/lib/form/FormItem";
import { Cookies } from "react-cookie";
import { Api, LoginFailedError, DownstreamError } from "../api";
import { AuthToken } from "../models";

interface LoginProps {
  api: Api;
  setAuthToken(authToken: string): void;
}

export function Login(props: LoginProps) {
  async function onSubmit({ email, password }: any) {
    let response: AuthToken;
    try {
      response = await props.api.login(email, password);

      // If the response is successful, set a cookie containing the auth token on the browser that is valid for 15 minutes
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
      <div className="float shadowed">
        <h2>Log In</h2>
        <Form onFinish={onSubmit}>
          <FormItem
            required
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter an email" },
              { type: "email" },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            required
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password />
          </FormItem>
          <button>Log In</button>
        </Form>
      </div>
    </div>
  );
}
