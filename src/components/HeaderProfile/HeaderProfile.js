import clsx from 'clsx'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { logoutUser, updateUserProfile } from '../../store/blog'
import placeholderImage from '../ContentList/humanavatar.svg'

import classes from './HeaderProfile.module.scss'

export function HeaderProfile() {
  const userProfile = useSelector(
    (state) => state.blog.user?.user || state.blog.user,
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Переносим обновление данных пользователя в хук useEffect
    if (userProfile) {
      // Используем dispatch напрямую для обновления данных пользователя
      dispatch(updateUserProfile(userProfile))
    }
  }, [dispatch, userProfile])

  const handleImageError = (e) => {
    e.target.src = placeholderImage // Устанавливаем картинку-запаску в случае ошибки
  }
  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  if (!userProfile) {
    return null // Возвращаем null или другой компонент, если данные пользователя не доступны
  }

  const avatarSrc = userProfile.image || placeholderImage

  return (
    <section className={clsx(classes.header)}>
      <Link to="/articles" className={clsx(classes['header-text'])}>
        Realworld Blog
      </Link>
      <div className={clsx(classes['header-actions'])}>
        <Link
          to="/new-article"
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
            src={avatarSrc}
            alt="avatar"
            onError={handleImageError}
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
