/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable no-param-reassign */
import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import getCookie from '../utils/getCookie'

const API_ROOT_URL = 'https://blog.kata.academy/api/'

export const getPosts = createAsyncThunk('blog/getPosts', async (page) => {
  try {
    const response = await axios.get(`${API_ROOT_URL}articles?page=${page}`)
    return response.data
  } catch (error) {
    throw new Error('Something goes wrong')
  }
})

export const fetchCreateUser = createAsyncThunk(
  'user/fetchCreateUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_ROOT_URL}users`,
        {
          user: {
            username,
            email,
            password,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      return response.data
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        statusText:
          err?.response?.data?.errors?.message ||
          'Не верные данные. Проверьте заполнение полей!',
      })
    }
  },
)

export const loginUserFailed = createAction(
  'user/loginUserFailed',
  (error) => ({
    payload: {
      status: error.response?.status || 500,
      statusText:
        error.response?.data?.errors?.message || 'Логин или пароль не верные',
    },
  }),
)

// В вашей thunk-функции
export const fetchLoginUser = createAsyncThunk(
  'user/fetchLoginUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_ROOT_URL}users/login`,
        {
          user: {
            email,
            password,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      console.log('res.data', response.data)
      return response.data
    } catch (err) {
      console.log('err.response', err.response)
      dispatch(loginUserFailed(err))
      return rejectWithValue({
        status: err.response?.status || 500,
        statusText:
          err?.response?.data?.errors?.message || 'Логин или пароль не верные',
      })
    }
  },
)

export const logoutUser = createAction('user/logoutUser')
export const updateUserProfile = createAction('user/updateUserProfile')

// ========================================================= fetchUpdateUserProfile

