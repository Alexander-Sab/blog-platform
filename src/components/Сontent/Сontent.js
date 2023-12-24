import { useEffect, useState } from 'react'
import { Pagination } from 'antd'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'

import ContentList from '../ContentList'
import { getPosts } from '../../store/blog'
import LoadingSpinner from '../LoadingSpinner'
import { PAGE_SIZE } from '../../constants/constants'
import { generateArticlesId } from '../../utils/utils'

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
    dispatch(getPosts({ currentPage: page, pageSize: PAGE_SIZE }))
  }

  useEffect(() => {
    setLoading(true)
    dispatch(getPosts({ currentPage, pageSize: PAGE_SIZE }))
      .then(() => {
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
      .catch((error) => {
        setErrorMessage(error.message)
        setLoading(false)
      })
  }, [currentPage, dispatch])

  if (loading) {
    return <LoadingSpinner />
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

  return (
    <section className={clsx(classes.content)}>
      {posts.map((articles) => {
        const ArticlesId = generateArticlesId(articles)
        return <ContentList key={ArticlesId} articles={articles} />
      })}
      <div className={clsx(classes.pagination)}>
        <Pagination
          current={currentPage}
          total={totalPages}
          pageSize={PAGE_SIZE}
          onChange={handlePageChange}
        />
      </div>
    </section>
  )
}

export default Сontent
