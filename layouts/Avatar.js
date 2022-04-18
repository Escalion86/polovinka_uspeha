const Avatar = ({ user }) => (
  <img
    // onClick={() => closeMenu()}
    className="border border-opacity-50 rounded-full cursor-pointer border-whiteobject-cover h-11 w-11 min-w-9"
    src={user?.image ?? `/img/users/${user?.gender ? user.gender : 'male'}.jpg`}
    alt="Avatar"
  />
)

export default Avatar
