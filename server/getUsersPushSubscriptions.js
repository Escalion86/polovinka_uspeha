const getUsersPushSubscriptions = (users = []) =>
  users
    .filter((user) =>
      user?.notifications?.push?.active &&
      Array.isArray(user?.notifications?.push?.subscriptions) &&
      user.notifications.push.subscriptions.length > 0
    )
    .flatMap((user) =>
      user.notifications.push.subscriptions
        .filter((subscription) => subscription?.endpoint)
        .map((subscription) => ({
          subscription,
          userId: user._id,
          user,
        }))
    )

export default getUsersPushSubscriptions
