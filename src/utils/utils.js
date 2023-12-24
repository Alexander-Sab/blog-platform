export const generateArticlesId = (articles) => {
  const { title, createdAt, username } = articles
  const id = `${title}${createdAt}${username}`
  return id
}

export const generateFormattedDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const handleImageError = (e, placeholderImage) => {
  e.target.src = placeholderImage
}
