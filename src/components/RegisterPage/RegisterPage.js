/* eslint-disable react/jsx-one-expression-per-line */
import clsx from 'clsx'
// eslint-disable-next-line object-curly-newline
import { Form, Input, Button, Checkbox } from 'antd'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { fetchCreateUser } from '../../store/blog'

import classes from './RegisterPage.module.scss'

export function RegisterPage() {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm()
  const registrationStatus = useSelector(
    (state) => state.blog.registrationStatus,
  )

  const onSubmit = (data) => {
    console.log('Form data:', data)
    dispatch(fetchCreateUser(data))
  }

  useEffect(() => {
    if (registrationStatus === 'success') {
      // Обработка успешной регистрации
      console.log('Регистрация прошла успешно')
    } else if (registrationStatus === 'error') {
      // Обработка ошибки регистрации
      console.log('Ошибка регистрации')
    }
  }, [registrationStatus])

  return (
    <section className={clsx(classes.UserForm)}>
      <h3 className={clsx(classes['UserForm-header'])}>Create new account</h3>
      <Form
        onFinish={handleSubmit(onSubmit)}
        errors={errors}
        validateTrigger="onBlur"
      >
        <Form.Item
          name="username"
          label="Username"
          labelCol={{ span: 24 }}
          validateStatus={
            errors.username && errors.username.type === 'required'
              ? 'error'
              : ''
          }
          help={errors?.username?.message}
        >
          <Input
            placeholder="Username"
            name="username"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('username', {
              required: {
                value: true,
                message: 'Username is required',
              },
              maxLength: {
                value: 20,
                message: 'Username must not exceed 20 characters',
              },
            })}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email address"
          labelCol={{ span: 24 }}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email && errors.email.message}
        >
          <Input
            placeholder="Email address"
            name="email"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('email', {
              required: {
                value: true,
                message: 'Email address is required',
              },
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
            name="password"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('password', {
              required: {
                value: true,
                message: 'Password is required',
              },
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
        <Form.Item
          name="repeatPassword"
          label="Repeat Password"
          labelCol={{ span: 24 }}
          validateStatus={errors.repeatPassword ? 'error' : ''}
          help={errors.repeatPassword && errors.repeatPassword.message}
        >
          <Input.Password
            placeholder="Password"
            name="repeatPassword"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('repeatPassword', {
              required: {
                value: true,
                message: 'Repeat password is required',
              },
              validate: (value) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                value === watch('password') || 'Passwords do not match',
            })}
          />
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