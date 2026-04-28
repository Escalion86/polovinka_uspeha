export const isVkAuthClientTestModeEnabled = () =>
  String(process.env.NEXT_PUBLIC_VK_AUTH_TEST_MODE || '')
    .trim()
    .toLowerCase() === 'true'
