const path = require('path')
const gulp = require('gulp')
const fs = require('fs-extra')
const chalk = require('chalk')
const dayjs = require('dayjs')

const { build, compileStylusFiles } = require('./gulp.base')
const { allowCopyExtList, stylusPath, distPath } = require('./config')

const operateFile = (_type, _path) => {
  const _relativePath = path.relative(__dirname, _path)
  const _projectPath = _relativePath.replace(/^(..\/)*src\//g, '')
  const _distPath = path.join(distPath, _projectPath)
  const _allowCopyExtList = [''].concat(allowCopyExtList)
  const extname = path.extname(_path)  // 扩展名，目录为 ''
  if (_allowCopyExtList.includes(extname)) {
    let color = 'green'
    if (_type === 'delete') {
      fs.removeSync(_distPath)
      color = 'red'
    } else if (_type === 'add') {
      fs.copySync(_path, _distPath)
      color = 'blue'
    } else {
      fs.copySync(_path, _distPath)
    }
    console.log(chalk[color](`[${dayjs().format('HH:mm:ss')}] /dist/${_projectPath} was ${_type}`))
  }
}
const watchs = done => {
  gulp.watch(stylusPath, gulp.series(compileStylusFiles))
  const copyFilePathWatcher = gulp.watch(path.resolve(__dirname, '../src'))

  copyFilePathWatcher.on('change', (_path) => {
    operateFile('update', _path)
  })
  copyFilePathWatcher.on('addDir', (_path) => {
    operateFile('add', _path)
  })
  copyFilePathWatcher.on('add', (_path) => {
    operateFile('add',_path)
  })
  copyFilePathWatcher.on('unlinkDir', (_path) => {
    operateFile('delete',_path)
  })
  copyFilePathWatcher.on('unlink', (_path) => {
    operateFile('delete',_path)
  })
  done()
}

module.exports = {
  develop: gulp.series(build(), watchs)
}