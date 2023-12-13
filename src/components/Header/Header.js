import clsx from 'clsx'
import { Link } from 'react-router-dom'

import classes from './Header.module.scss'

export function Header() {
  return (
    <section className={clsx(classes.header)}>
      <Link to="/articles" className={clsx(classes['header-text'])}>
        Realworld Blog
      </Link>
      <div className={clsx(classes['header-control'])}>
        <Link to="/signin" className={clsx(classes['header-control__buttons'])}>
          Sign In
        </Link>
        <Link to="/signup" className={clsx(classes['header-control__buttons'])}>
          Sign Up
        </Link>
      </div>
    </section>
  )
}

export default Header
