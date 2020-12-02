package services

import "learngo2/server/dao"

// HomeData for home page
type HomeData struct {
	Title       string
	PageStyles  []string
	PageScripts []string
	StuList     []dao.StuInfo
}

// GetHomeData get data fro home page
func GetHomeData(stuList []dao.StuInfo) (data *HomeData, err error) {
	data = &HomeData{
		Title:       "学生成绩录入",
		PageStyles:  []string{"/static/home.css"},
		PageScripts: []string{"/static/home.js"},
		StuList:     stuList,
	}
	return data, nil
}
