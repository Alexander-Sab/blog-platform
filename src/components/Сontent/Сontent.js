import { useEffect, useState } from 'react'
import { Pagination, Spin } from 'antd'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'

import ContentList from '../ContentList'
import { getPosts } from '../../store/blog'

import classes from './Сontent.module.scss'

export function Сontent() {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.blog.posts)
  const totalPages = useSelector((state) => state.blog.totalPages)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    dispatch(getPosts(page))
  }
  console.log()

  useEffect(() => {
    setLoading(true)
    dispatch(getPosts(currentPage))
      .then(() => {
        setTimeout(() => {
          setLoading(false)
        }, 1000) // Задержка в 5 секунд
      })
      .catch((error) => {
        setErrorMessage(error.message)
        setLoading(false)
      })
  }, [currentPage, dispatch])

  if (loading) {
    return (
      <div className={clsx(classes.spin, classes.content)}>
        <Spin />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div>
        Error:
        <br />
        {errorMessage}
      </div>
    )
  }
  const generateArticlesId = (articles) => {
    const { title, createdAt, username } = articles
    const id = `${title}${createdAt}${username}`
    return id
  }
  return (
    <section className={clsx(classes.content)}>
      {posts.map((articles) => {
        const ArticlesId = generateArticlesId(articles)
        return <ContentList key={ArticlesId} articles={articles} />
      })}
      <Pagination
        className={clsx(classes.pagination)}
        current={currentPage}
        total={totalPages} // Умножайте на количество статей на странице
        onChange={handlePageChange}
      />
    </section>
  )
}

export default Сontent
