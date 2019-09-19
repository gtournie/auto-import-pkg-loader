# Auto import loader for webpack

## Installation

`npm install auto-import-pkg-loader --save-dev`

## Examples

### To automatically import a lib

```js
{
  test: /\.jsx$/,
  exclude: /node_modules/,
  use: {
    loader: 'auto-import-pkg-loader',
    options: { rules: { import: 'import React from "react"' } }
  }
}
```

### To automatically import all scss files that are in the same dir.

#### Simple
```
|- component1
  |- index.js  <== import "styles.scss"
  |- styles.scss
|- component2
  |- index.js  <== import "styles.scss"
  |- styles.scss
```

No need to manually do `import './styles.scss'` in `index.js` anymore.

> **The import will only be added if the file is found**

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'auto-import-pkg-loader',
    options: { rules: { local: { test: /\.scss$/ } } },
  }
}
```

#### Advanced

```
|- component1
  |- styles
    |-- custom.css
  |-- index.js  <== import "./index.scss"; import "./styles/custom.css"
  |-- index.scss
  |-- index.png
  |-- styles.scss
|- component2
  |- index.js
  |- index.scss  <== import "./index.scss"
```

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'auto-import-pkg-loader',
    options: {
      rules: [
        {
          local: {
            // Default. Same dir
            path: './',
            // Same name. resource & file have: base, ext & name properties
            filter: (resource, file) => resource.base === file.base,
            // Scss file
            test: /\.scss$/,
          },
          // Default
          import: file => `import "./${file}";`
        },
        {
          local: {
            path: './styles',
            test: /\.css$/,
          }
        }
      ]
    }
  }
```

### To automatically import a config file
```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'auto-import-pkg-loader',
    options: {
      rules: {
        local: {
          path: path.join(__dirname, 'config'),
          test: /^application\.js$/
        }
      }
    }
  }
}
```

## Send some love

You like this package?

[![Buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/jCk0aHycU)
