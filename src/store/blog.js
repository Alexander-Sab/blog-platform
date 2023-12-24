/* eslint-disable object-curly-newline */
import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit'

import * as api from '../services/api'

export const getPosts = createAsyncThunk(
  'blog/getPosts',
  async ({ currentPage, pageSize }) => {
    try {
      const response = await api.getPosts({ currentPage, pageSize })
      return response
    } catch (error) {
      throw new Error('Something goes wrong')
    }
  },
)

export const fetchCreateUser = createAsyncThunk(
  'user/fetchCreateUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.createUser({ username, email, password })
      return response
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

export const fetchLoginUser = createAsyncThunk(
  'user/fetchLoginUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.loginUser({ email, password })
      console.log('res.data', response)
      return response
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

export const fetchUpdateUserProfile = createAsyncThunk(
  'user/fetchUpdateUserProfile',
  async (
    { username, email, password, image },
    { rejectWithValue, dispatch },
  ) => {
    console.log('Incoming data', username, email, password, image)
    try {
      const response = await api.updateUserProfile({
        username,
        email,
        password,
        image,
      })
      console.log('UserProfile', response)
      dispatch(updateUserProfile(response.user))
      return response
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

export const createArticle = createAsyncThunk(
  'blog/createArticle',
  async (articleInfo) => {
    try {
      const response = await api.createArticle(articleInfo)
      return response
    } catch (err) {
      throw err.response.data.errors.message || 'Error creating article'
    }
  },
)

export const editArticle = createAsyncThunk(
  'blog/editArticle',
  async (articleInfo) => {
    try {
      const response = await api.editArticle(articleInfo)
      return response
    } catch (err) {
      throw err.response.data.errors.message || 'Error editing article'
    }
  },
)

export const fetchPostData = createAsyncThunk(
  'blog/fetchPostData',
  async (pageInfo) => {
    try {
      const response = await api.fetchPostData(pageInfo)
      return response
    } catch (err) {
      throw new Error('Error fetching article data')
    }
  },
)

export const deleteArticle = createAsyncThunk(
  'blog/deleteArticle',
  async (articleInfo) => {
    try {
      const response = await api.deleteArticle(articleInfo)
      return response
    } catch (err) {
      throw new Error('Error deleting article')
    }
  },
)

export const favoriteArticle = createAsyncThunk(
  'blog/favoriteArticle',
  async (articleInfo) => {
    try {
      const response = await api.favoriteArticle(articleInfo)
      return response
    } catch (error) {
      console.error('Error favoriting article:', error)
      throw error
    }
  },
)

export const unfavoriteArticle = createAsyncThunk(
  'blog/unfavoriteArticle',
  async (articleInfo) => {
    try {
      const response = await api.unfavoriteArticle(articleInfo)
      return response
    } catch (error) {
      console.error('UnfavoriteArticle error:', error)
      throw error
    }
  },
)

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

        return {
          ...state,
          user: action.payload.user,
        }
      })
      .addCase(loginUserFailed, (state, action) => {
        state.error = action.payload.statusText
        state.loading = false
      })
      .addCase(favoriteArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload
        const index = state.posts.findIndex(
          (article) => article.slug === updatedArticle.slug,
        )
        if (index !== -1) {
          state.posts[index] = updatedArticle
        }
      })
      .addCase(unfavoriteArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload
        const index = state.posts.findIndex(
          (article) => article.slug === updatedArticle.slug,
        )
        if (index !== -1) {
          state.posts[index] = updatedArticle
        }
      })
  },
})

export const { clearPost, clearCurrentArticle } = blog.actions

export default blog.reducer
