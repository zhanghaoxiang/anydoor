module.exports = {
    "extends": ["eslint:recommended"],
    "rules": {
        "no-console": ["error", {
            "allow": ["log"]
        }]
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "script"
    },
    "globals": {
        window: true
    },
    "env": {
        "node": true,
        "es6": true,
        "mocha": true,
        "browser": false
    }
}
