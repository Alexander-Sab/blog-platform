import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import clsx from 'clsx'

import Header from '../Header'
import Сontent from '../Сontent'
import OneArticle from '../OneArticle'
import RegisterPage from '../RegisterPage'
import LoginPage from '../LoginPage'
import UserHat from '../UserHat'

import classes from './App.module.scss'

export function App() {
  return (
    <div className={clsx(classes.App)}>
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Сontent />} />
          <Route path="/articles" element={<Сontent />} />
          <Route path="/articles/:slug" element={<OneArticle />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/profile" element={<UserHat />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
