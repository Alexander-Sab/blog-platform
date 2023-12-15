/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-one-expression-per-line */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
// eslint-disable-next-line object-curly-newline
import { Form, Input, Button } from 'antd'
import { useForm } from 'react-hook-form'

// import { useDispatch } from 'react-redux'
import { fetchUpdateUserProfile } from '../../store/blog'

import classes from './EditProfile.module.scss'

export function UserHat() {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const {
    formState: { errors, isSubmitting },
  } = useForm()
  const onSubmit = (data) => {
    dispatch(fetchUpdateUserProfile(data))
  }
  const user = useSelector((state) => state.blog.user?.user || state.blog.user)

  useEffect(() => {
    // Set form field values on component load
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
      })
    }
  }, [form, user])

  if (!user) {
    return null // Return null or another component if user data is not available
  }

  return (
    <section className={clsx(classes.UserForm)}>
      <h3 className={clsx(classes['UserForm-header'])}>Create new account</h3>
      <Form
        form={form}
        onFinish={onSubmit}
        errors={errors}
        validateTrigger="onBlur"
      >
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
          label="New password "
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
          <Input.Password placeholder="New password" />
        </Form.Item>
        <Form.Item
          name="image"
          label="Avatar image"
          labelCol={{ span: 24 }}
          rules={[
            {
              type: 'url',
              message: 'Please enter a valid URL',
            },
          ]}
        >
          <Input placeholder="Avatar image" />
        </Form.Item>
        <Form.Item>
          <Button
            className={clsx(classes['UserForm-Buttone'])}
            type="primary"
            htmlType="submit"
            disabled={isSubmitting}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </section>
  )
}

export default UserHat
