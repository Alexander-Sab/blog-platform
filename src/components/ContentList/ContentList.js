import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

import placeholderImage from './humanavatar.svg'
import classes from './ContentList.module.scss'

export function ContentList({ articles }) {
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

  const handleImageError = (e) => {
    e.target.src = placeholderImage // Устанавливаем картинку-запаску в случае ошибки
  }

  return (
    <div className={clsx(classes.contentList)}>
      <div className={clsx(classes['contentList-PostHeader'])}>
        <div className={clsx(classes['contentList-PostHeader___content'])}>
          <div
            className={clsx(classes['contentList-PostHeader___content-title'])}
          >
            <Link
              className={clsx(
                classes['contentList-PostHeader___content-title-link'],
              )}
              to={`/articles/${articles.slug}`} // Передайте slug статьи в URL
            >
              {articles.title}
            </Link>
            <div
              className={clsx(classes['contentList-PostHeader___content-like'])}
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
          {articles.tagList && (
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
            <ReactMarkdown>{articles.description}</ReactMarkdown>
          </div>
        </div>
        <div className={clsx(classes['contentList-PostHeader___sidebar'])}>
          <div
            className={clsx(classes['contentList-PostHeader___sidebar-author'])}
          >
            <div
              className={clsx(
                classes['contentList-PostHeader___sidebar-author-info'],
              )}
            >
              {articles.author.username}
              <div
                className={clsx(
                  classes['contentList-PostHeader___sidebar-author-info-date'],
                )}
              >
                {generateFormattedDate(articles)}
              </div>
            </div>
            <img
              className={clsx(
                classes['contentList-PostHeader___sidebar-avatar'],
              )}
              src={articles.author.image}
              alt="avatar"
              onError={handleImageError}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentList
