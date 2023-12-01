import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_ROOT_URL = 'https://blog.kata.academy/api/'

export const getPosts = createAsyncThunk('blog/getPosts', async (page) => {
  try {
    const response = await axios.get(
      `${API_ROOT_URL}articles?page=${page}&limit=5`,
    )
    // console.log('response.data', response.data)
    return response.data
  } catch (error) {
    throw new Error('Something goes wrong')
  }
})

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
    // Добавьте другие extraReducers здесь...
  },
})

export const { clearPost } = blog.actions

export default blog.reducer
