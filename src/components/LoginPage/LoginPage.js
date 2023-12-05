/* eslint-disable react/jsx-one-expression-per-line */
import clsx from 'clsx'
import { Form, Input, Button } from 'antd'
import { useForm } from 'react-hook-form'

import classes from './LoginPage.module.scss'

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onFinish = (values) => {
    // Handle form submission and process form data
    console.log('Form values:', values)
  }
  return (
    <section className={clsx(classes.loginPage)}>
      <h3 className={clsx(classes['loginPage-header'])}> Sign In</h3>
      <Form onFinish={handleSubmit(onFinish)}>
        <Form.Item
          name="email"
          label="Email address"
          labelCol={{ span: 24 }}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email && errors.email.message}
        >
          <Input
            placeholder="Email address"
            id="emailInput"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            })}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          labelCol={{ span: 24 }}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password && errors.password.message}
        >
          <Input.Password
            placeholder="Password"
            id="passwordInput"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('Password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
              maxLength: {
                value: 40,
                message: 'Password must not exceed 40 characters',
              },
            })}
          />
        </Form.Item>

        <Form.Item>
          <Button
            className={clsx(classes['loginPage-Buttone'])}
            type="primary"
            htmlType="submit"
          >
            Create
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
