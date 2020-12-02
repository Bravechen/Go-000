package dao

import (
	"database/sql"

	// import go-sqlite3
	_ "github.com/mattn/go-sqlite3"
	xerrors "github.com/pkg/errors"
)

// DB is a sqlite instance
var DB *sql.DB

type MockStuInfo struct {
	StuName    string
	StuScore   int
	StuRanking int
}

type StuInfo struct {
	Id         int
	StuName    string
	StuScore   int
	StuRanking int
}

// ConnectDB connect sqlite db
func ConnectDB() (db *sql.DB, err error) {
	db, err = sql.Open("sqlite3", "/Users/Brave/workplace/githubWP/blog-dir/learnGo/db/stu_scores")
	if err != nil {
		return nil, err
	}
	DB = db
	return db, err
}

// InsertMockData, mock data
func InsertMockData() error {
	stmt, err := DB.Prepare("INSERT INTO stu_infos(stu_name, stu_score, stu_ranking) VALUES(?,?,?)")

	defer stmt.Close()

	if err != nil {
		return xerrors.Wrapf(err, "Mock data failed")
	}

	stuList := []*MockStuInfo{
		&MockStuInfo{"张三", 98, 1},
		&MockStuInfo{"李四", 62, 3},
		&MockStuInfo{"王五", 87, 2},
	}

	for _, stu := range stuList {
		_, err := stmt.Exec(stu.StuName, stu.StuScore, stu.StuRanking)
		if err != nil {
			return xerrors.Wrapf(err, "Insert data into db failed")
		}
	}

	return nil
}

// GetStuList, for get stu list from db
func GetStuList() (stuList []StuInfo, err error) {
	rows, err := DB.Query("SELECT id, stu_name, stu_score, stu_ranking FROM stu_infos")
	if err != nil {
		return nil, xerrors.Wrapf(err, "Query data from db failed")
	}
	for rows.Next() {
		stu := StuInfo{}
		if err = rows.Scan(&stu.Id, &stu.StuName, &stu.StuScore, &stu.StuRanking); err != nil {
			return nil, xerrors.Wrapf(err, "Query data from db failed")
		}
		stuList = append(stuList, stu)
	}

	return
}
