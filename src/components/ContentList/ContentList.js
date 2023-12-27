/* eslint-disable operator-linebreak */
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

import { generateFormattedDate } from '../../utils/utils'
import LikeButton from '../LikeButton'

import placeholderImage from './humanavatar.svg'
import classes from './ContentList.module.scss'

export function ContentList({ articles }) {
  const handleImageError = (e) => {
    e.target.src = placeholderImage
  }
  const avatarSrc = articles.author.image || placeholderImage
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
              to={`/articles/${articles.slug}`}
            >
              {articles.title}
            </Link>
            <div
              className={clsx(classes['contentList-PostHeader___content-like'])}
            >
              <LikeButton article={articles} />
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
        </div>
      </div>
    </div>
  )
}

export default ContentList
