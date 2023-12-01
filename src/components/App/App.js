import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import clsx from 'clsx'

import Header from '../Header'
import Сontent from '../Сontent'
import OneArticle from '../OneArticle'

import classes from './App.module.scss'

export function App() {
  return (
    <div className={clsx(classes.App)}>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Сontent />} />
          <Route path="/articles" element={<Сontent />} />
          <Route path="/articles/:slug" element={<OneArticle />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
