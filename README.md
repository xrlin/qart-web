# QartWeb

This project is the web ui for [qart](https://github.com/qart)

## Online application

[https://qart-web.xrlin.github.io](https://qart-web.xrlin.github.io)

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

Now visit localhost:8081. Enjoy it. :clap:

