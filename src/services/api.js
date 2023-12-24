import axios from 'axios'

import getCookie from '../utils/getCookie'
import {
  API_ROOT_URL,
  ARTICLE_LIST_OFFSET,
  HEADERS_JSON,
} from '../constants/constants'

export const getPosts = async ({ currentPage, pageSize }) => {
  try {
    const response = await axios.get(
      `${API_ROOT_URL}articles?offset=${
        (currentPage - 1) * pageSize
      }&limit=${pageSize}`,
    )
    return response.data
  } catch (error) {
    throw new Error('Something went wrong')
  }
}

export const createUser = async ({ username, email, password }) => {
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
        headers: HEADERS_JSON,
      },
    )
    return response.data
  } catch (err) {
    throw err.response.data.errors.message || 'Invalid data. Check your fields!'
  }
}

export const loginUser = async ({ email, password }) => {
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
        headers: HEADERS_JSON,
      },
    )
    return response.data
  } catch (err) {
    throw err.response.data.errors.message || 'Invalid email or password'
  }
}

export const updateUserProfile = async ({
  username,
  email,
  password,
  image,
}) => {
  const requestData = {
    user: {
      username,
      email,
      password,
      image,
    },
  }
  try {
    const response = await axios.put(`${API_ROOT_URL}user`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${getCookie('token')}`,
      },
    })
    return response.data
  } catch (err) {
    throw (
      err.response.data.errors.message ||
      'User data unchanged. User already exists!'
    )
  }
}

export const createArticle = async (articleInfo) => {
  const { data } = articleInfo
  const token = getCookie('token')
  try {
    const response = await axios.post(
      `${API_ROOT_URL}articles`,
      {
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: data.tagList,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      },
    )
    return response.data
  } catch (err) {
    throw err.response.data.errors.message || 'Error creating article'
  }
}

export const editArticle = async (articleInfo) => {
  const { data, slug } = articleInfo
  const token = getCookie('token')
  try {
    const response = await axios.put(
      `${API_ROOT_URL}articles/${slug}`,
      {
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: data.tagList,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      },
    )
    return response.data
  } catch (err) {
    throw err.response.data.errors.message || 'Error editing article'
  }
}

export const fetchPostData = async (pageInfo) => {
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
  try {
    const response = await axios.get(
      `${API_ROOT_URL}articles?offset=${
        currentPage * ARTICLE_LIST_OFFSET - ARTICLE_LIST_OFFSET
      }`,
      option,
    )
    return response.data
  } catch (err) {
    throw new Error('Error fetching article data')
  }
}

export const deleteArticle = async (articleInfo) => {
  const { token, slug } = articleInfo
  try {
    const response = await axios.delete(`${API_ROOT_URL}articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    return response.data
  } catch (err) {
    throw new Error('Error deleting article')
  }
}

export const favoriteArticle = async (articleInfo) => {
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
    if (data.article) {
      return data.article
    }
    return data
  } catch (error) {
    console.error('Error favoriting article:', error)
    throw error
  }
}

export const unfavoriteArticle = async (articleInfo) => {
  const { slug } = articleInfo
  const token = getCookie('token')
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
    if (data.article) {
      return data.article
    }
    if (response.status === 200) {
      return data
    }
    throw new Error(`UnfavoriteArticle error. Status: ${response.status}`)
  } catch (error) {
    console.error('UnfavoriteArticle error:', error)
    throw error
  }
}

export default {
  getPosts,
  createUser,
  loginUser,
  updateUserProfile,
  createArticle,
  editArticle,
  fetchPostData,
  deleteArticle,
  favoriteArticle,
  unfavoriteArticle,
}
