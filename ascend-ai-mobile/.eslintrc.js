module.exports = {
  "root": true,
  "ignorePatterns": ["node_modules/", ".expo/", "dist/"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "ecmaFeatures": { "jsx": true }
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
    "prettier"
  ],
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "react-native",
    "prettier"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "off",
    "react/no-unescaped-entities": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-html-link-for-pages": "off",
    "react-native/no-color-literals": "off",
    "react-native/no-inline-styles": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "settings": {
    "react": { "version": "detect" }
  }
}
;

