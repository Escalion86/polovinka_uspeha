import { setRecoil } from 'recoil-nexus'

const setRecoilFunc = (selector) => (value) => setRecoil(selector, value)

export default setRecoilFunc
