const getUserAvatarSrc = (user) => {
  const firstImage =
    typeof user?.images?.[0] === 'string' ? user.images[0].trim() : ''

  return firstImage || `/img/users/${user?.gender ?? 'null'}.jpg`
}

export default getUserAvatarSrc
