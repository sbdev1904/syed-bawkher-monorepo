import React from "react";
import { Form, Input, Button, message } from "antd";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { username, password } = values;
    try {
      const token = await authService.login(username, password);
      message.success("Login successful!");
      // You can redirect or perform any other actions here
      navigate("/");
    } catch (error) {
      message.error("Login failed. Please check your username and password.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
    message.error("Please fill out the form correctly.");
  };
  return (
    <>
      <div className="">
        <h1 className="text-3xl font-semibold pb-3">Login</h1>
        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
