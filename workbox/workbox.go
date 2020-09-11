package main

import (
	"crypto/md5"
	"encoding/hex"
	"flag"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path"
)

type Cache struct {
	Url			string
	Revision	string
}

func GetCacheList(rootPath string, dirPath string) (l []Cache, err error) {
	dir, err := ioutil.ReadDir(path.Join(rootPath, dirPath))
	if err != nil{
		return
	}

	for _, fi := range dir {
		relPath := path.Join(dirPath, fi.Name())
		if fi.IsDir() {
			dirList, err := GetCacheList(rootPath, relPath)
			if err != nil{
				return nil, err
			}
			l = append(l, dirList...)
		} else {
			ext := path.Ext(fi.Name())
			if ext == ".html" || ext == ".js" || ext == ".css" || ext == ".json" {
				realPath := path.Join(rootPath, relPath)
				revision, err := GetHash(realPath)
				if err != nil {
					return nil, err
				}
				c := Cache{
					Url:      relPath,
					Revision: revision,
				}
				l = append(l, c)
			}
		}
	}
	return 
}

func GetHash(filePath string) (hashString string, err error) {
	f, err := os.Open(filePath)
	if err != nil {
		return 
	}
	defer f.Close()
	
	h := md5.New()
	if _, err = io.Copy(h, f); err != nil {
		return 
	}
	hashBytes := h.Sum(nil)[:16]
	hashString = hex.EncodeToString(hashBytes)
	return 
}

func main()  {
	root := flag.String("r", "./public", "根目录")
	temp := flag.String("t", "./workbox/sw-template-go.js", "模板路径")
	flag.Parse()
	l, err := GetCacheList(*root, "")
	if err != nil {
		log.Fatal(err)
	}
	t, err := template.ParseFiles(*temp)
	if err != nil {
		log.Fatal(err)
	}
	f, err := os.OpenFile(path.Join(*root, "sw.js"), os.O_CREATE|os.O_WRONLY, 0755)
	if err != nil {
		log.Fatal(err)
	}
	err = t.Execute(f, l)
	if err != nil {
		log.Println(err)
	}
}