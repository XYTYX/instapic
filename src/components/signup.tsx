import { message, Input } from "antd";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import { Api, DownstreamError, UserAlreadyExistsError } from "../api";
import { AuthToken } from "../models";

interface SignupProps {
  api: Api;
  setAuthToken(authToken: string): void;
}

export function Signup(props: SignupProps) {
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
        <h2 className="spaced">Sign Up</h2>
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
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input />
          </FormItem>
          <FormItem
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
          </FormItem>
          <button>Sign Up</button>
        </Form>
      </div>
    </div>
  );
}
