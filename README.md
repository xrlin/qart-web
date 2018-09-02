# QartWeb

This project is the web ui of [qart](https://github.com/qart)

## Online application

[https://xrlin.github.io/qart-web](https://xrlin.github.io/qart-web)

## Install

You can download the latest release from this project's release page. Unzip the zip file and run the executable file in command line.

For example

```
# suggest run in linux x86 system. Windows, osx's executable file also contains in the zip file.
server_amd64_linux -serve-static true
```

Then open http://localhost:8081 in the browser. That's it.

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

