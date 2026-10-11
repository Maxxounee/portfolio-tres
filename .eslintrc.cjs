/* eslint-env node */
module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
        'no-tabs': 0,
        'comma-dangle': ['error', 'always-multiline'],
        indent: ['error', 'tab'],
        semi: ['error', 'always'],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/html-self-closing': ['error', {
            html: {
                void: 'always',
                normal: 'never',
                component: 'any',
            },
        }],
        'vue/html-indent': ['error', 'tab'],
        'vue/no-v-html': 'off',
        'vue/max-attributes-per-line': ['error', {
            singleline: {
                max: 1,
            },
            multiline: {
                max: 1,
            },
        }],

        'space-before-function-paren': ['error', 'never'],
        'multiline-ternary': ['error', 'never'],
        'arrow-parens': ['error', 'always'],
        'no-console': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
    },
    ignorePatterns: ['node_modules/', 'vendor/', 'public/', 'dist/'],
};
