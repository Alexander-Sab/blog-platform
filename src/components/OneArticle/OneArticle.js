import clsx from 'clsx'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Popconfirm } from 'antd'

import { deleteArticle } from '../../store/blog'
import classes from '../ContentList/ContentList.module.scss'

export function OneArticle() {
  const { slug } = useParams()
  const oneArticle = useSelector((state) => state.blog.posts)
  const loggedIn = useSelector((state) => state.blog.loggedIn)
  const currentUser = useSelector((state) => state.blog.user)
  const token = useSelector((state) => state.blog.user.token)
  const articles = oneArticle.find((item) => item.slug === slug)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  if (!articles || !articles.slug) {
    navigate.push('/articles') // Перенаправляем пользователя на страницу /articles
    return null // Возвращаем null, так как компонент будет перенаправлен
  }

  const author = articles.author || {} // Добавляем пустой объект, если author не определен

  const generateFormattedDate = (article) => {
    const { createdAt } = article
    const date = new Date(createdAt)
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    return formattedDate
  }

  const handleDelete = () => {
    dispatch(deleteArticle({ slug: articles.slug, token }))
  }

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
                  ❤️
                </span>
                12
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
              {articles.body}
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
                {/* Добавляем проверку на существование username */}
                <div
                  className={clsx(
                    classes[
                      'contentList-PostHeader___sidebar-author-info-date'
                    ],
                  )}
                >
                  {generateFormattedDate(articles)}
                </div>
              </div>
              <img
                className={clsx(
                  classes['contentList-PostHeader___sidebar-avatar'],
                )}
                src={author.image}
                alt="avatar"
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
                <Link to="/new-article">
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
