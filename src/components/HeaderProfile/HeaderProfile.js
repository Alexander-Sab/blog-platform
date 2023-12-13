import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { logoutUser } from '../../store/blog'

import classes from './HeaderProfile.module.scss'

export function HeaderProfile() {
  const userProfile = useSelector(
    (state) => state.blog.user?.user || state.blog.user,
  )
  console.log('userProfile', userProfile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  if (!userProfile) {
    return null // Возвращаем null или другой компонент, если данные пользователя не доступны
  }

  return (
    <section className={clsx(classes.header)}>
      <Link to="/" className={clsx(classes['header-text'])}>
        Realworld Blog
      </Link>
      <div className={clsx(classes['header-actions'])}>
        <Link
          to="/profile"
          className={clsx(classes['header-actions__Create-article'])}
        >
          Create article
        </Link>
        <Link
          to="/profile"
          className={clsx(classes['header-actions__profile'])}
        >
          <div className={clsx(classes['header-actions__profile-user'])}>
            {userProfile.username}
          </div>
          <img
            className={clsx(classes['header-actions__profile-avatar'])}
            src={userProfile.image}
            alt="avatar"
          />
        </Link>
        <Link
          to="/"
          className={classes['header-actions__Log-Out']}
          onClick={handleLogout}
        >
          Log Out
        </Link>
      </div>
    </section>
  )
}

export default HeaderProfile
