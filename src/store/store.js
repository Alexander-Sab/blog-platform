import { configureStore } from '@reduxjs/toolkit'

import blogReducer from './blog'

const store = configureStore({
  reducer: {
    blog: blogReducer,
    // Другие срезы хранилища...
  },
})

export default store
