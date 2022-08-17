const getUserAvatarSrc = (user) =>
  user?.images?.length > 0
    ? user.images[0]
    : `/img/users/${user?.gender ?? 'male'}.jpg`

export default getUserAvatarSrc
