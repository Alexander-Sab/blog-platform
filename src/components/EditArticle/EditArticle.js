/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */

import clsx from 'clsx'
import { useForm, useFieldArray } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'

import { editArticle, getPosts } from '../../store/blog'
import LoadingSpinner from '../LoadingSpinner'
import classes from '../NewArticle/NewArticle.module.scss'

export function EditArticle() {
  const { slug } = useParams()
  const articles = useSelector((state) => state.blog.posts)
  const article = articles.find((item) => item.slug === slug)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()

  useEffect(() => {
    if (!articles.length) {
      dispatch(getPosts())
    }
  }, [dispatch, articles.length])

  const submitForm = (data) => {
    dispatch(editArticle({ slug, data }))
    navigate(`/articles/${slug}`)
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
  })

  if (!article) {
    return <LoadingSpinner />
  }

  return (
    <div className={clsx(classes['article-form-container'])}>
      <div className={clsx(classes['article-form'])}>
        <h1 className={clsx(classes['article-form-title'])}>
          Create new article
        </h1>
        <form
          className={clsx(classes['article-form-form'])}
          onSubmit={handleSubmit(submitForm)}
        >
          <label
            className={clsx(classes['article-form-label'])}
            htmlFor="title"
          >
            <span className={clsx(classes['article-form-description'])}>
              Title
            </span>
            <input
              className={clsx(classes['article-form-input'], {
                'input-error': errors.title,
              })}
              type="text"
              name="title"
              placeholder="Title"
              {...register('title')}
              defaultValue={article.title || ''}
            />
          </label>
          {errors.title && (
            <p className={clsx(classes['form-error'])}>
              {errors.title.message}
            </p>
          )}
          <label
            className={clsx(classes['article-form-label'])}
            htmlFor="description"
          >
            <span className={clsx(classes['article-form-description'])}>
              Short description
            </span>
            <input
              className={clsx(classes['article-form-input'], {
                'input-error': errors.description,
              })}
              type="text"
              {...register('description')}
              name="description"
              placeholder="Description"
              defaultValue={article.description || ''}
            />
          </label>
          {errors.description && (
            <p className={clsx(classes['form-error'])}>
              {errors.description.message}
            </p>
          )}
          <label className={clsx(classes['article-form-label'])} htmlFor="text">
            <span className={clsx(classes['article-form-description'])}>
              Text
            </span>
            <textarea
              rows={8}
              className={`article-form-input ${
                errors.body ? 'input-error' : ''
              }`}
              type="textarea"
              {...register('body')}
              name="body"
              placeholder="Text"
              defaultValue={article.body || ''}
            />
          </label>
          {errors.body && (
            <p className={clsx(classes['form-error'])}>{errors.body.message}</p>
          )}
          <ul className={clsx(classes['tags-list'])}>
            {fields.map((item, index) => (
              <li key={item.id} className={clsx(classes['article-form-list'])}>
                <span
                  className={clsx(classes['article-form-description-Tags'])}
                >
                  Tags
                </span>
                <input
                  {...register(`tagList.[${index}]`)}
                  className={clsx(
                    classes['article-form-input'],
                    classes['article-form-input-tags'],
                  )}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className={clsx(classes['article-form-button-delete'])}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => append('')}
            className={clsx(classes['article-form-button-add'])}
          >
            Add tag
          </button>
          <button
            type="submit"
            className={clsx(classes['article-form-button'])}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditArticle
