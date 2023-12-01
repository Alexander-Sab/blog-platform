import clsx from 'clsx'

import classes from './Header.module.scss'

export function Header() {
  return (
    <section className={clsx(classes.header)}>
      <div className={clsx(classes['header-text'])}>Realworld Blog</div>
      <div className="header-control">
        <button
          className={clsx(classes['header-control__buttons'])}
          type="button"
        >
          Sign In
        </button>
        <button
          className={clsx(classes['header-control__buttons'])}
          type="button"
        >
          Sign Up
        </button>
      </div>
    </section>
  )
}
export default Header
