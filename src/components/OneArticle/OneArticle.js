import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import classes from '../ContentList/ContentList.module.scss'

export function OneArticle() {
  const { slug } = useParams()
  const oneArticle = useSelector((state) => state.blog.posts)
  const articles = oneArticle.find((item) => item.slug === slug)
  if (!articles) {
    return <div>Статья не найдена</div>
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
            <span
              className={clsx(
                classes['contentList-PostHeader___content-tags-tag'],
              )}
            >
              {articles.tagList}
            </span>
            <div
              className={clsx(
                classes['contentList-PostHeader___content-description'],
              )}
            >
              {articles.description}
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default OneArticle
