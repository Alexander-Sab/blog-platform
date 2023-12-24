/* eslint-disable react/jsx-one-expression-per-line */
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line object-curly-newline
import { Form, Input, Button, Alert } from 'antd'
import { useForm } from 'react-hook-form'

import { fetchLoginUser } from '../../store/blog'

import classes from './LoginPage.module.scss'

export function LoginPage() {
  const loggedIn = useSelector((state) => state.blog.loggedIn)
  const loginError = useSelector((state) => state.blog.error)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (loggedIn) {
      navigate('/articles')
    }
  }, [loggedIn, navigate])

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [loginError])

  const {
    formState: { errors, isSubmitting },
  } = useForm()

  const onFinish = (values) => {
    dispatch(fetchLoginUser(values))
  }

  return (
    <section className={clsx(classes.loginPage)}>
      <h3 className={clsx(classes['loginPage-header'])}> Sign In</h3>
      {visible && loginError && (
        <Alert message="Invalid logs or password!" type="error" showIcon />
      )}
      <Form onFinish={onFinish} errors={errors} validateTrigger="onBlur">
        <Form.Item
          name="email"
          label="Email address"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: 'Email address is required',
            },
            {
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Invalid email address',
            },
          ]}
        >
          <Input placeholder="Email address" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: 'Password is required',
            },
            {
              min: 6,
              message: 'Password must be at least 6 characters long',
            },
            {
              max: 40,
              message: 'Password must not exceed 40 characters',
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button
            className={clsx(classes['loginPage-Buttone'])}
            type="primary"
            htmlType="submit"
            disabled={isSubmitting}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
      <p>
        Don’t have an account? <a href="/signup">Sign Up.</a>
      </p>
    </section>
  )
}

export default LoginPage
