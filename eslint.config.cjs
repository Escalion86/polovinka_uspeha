const js = require('@eslint/js')
const nextVitals = require('eslint-config-next/core-web-vitals')

module.exports = [
  {
    ignores: [
      '.next/**',
      'dist/**',
      'build/**',
      'node_modules/**',
      '_old_files/**',
      '.flowbite-react/**',
      'public/sw.js',
      'app2/**',
    ],
  },
  js.configs.recommended,
  ...nextVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react/no-children-prop': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-dupe-keys': 'off',
      'no-unreachable': 'off',
      'no-prototype-builtins': 'off',
      'no-constant-binary-expression': 'off',
      'no-shadow-restricted-names': 'off',
      'no-useless-escape': 'off',
      'no-constant-condition': 'off',
      'no-empty-pattern': 'off',
      'no-extra-boolean-cast': 'off',
      'react/jsx-key': 'off',
      'react/jsx-no-undef': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'import/no-anonymous-default-export': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-before-interactive-script-outside-document': 'off',
      '@next/next/no-assign-module-variable': 'off',
    },
  },
]
