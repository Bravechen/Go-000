package main

import (
	"fmt"
	"html/template"
	"learngo2/server/dao"
	"learngo2/server/services"
	"log"
	"net/http"

	xerrors "github.com/pkg/errors"
)

// 初始化
func init() {
	defer func() {
		if err := recover(); err != nil {
			log.Fatal("Connect sqlite failed:", err)
		}
	}()

	_, err := dao.ConnectDB()
	if err != nil {
		panic(err)
	}
	dao.InsertMockData()
}

// 入口
func main() {
	mux := http.NewServeMux()
	files := http.FileServer(http.Dir("../../web/static"))
	mux.Handle("/static/", http.StripPrefix("/static/", files))

	mux.HandleFunc("/", router)

	server := &http.Server{
		Addr:    "127.0.0.1:5050",
		Handler: mux,
	}
	server.ListenAndServe()
}

// 合成并注册html模板
func generateHTML(res http.ResponseWriter, data interface{}, fn ...string) {
	var files []string
	for _, file := range fn {
		files = append(files, fmt.Sprintf("../../web/views/%s.html", file))
	}
	template := template.Must(template.ParseFiles(files...))
	template.ExecuteTemplate(res, "layout", data)
}

// 根路由处理器
func router(res http.ResponseWriter, req *http.Request) {
	stuList, err := dao.GetStuList()
	if err != nil {
		res.WriteHeader(500)
		fmt.Fprintln(res, xerrors.Unwrap(err))
		return
	}

	pageData, err := services.GetHomeData(stuList)
	if err != nil {
		res.WriteHeader(500)
		fmt.Fprintln(res, err)
		return
	}

	generateHTML(res, pageData, "layout", "index")
}
