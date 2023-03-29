package routes

import (
	"encoding/json"
	"flygon-admin/server/config"
	"flygon-admin/server/util"
	"io/ioutil"
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
	fullUrl := util.JoinUrl(getEndpoint(dest), c.Request.RequestURI)

	req, err := http.NewRequest(c.Request.Method, fullUrl, c.Request.Body)

	if err != nil {
		return 500, fullUrl, err
	}

	req.Header.Set(getSecret(dest))

	httpClient := &http.Client{}
	res, err := httpClient.Do(req)

	if err != nil {
		return res.StatusCode, fullUrl, err
	}

	defer req.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return res.StatusCode, fullUrl, err
	}

	var data interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return res.StatusCode, fullUrl, err
	}

	c.JSON(res.StatusCode, data)
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
