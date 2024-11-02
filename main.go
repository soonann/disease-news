package main

import (
	api "disease-news/soonann/api"
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {

	envMap, err := godotenv.Read(".env")
	fmt.Println(envMap)
	if err != nil || envMap["NEWS_API_KEY"] == "" {
		log.Fatalf("Error %s\n", err.Error())
	}

	http.HandleFunc("/", api.Handler)
	log.Fatal(http.ListenAndServe(":8080", nil))

}
