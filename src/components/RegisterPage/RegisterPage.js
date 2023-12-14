/* eslint-disable react/jsx-one-expression-per-line */
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// eslint-disable-next-line object-curly-newline
import { Form, Input, Button, Checkbox } from 'antd'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { fetchCreateUser, fetchLoginUser } from '../../store/blog'

import classes from './RegisterPage.module.scss'

export function RegisterPage() {
  const loggedIn = useSelector((state) => state.blog.loggedIn)
  const navigate = useNavigate()

  useEffect(() => {
    if (loggedIn) {
      navigate('/articles')
    }
  }, [loggedIn, navigate])

  const dispatch = useDispatch()
  const {
    formState: { errors, isSubmitting },
    watch,
  } = useForm()

  const onSubmit = (data) => {
    console.log('Form data:', data)
    dispatch(fetchCreateUser(data))
      .then(() => {
        dispatch(fetchLoginUser(data))
        navigate('/articles')
      })
      .catch((error) => {
        console.log('Registration error:', error)
      })
  }

  return (
    <section className={clsx(classes.UserForm)}>
      <h3 className={clsx(classes['UserForm-header'])}>Create new account</h3>
      <Form onFinish={onSubmit} errors={errors} validateTrigger="onBlur">
        <Form.Item
          name="username"
          label="Username"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: 'Username is required',
            },
            {
              min: 3,
              max: 20,
              message: 'Username must be between 3 and 20 characters',
            },
          ]}
        >
          <Input placeholder="Username" />
        </Form.Item>
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
        <Form.Item
          name="repeatPassword"
          label="Repeat Password"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: 'Repeat password is required',
            },
            {
              validate: (value) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                value === watch('password') || 'Passwords do not match',
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          validateStatus={errors.agreement ? 'error' : ''}
          help={errors.agreement && errors.agreement.message}
          rules={[
            {
              required: true,
              message:
                'You must agree to the processing of your personal information',
            },
          ]}
        >
          <Checkbox>
            I agree to the processing of my personal information
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            className={clsx(classes['UserForm-Buttone'])}
            type="primary"
            htmlType="submit"
            disabled={isSubmitting}
          >
            Create
          </Button>
        </Form.Item>
      </Form>
      <p>
        Already have an account? <a href="/signin">Sign In</a>
      </p>
    </section>
  )
}

export default RegisterPage
