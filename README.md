# QartWeb

This project is the web ui of [qart](https://github.com/qart)

## Online application

[https://qart-web.xrlin.github.io](https://xrlin.github.io/qart-web)

## Build && Run

Build angular project

```
yarn install && ng build
```

Build backend server

```
go build -o dist/server server/main.go
```

Change to dist folder and run

```
./server -serve-static true
```

Now visit http://localhost:8081. Enjoy it. :clap:

