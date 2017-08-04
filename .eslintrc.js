// http://eslint.org/docs/user-guide/configuring
module.exports = {
	root: true,
	// parser: "es-lint",
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
	},
	extends: 'standard',
	plugins: ['html'],
	'rules': {
		'no-new': 0,
		'one-var': 0,
		'no-mixed-operators': 0,
		'space-in-parens': 0,
		'no-unneeded-ternary': 0,
		'no-mixed-spaces-and-tabs': 0,
		'no-useless-return': 0,
		'no-dupe-class-member': 0,
		'keyword-spacing': 0,
		'spaced-comment': 0,
		'brace-style': 0,
		'no-unused-vars': 0,
		'no-trailing-spaces': 0,
		'no-extend-native': 0,
		'padded-blocks': 0,
		// 是否强制分号结尾
		'semi': 0,
		// 引号类型
		'quotes': 0,
		// 缩进 
		'indent': 0,
		//函数定义时括号前面要不要有空格
		'space-before-function-paren': [0, 'always'],
		//文件以单一的换行符结束
		'eol-last': 0,
		// Some style guides don’t allow the use of tab characters at all, including within comments.
		'no-tabs': 0,
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger':  0
		// 'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
}