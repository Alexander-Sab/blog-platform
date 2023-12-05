import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

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
          // eslint-disable-next-line operator-linebreak
          err?.response?.data?.errors?.message ||
          'Не верные данные. Проверьте заполнение полей!',
      })
    }
  },
)

const initialState = {
  posts: [],
  page: 1,
  totalPages: 1,
  currentPost: {},
  user: {},
  authorized: true,
  loading: true,
  error: '',
}

const blog = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearPost: (state) => ({ ...state, currentPost: {} }),
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.fulfilled, (state, action) => {
      const { articles, articlesCount } = action.payload
      const parsedTotalPages = Math.ceil(articlesCount / 5)
      return {
        ...state,
        posts: articles,
        totalPages: parsedTotalPages,
        loading: false,
      }
    })
    builder.addCase(getPosts.rejected, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.error = action.error.message
      // eslint-disable-next-line no-param-reassign
      state.loading = false
    })
    // eslint-disable-next-line no-unused-vars
    builder.addCase(fetchCreateUser.fulfilled, (state, action) => {
      // Обработка успешного ответа
      console.log('Запрос успешно выполнен')
    })
    // eslint-disable-next-line no-unused-vars
    builder.addCase(fetchCreateUser.rejected, (state, action) => {
      // Обработка ошибки
      console.log('Ошибка при выполнении запроса')
    })
  },
})

export const { clearPost } = blog.actions

export default blog.reducer
