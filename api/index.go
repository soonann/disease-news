package handler

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	page := 1
	if queryParams.Get("page") != "" {

		p, err := strconv.Atoi(queryParams.Get("page"))
		if err != nil {
			fmt.Println("error parsing int")
		}

		page = p

	}

	// Variables
	NEWS_API_KEY := os.Getenv("NEWS_API_KEY")
	keyword := "measles"
	url := fmt.Sprintf(
		"https://newsapi.org/v2/everything?q=%s&apiKey=%s&page=%d",
		keyword,
		NEWS_API_KEY,
		page,
	)

	// Get news
	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Error fetching data from external API", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(io.Reader(resp.Body))
	if err != nil {
		http.Error(w, "Error reading response from external API", http.StatusInternalServerError)
		return
	}

	// Forward the external API response back to the client as JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(body)
}
