const fs = require('fs')
const path = require('path')
const getOptions = require('loader-utils').getOptions

module.exports = function(source) {
  const webpack = this

  if (webpack.cacheable) webpack.cacheable()

  const callback = webpack.async()

  const options = getOptions(this)

  ;(Array.isArray(options.rules) ? options.rules : [options.rules]).forEach(rule => {
    const importRule = rule.import
    let importFunc = typeof importRule === 'string' ? () => importRule : importRule
    if (!rule.local) return callback(null, importFunc() + '\n' + source)

    const filter = rule.local.filter
    const test = rule.local.test
    const localPath = rule.local.path || './'
    if (!importFunc)
      importFunc = file => `import "${'./' === localPath ? localPath + file : path.join(localPath, file)}";`

    const absolutePath = path.resolve(path.dirname(webpack.resourcePath), localPath)
    const resource = fileInfo(path.basename(webpack.resourcePath))

    fs.readdir(absolutePath, function(err, files) {
      if (err) return callback(err)
      const output = files
        .filter(file => {
          if (file === resource.name) return false
          return (!filter || filter(resource, fileInfo(file))) && (!test || test.test(file))
        })
        .map(importFunc)
        .join('\n')
      callback(null, output + source)
    })
  })

  return undefined
}

function fileInfo(name) {
  const index = name.indexOf('.')
  return index < 0 ? { base: name, ext: '', name } : { base: name.slice(0, index), ext: name.substring(index), name }
}
