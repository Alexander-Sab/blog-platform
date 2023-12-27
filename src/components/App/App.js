import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import Header from '../Header'
import Сontent from '../Сontent'
import OneArticle from '../OneArticle'
import RegisterPage from '../RegisterPage'
import LoginPage from '../LoginPage'
import EditProfile from '../EditProfile'
import HeaderProfile from '../HeaderProfile'
import NewArticle from '../NewArticle'
import EditArticle from '../EditArticle'
import { PATH } from '../../constants/constants'

import classes from './App.module.scss'

export function App() {
  const loggedIn = useSelector((state) => state.blog.loggedIn)

  const HeaderOrHeaderProfile = React.memo(() => {
    const location = useLocation()
    const isEditProfilePage = location.pathname === PATH.PROFILE
    const isArticlesPage = location.pathname.startsWith(PATH.ARTICLES)
    const isCreateArticlePage = location.pathname === PATH.NEW_ARTICLE
    const isLoggedIn = loggedIn

    if (isLoggedIn && isEditProfilePage) {
      return <HeaderProfile />
    }
    if (isLoggedIn && (isArticlesPage || isCreateArticlePage)) {
      return <HeaderProfile />
    }
    return <Header />
  })

  return (
    <Router>
      <div className={clsx(classes.App)}>
        <HeaderOrHeaderProfile />
        <Routes>
          <Route path={PATH.ROOT} element={<Сontent />} />
          <Route path={PATH.ARTICLES} element={<Сontent />} />
          <Route path={PATH.ARTICLE_BY_SLUG} element={<OneArticle />} />
          <Route path={PATH.SIGN_UP} element={<RegisterPage />} />
          <Route path={PATH.SIGN_IN} element={<LoginPage />} />
          <Route
            path={PATH.PROFILE}
            element={
              loggedIn ? <EditProfile /> : <Navigate to={PATH.SIGN_IN} />
            }
          />
          <Route
            path={PATH.NEW_ARTICLE}
            element={loggedIn ? <NewArticle /> : <Navigate to={PATH.SIGN_IN} />}
          />
          <Route
            path={PATH.EDIT_ARTICLE}
            element={
              loggedIn ? <EditArticle /> : <Navigate to={PATH.SIGN_IN} />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
