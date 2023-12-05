import clsx from 'clsx'
import { Form, Input, Button } from 'antd'

import classes from './UserHat.module.scss'

export function UserHat() {
  const onFinish = (values) => {
    // Обработка отправки формы, например, обновление информации пользователя на сервере
    console.log('Form values:', values)
  }

  return (
    <div className={clsx(classes.hello)}>
      <h2>Profile Page</h2>
      <Form onFinish={onFinish}>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default UserHat
