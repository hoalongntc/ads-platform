require('babel-register');
const fs = require('fs');
const script = process.env.SCRIPT;

const exit = (err) => {
  console.error(err);
  process.exit(1);
};

if (!script) {
  exit('Must provide script path in environment variable SCRIPT');
}

fs.stat(script, (err, stats) => {
  if (err) {
    return exit(err);
  }

  require(script);
});
