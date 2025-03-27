"use client";
import React from "react";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();

  const onFinish = async (values) => {
    const { username, password } = values;
    try {
      const token = await authService.login(username, password);
      message.success("Login successful!");
      // You can redirect or perform any other actions here
      router.push("/dashboard");
    } catch (error) {
      message.error("Login failed: " + error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
    message.error("Please fill out the form correctly.");
  };
  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
