package handler

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// Variables
	NEWS_API_KEY := os.Getenv("NEWS_API_KEY")
	keyword := "measles"
	url := fmt.Sprintf(
		"https://newsapi.org/v2/everything?q=%s&apiKey=%s",
		keyword,
		NEWS_API_KEY,
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
