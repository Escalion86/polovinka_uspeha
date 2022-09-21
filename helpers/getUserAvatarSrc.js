const getUserAvatarSrc = (user) =>
  user?.images?.length > 0
    ? user.images[0]
    : `/img/users/${user?.gender ?? 'null'}.jpg`

export default getUserAvatarSrc
