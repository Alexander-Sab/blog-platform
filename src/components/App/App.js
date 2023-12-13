import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
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

import classes from './App.module.scss'

export function App() {
  const HeaderOrHeaderProfile = React.memo(() => {
    const location = useLocation()
    const isEditProfilePage = location.pathname === '/profile'
    const isArticlesPage = location.pathname.startsWith('/articles')
    const loggedIn = useSelector((state) => state.blog.loggedIn)

    if (loggedIn && isEditProfilePage) {
      return <HeaderProfile />
    }
    if (loggedIn && isArticlesPage) {
      return <HeaderProfile />
    }
    return <Header />
  })
  return (
    <Router>
      <div className={clsx(classes.App)}>
        <HeaderOrHeaderProfile />
        <Routes>
          <Route path="/" element={<Сontent />} />
          <Route path="/articles" element={<Сontent />} />
          <Route path="/articles/:slug" element={<OneArticle />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/profile" element={<EditProfile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
