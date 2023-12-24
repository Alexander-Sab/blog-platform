import React from 'react'
import { Spin } from 'antd'
import clsx from 'clsx'

import classes from './LoadingSpinner.module.scss'

export function LoadingSpinner() {
  return (
    <div className={clsx(classes.spin, classes.content)}>
      <Spin />
    </div>
  )
}

export default LoadingSpinner
