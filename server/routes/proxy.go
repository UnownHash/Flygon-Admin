package routes

import (
	"encoding/json"
	"flygon-admin/server/config"
	"flygon-admin/server/util"
	"fmt"
	"net/http"
	"strings"

	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
)

func getSecret(dest string) (string, string) {
	if dest == "flygon" {
		return "X-FlyGOn-Secret", config.SafeGetString("flygon.api_secret")
	}
	return "X-Golbat-Secret", config.SafeGetString("golbat.api_secret")
}

func getEndpoint(dest string) string {
	if dest == "flygon" {
		return config.SafeGetString("flygon.api_endpoint")
	}
	return config.SafeGetString("golbat.api_endpoint")
}

func buildRequest(dest string, c *gin.Context) (int, string, error) {
	endpoint := getEndpoint(dest)

	if endpoint == "" {
		return 500, "", fmt.Errorf("endpoint not found for %s", dest)
	}

	fullUrl := util.JoinUrl(endpoint, c.Request.RequestURI)

	req, err := http.NewRequest(c.Request.Method, fullUrl, c.Request.Body)

	if err != nil {
		return 500, fullUrl, err
	}

	req.Header.Set(getSecret(dest))

	for header := range c.Request.Header {
		req.Header.Set(header, c.Request.Header.Get(header))
	}

	httpClient := &http.Client{}
	res, err := httpClient.Do(req)

	if err != nil {
		return 500, fullUrl, err
	}

	defer res.Body.Close()

	// Types are not saved here since the request is just being proxied
	// Reference Flygon & Golbat repos for the full types
	var body interface{}
	err = json.NewDecoder(res.Body).Decode(&body)
	if err != nil {
		return res.StatusCode, fullUrl, err
	}

	c.JSON(res.StatusCode, body)
	return res.StatusCode, fullUrl, nil
}

func buildProxy(dest string, c *gin.Context) {
	code, url, err := buildRequest(dest, c)
	if err != nil {
		log.Warnf("[%s] %s | error with request: %s", strings.ToUpper(dest), url, err)
		c.JSON(code, gin.H{"error": err.Error()})
	}
}

func FlygonProxy(c *gin.Context) {
	buildProxy("flygon", c)
}

func GolbatProxy(c *gin.Context) {
	buildProxy("golbat", c)
}
