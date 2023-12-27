import clsx from 'clsx'
import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Popconfirm } from 'antd'

import { generateFormattedDate } from '../../utils/utils'
import { deleteArticle, clearCurrentArticle, getPosts } from '../../store/blog'
import LikeButton from '../LikeButton'
import LoadingSpinner from '../LoadingSpinner'
import classes from '../ContentList/ContentList.module.scss'
import placeholderImage from '../ContentList/humanavatar.svg'

export function OneArticle() {
  const { slug } = useParams()
  const oneArticle = useSelector((state) => state.blog.posts)
  const loggedIn = useSelector((state) => state.blog.loggedIn)
  const currentUser = useSelector(
    (state) => state.blog.user?.user || state.blog.user,
  )
  const token = useSelector(
    (state) => state.blog.user?.token || state.blog.user?.user?.token,
  )
  const articles = oneArticle.find((item) => item.slug === slug)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getPosts(slug))
  }, [dispatch, slug])
  if (!articles || !articles.slug) {
    return <LoadingSpinner />
  }

  const author = articles.author || {}

  const handleDelete = () => {
    dispatch(deleteArticle({ slug: articles.slug, token }))
    dispatch(clearCurrentArticle())
    navigate('/articles')
  }

  const handleImageError = (e) => {
    e.target.src = placeholderImage
  }
  const avatarSrc = author.image || placeholderImage

  return (
    <section className={clsx(classes.content)}>
      <div className={clsx(classes.contentList)}>
        <div className={clsx(classes['contentList-PostHeader'])}>
          <div className={clsx(classes['contentList-PostHeader___content'])}>
            <div
              className={clsx(
                classes['contentList-PostHeader___content-title'],
              )}
            >
              <a
                className={clsx(
                  classes['contentList-PostHeader___content-title-link'],
                )}
                to={`/oneArticle /${oneArticle.slug}`}
              >
                {articles.title}
              </a>
              <div
                className={clsx(
                  classes['contentList-PostHeader___content-like'],
                )}
              >
                <span
                  className={clsx(
                    classes['contentList-PostHeader___content-like-anticon'],
                  )}
                >
                  <LikeButton article={articles} />
                </span>
              </div>
            </div>
            {articles.tagList && articles.tagList.length > 0 && (
              <span
                className={clsx(
                  classes['contentList-PostHeader___content-tags-tag'],
                )}
              >
                {articles.tagList}
              </span>
            )}
            <div
              className={clsx(
                classes['contentList-PostHeader___content-description'],
              )}
            >
              {articles.description}
            </div>
            <div
              className={clsx(classes['contentList-PostHeader___content-body'])}
            >
              <ReactMarkdown>{articles.body}</ReactMarkdown>
            </div>
          </div>
          <div className={clsx(classes['contentList-PostHeader___sidebar'])}>
            <div
              className={clsx(
                classes['contentList-PostHeader___sidebar-author'],
              )}
            >
              <div
                className={clsx(
                  classes['contentList-PostHeader___sidebar-author-info'],
                )}
              >
                {author.username}
                <div
                  className={clsx(
                    classes[
                      'contentList-PostHeader___sidebar-author-info-date'
                    ],
                  )}
                >
                  {generateFormattedDate(articles.createdAt)}
                </div>
              </div>
              <img
                className={clsx(
                  classes['contentList-PostHeader___sidebar-avatar'],
                )}
                src={avatarSrc}
                alt="avatar"
                onError={handleImageError}
              />
            </div>
            {loggedIn && currentUser.username === author.username && (
              <div
                className={clsx(
                  classes['contentList-PostHeader___sidebar-buttones'],
                )}
              >
                <Popconfirm onConfirm={handleDelete}>
                  <button
                    type="button"
                    className={clsx(
                      classes[
                        'contentList-PostHeader___sidebar-buttones-delete'
                      ],
                    )}
                  >
                    Delete
                  </button>
                </Popconfirm>
                <Link to={`/articles/${articles.slug}/edit`}>
                  <button
                    type="button"
                    className={clsx(
                      classes['contentList-PostHeader___sidebar-buttones-edit'],
                    )}
                  >
                    Edit
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OneArticle
