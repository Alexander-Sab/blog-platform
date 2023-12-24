import clsx from 'clsx'
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'antd'

import {
  createArticle,
  editArticle,
  clearCurrentArticle,
  fetchPostData,
} from '../../store/blog'

import classes from './NewArticle.module.scss'

const schema = yup.object().shape({
  title: yup.string().required('title is required'),
  description: yup.string().required('description is required'),
  body: yup.string().required('text is required'),
})
export function NewArticle() {
  const apiKey = useSelector((state) => state.blog.token)
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentPage } = useSelector((state) => state.blog)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tagList: [''],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
  })

  const submitForm = (data) => {
    try {
      console.log(data)
      if (slug) {
        dispatch(editArticle({ data, apiKey, slug }))
        dispatch(clearCurrentArticle())
        dispatch(fetchPostData(currentPage))
      } else {
        dispatch(createArticle({ data, apiKey }))
        dispatch(fetchPostData(currentPage))
      }
      reset()
      navigate('/articles')
    } catch (err) {
      throw new Error(err.message)
    }
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
            />
          </label>
          {errors.body && (
            <p className={clsx(classes['form-error'])}>{errors.body.message}</p>
          )}
          <ul className={clsx(classes['tags-list'])}>
            {fields.map((item, index) => (
              <li key={item.id} className={clsx(classes['article-form-list'])}>
                {/* // не отпровляет */}
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
          <Button
            type="submit"
            className={clsx(classes['article-form-button'])}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}

export default NewArticle
