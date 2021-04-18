// 由于 Vite 的 build --watch 还未发布，暂时手动实现
// 待功能发布后可移除该脚本

const chokidar = require('chokidar');
const path = require('path');
const { execSync } = require('child_process');

function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function build() {
  execSync('vite build', { stdio: 'inherit' }, (error, stdout, stderr) => {
    if (error) {
      console.log(`${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`${stderr}`);
      return;
    }
    console.log(`${stdout}`);
  });
}

const watcher = chokidar.watch(path.resolve(__dirname, '../src'), {
  ignoreInitial: true,
  ignored: /.*background\.ts$/,
});
watcher.on(
  'all',
  debounce((event, path) => {
    const message = `${event} ${path}`;
    build();
  })
);

build();
