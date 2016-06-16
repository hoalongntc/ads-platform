# Ads Platform

### Pre Installation
You will need `node` installed. Try [node official website](https://nodejs.org/en/download/) or use [nvm](https://github.com/creationix/nvm) to manage `node` versions

### Setup
Install [loopback](http://loopback.io/), [webpack](http://webpack.github.io/docs/installation.html), [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html), [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
```
npm install -g strongloop
npm install -g webpack
npm install -g webpack-dev-server
npm install -g gulp-cli
```

Get the source code and install dependencies
```
git clone https://github.com/hoalongntc/ads-platform
cd ads-platform
npm install
```

Run
```
npm run start
```

### Development
Start development server. Default API server will start at [localhost:3000](http://0.0.0.0:3000)
```
npm run dev-server
```

Start development client server. Default client server will start at [localhost:9000](http://0.0.0.0:9000)
```
npm run dev-client
```

### Init database
```
./node_modules/.bin/node-babel tasks/init-db
```

### Folder structure
```
.
├── client
|   ├── app
|   |   ├── components
|   |   ├── extensions
|   |   ├── app.js
|   |   └── routes.js
|   ├── assets
|   |   ├── images
|   |   ├── scripts
|   |   |   └── assets.js
|   |   └── styles
|   |   |   └── assets.less
|   ├── dist
|   ├── lib
|   |   └── lb-services.js
|   └── index.template.html
├── common
|   └── models
├── node_modules
└── server
```

- `client`: Client side code
- `client/app`: Angular code
- `client/app/components`: App components
- `client/app/extensions`: App directives, factories, serivices
- `client/app/app.js`: App main file
- `client/app/routes.js`: App routes config
- `client/assets`: App assets
- `client/assets/images`: Images
- `client/assets/scripts/assets.js`: Main asset script
- `client/assets/styles/assets.less`: Main stylesheet file
- `client/dist`: Build destination directory
- `client/lib/lb-services.js`: Loopback auto-generated ngResource file
- `common/models`: App models
- `node_modules`: App dependencies
- `server`: Server code