export const fetchUpdateUserProfile = createAsyncThunk(
  'user/fetchUpdateUserProfile',
  // eslint-disable-next-line object-curly-newline
  async (
    // eslint-disable-next-line object-curly-newline
    { username, email, password, image },
    { rejectWithValue, dispatch },
  ) => {
    console.log('Incoming data', username, email, password, image)
    const requestData = {
      user: {
        username,
        email,
        password,
        image,
      },
    }
    const token = getCookie('token')
    console.log('Token:', token)
    try {
      const response = await axios.put(`${API_ROOT_URL}user`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${getCookie('token')}`,
        },
      })
      console.log('UserProfile', response.data)

      // Обновляем данные пользователя в Redux
      dispatch(updateUserProfile(response.data.user))
      return response.data
    } catch (err) {
      console.log('Error:', err)
      return rejectWithValue({
        status: err.response.status,
        statusText:
          err?.response?.data?.errors?.message ||
          'Данные не изменились. Такой пользователь уже существует!',
      })
    }
  },
)
// ++++++++++ новая статья
export const createArticle = createAsyncThunk(
  'blog/createArticle',
  async (articleInfo) => {
    const { data } = articleInfo
    const token = getCookie('token')

    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: data.tagList,
        },
      }),
    }

    const response = await fetch(
      'https://blog.kata.academy/api/articles',
      option,
    )
    const body = await response.json()

    console.log(body)

    return body
  },
)
export const editArticle = createAsyncThunk(
  'blog/editArticle',
  async (articleInfo) => {
    const { data, slug } = articleInfo
    const token = getCookie('token')

    const option = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: data.tagList,
        },
      }),
    }

    const response = await fetch(
      `https://blog.kata.academy/api/articles/${slug}`,
      option,
    )

    const body = await response.json()

    console.log(body)

    return body
  },
)
export const fetchPostData = createAsyncThunk(
  'blog/fetchPostData',
  async (pageInfo) => {
    let { token } = pageInfo
    const { currentPage } = pageInfo
    let option = null
    if (sessionStorage.getItem('token')) {
      token = sessionStorage.getItem('token')
    }
    if (token) {
      option = {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    }
    const response = await fetch(
      `https://blog.kata.academy/api/articles?offset=${currentPage * 20 - 20}`,
      option,
    )
    const data = await response.json()
    console.log(data)
    return data
  },
)
//  удаление статьи ++++++++++++++++++++++++++++++++

export const deleteArticle = createAsyncThunk(
  'blog/deleteArticle',
  async (articleInfo) => {
    const { token, slug } = articleInfo

    const option = {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    }

    const response = await fetch(
      `https://blog.kata.academy/api/articles/${slug}`,
      option,
    )
    const data = await response.json()

    console.log(data)

    return data
  },
)
// лайки

// поставить лайк

export const favoriteArticle = createAsyncThunk(
  'blog/favoriteArticle',
  async (articleInfo) => {
    const { slug } = articleInfo
    const token = getCookie('token')

    try {
      const response = await axios.post(
        `${API_ROOT_URL}articles/${slug}/favorite`,
        null,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      )

      const { data } = response

      // Если data содержит свойство article, то возвращаем его
      if (data.article) {
        console.log('Успешный ответ ЛАЙК:', response.status, data)
        console.log(data.article)
        return data.article
      }

      // В противном случае возвращаем весь объект data
      console.log('Успешный ответ ЛАЙК:', response.status, data)
      console.log(data)
      return data
    } catch (error) {
      // Обрабатываем ошибку
      console.error('Ошибка запроса ЛАЙК:', error)
      throw error
    }
  },
)
// удалить лайк
export const unfavoriteArticle = createAsyncThunk(
  'blog/unfavoriteArticle',
  async (articleInfo) => {
    const { slug } = articleInfo
    const token = getCookie('token')
    console.log('Удалять из избранного. Токен:', token)

    try {
      const response = await axios.delete(
        `${API_ROOT_URL}articles/${slug}/favorite`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          data: {},
        },
      )

      const { data } = response
      // Если data содержит свойство article, то возвращаем его
      if (data.article) {
        console.log('Успешный ответ ЛАЙК:', response.status, data)
        console.log(data.article)
        return data.article
      }

      if (response.status === 200) {
        // Передаем данные, если запрос выполнен успешно
        return data
      }
      // Обрабатываем ошибочный статус
      throw new Error(`Ошибка unfavoriteArticle. Статус: ${response.status}`)
    } catch (error) {
      console.error('Ошибка unfavoriteArticle:', error)
      throw error // Повторное возбуждение ошибки для ее перехвата thunk
    }
  },
)

// +++++++++++++++++++++++++++++++++++++++++++++++++
const initialState = {
  posts: [],
  page: 1,
  totalPages: 1,
  currentPost: {},
  user: JSON.parse(localStorage.getItem('user')) || null,
  authorized: true,
  loading: true,
  error: '',
  loggedIn: localStorage.getItem('loggedIn') === 'true',
}
const blog = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearPost: (state) => ({ ...state, currentPost: {} }),
    clearCurrentArticle: (state) => {
      state.currentArticle = {}
    },
    logoutUser: (state) => {
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('user')
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      return { ...state, loggedIn: false, user: null }
    },
    updateUserProfile: (state, action) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.fulfilled, (state, action) => {
        const { articles, articlesCount } = action.payload
        const parsedTotalPages = Math.ceil(articlesCount / 5)
        return {
          ...state,
          posts: articles,
          totalPages: parsedTotalPages,
          loading: false,
        }
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.error = action.error.message
        state.loading = false
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        console.log('Пользователь залогинился')
        localStorage.setItem('loggedIn', 'true')
        localStorage.setItem('user', JSON.stringify(action.payload))
        document.cookie = `token=${action.payload.user.token}`
        const formattedUser = {
          ...action.payload.user,
          username: action.payload.username
            ? action.payload.username.charAt(0).toUpperCase() +
              action.payload.username.slice(1)
            : '',
        }
        state.loggedIn = true
        state.user = formattedUser

        state.user = action.payload.user
      })
      .addCase(fetchCreateUser.rejected, (state) => {
        console.log('Ошибка при выполнении запроса')
        state.loggedIn = false
        state.user = {}
      })
      .addCase(logoutUser, (state) => {
        localStorage.removeItem('loggedIn')
        localStorage.removeItem('user')
        document.cookie =
          'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        return { ...state, loggedIn: false, user: {} }
      })
      .addCase(fetchUpdateUserProfile.fulfilled, (state, action) => {
        console.log('Профиль пользователя обновлен')
        console.log('action.payload:', action.payload)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        // Обновляем данные пользователя в Redux

        return {
          ...state,
          user: action.payload.user, // Обновление данных в Redux
        }
      })
      .addCase(loginUserFailed, (state, action) => {
        state.error = action.payload.statusText // Обновите ошибку в состоянии
        state.loading = false
      })
      .addCase(favoriteArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload
        // Найдите индекс статьи в массиве articles
        const index = state.posts.findIndex(
          (article) => article.slug === updatedArticle.slug,
        )
        if (index !== -1) {
          // Обновите статью в массиве articles
          state.posts[index] = updatedArticle
        }
      })
      .addCase(unfavoriteArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload
        // Найдите индекс статьи в массиве articles
        const index = state.posts.findIndex(
          (article) => article.slug === updatedArticle.slug,
        )
        if (index !== -1) {
          // Обновите статью в массиве articles
          state.posts[index] = updatedArticle
        }
      })
  },
})

export const { clearPost, clearCurrentArticle } = blog.actions

export default blog.reducer
