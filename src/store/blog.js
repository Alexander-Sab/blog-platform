/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable no-param-reassign */
import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import getCookie from '../utils/getCookie'

const API_ROOT_URL = 'https://blog.kata.academy/api/'

export const getPosts = createAsyncThunk('blog/getPosts', async (page) => {
  try {
    const response = await axios.get(
      `${API_ROOT_URL}articles?page=${page}&limit=5`,
    )
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
      statusText: error.response?.data?.errors?.message || 'Неизвестная ошибка',
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

const initialState = {
  posts: [],
  page: 1,
  totalPages: 1,
  currentPost: {},
  user: JSON.parse(localStorage.getItem('user')) || null,
  image: '',
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
    logoutUser: (state) => {
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('user')
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
          ...action.payload,
          username: action.payload.username
            ? action.payload.username.charAt(0).toUpperCase() +
              action.payload.username.slice(1)
            : '',
        }
        state.loggedIn = true
        state.user = formattedUser
        state.user.image = action.payload.user.image
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
        return { ...state, loggedIn: false, user: {} }
      })
      .addCase(fetchUpdateUserProfile.fulfilled, (state, action) => {
        console.log('Профиль пользователя обновлен')
        console.log('action.payload:', action.payload)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        return {
          ...state,
        }
      })
      .addCase(loginUserFailed, (state, action) => {
        state.error = action.payload.statusText // Обновите ошибку в состоянии
        state.loading = false
      })
  },
})

export const { clearPost } = blog.actions

export default blog.reducer
