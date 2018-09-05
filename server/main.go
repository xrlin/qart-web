package main

import (
  "net/http"
  "image"
  _ "image/png"
  _ "image/jpeg"
  _ "image/gif"
  "strconv"
  "os"
  qrcode "github.com/xrlin/qart"
  "path"
  "crypto/md5"
  "fmt"
  "mime/multipart"
  "flag"
  "log"
  "encoding/json"
  "errors"
)

const CachePath = "qart-cache"

const FrontEndFolder = "qart-web"

const PointWidth = 3

func qart(w http.ResponseWriter, r *http.Request) {
  setupCORS(w,r)
  if r.Method == "options" {
    return
  }
  file, content, embed, rectangle, err := getParams(r)

  defer func() {
    if file != nil {
      file.Close()
    }
  }()

  if err != nil {
    responseWithJSON(w, QartResponse{Error:err.Error()})
    return
  }

  var q *qrcode.HalftoneQRCode
  q, err = qrcode.NewHalftoneCode(content, qrcode.Highest)
  q.AddOption(qrcode.Option{MaskImageFile: file, MaskRectangle: rectangle, Embed: embed})

  format := "png"
  if file != nil {
    file.Seek(0, 0)
    _, format, _ = image.DecodeConfig(file)
    file.Seek(0, 0)
  }

  data, err := q.ImageData(PointWidth)
  if err != nil {
    responseWithJSON(w, QartResponse{Error:err.Error()})
    return
  }
  filename := fmt.Sprintf("%x", md5.Sum(data))

  filePath := path.Join(CachePath, filename+ "." + format)
  f, _ := os.Create(filePath)
  defer f.Close()
  f.Write(data)
  responseWithJSON(w, QartResponse{ImageURL: filePath})
}

type QartResponse struct {
  Error    string `json:"error"`
  ImageURL string `json:"imageURL"`
}

func responseWithJSON(w http.ResponseWriter, content interface{}) {
  w.Header().Set("Content-Type", "application/json")
  data, err := json.Marshal(content)
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
    return
  }
  w.Write(data)
}


func getParams(r *http.Request) (f multipart.File, content string, embed bool, rectangle image.Rectangle, err error) {
  f, _, _ = r.FormFile("image")

  content = r.FormValue("content")

  if content == "" {
    err = errors.New("content cannot be blank")
    return
  }

  embed = r.FormValue("embed") == "true"

  xPos, _ := strconv.Atoi(r.FormValue("xpos"))
  yPos, _ := strconv.Atoi(r.FormValue("ypos"))
  width, _ := strconv.Atoi(r.FormValue("width"))

  if width != 0 {
    rectangle = image.Rect(xPos, yPos, xPos+width, yPos+width)
  }

  return
}

func setupCORS(w http.ResponseWriter, req *http.Request) {
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
  w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func startServer(addr string, serveFrontend bool, frontendAddr string) {
  http.HandleFunc("/qart", qart)
  http.Handle("/"+CachePath + "/", http.StripPrefix("/"+CachePath+"/", http.FileServer(http.Dir(CachePath))))
  if serveFrontend {
    go func() {
      log.Println("frontend server listening on 0.0.0.0:8081")
      log.Fatal(http.ListenAndServe(frontendAddr, http.FileServer(http.Dir(FrontEndFolder))))
    }()
  }
  log.Printf("backend server listening on %s", addr)
  log.Fatal(http.ListenAndServe(addr, nil))
}

func main() {
  backendAddr := flag.String("baddr", "127.0.0.1:8080", "backend ip:port")
  frontendAddr := flag.String("faddr", "127.0.0.1:8081", "ip:port of frontend file server.")
  serveFrontend := flag.Bool("serve-frontend", false, "if true will serve the frontend files contains in qart-web folder")
  flag.Parse()
  startServer(*backendAddr, *serveFrontend, *frontendAddr)
}

func init() {
  os.Mkdir(CachePath, os.ModePerm)
}
