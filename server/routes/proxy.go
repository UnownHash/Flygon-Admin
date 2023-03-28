package routes

import (
	"encoding/json"
	"flygon-admin/server/config"
	"flygon-admin/server/util"
	"io/ioutil"
	"net/http"

	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
)

func getSecret(dest string) (string, string) {
	if dest == "flygon" {
		return "X-FlyGOn-Secret", config.SafeGetString("flygon.api_secret")
	}
	return "X-Golbat-Secret", config.SafeGetString("golbat.api_secret")
}

func getApiEndpoint(dest string) string {
	if dest == "flygon" {
		return config.SafeGetString("flygon.api_endpoint")
	}
	return config.SafeGetString("golbat.api_endpoint")
}

func buildRequest(dest string, c *gin.Context) (string, error) {
	fullUrl := util.JoinUrl(getApiEndpoint(dest), c.Request.RequestURI)

	req, err := http.NewRequest(c.Request.Method, fullUrl, c.Request.Body)

	if err != nil {
		return fullUrl, err
	}

	req.Header.Set(getSecret(dest))

	httpClient := &http.Client{}
	res, err := httpClient.Do(req)

	if err != nil {
		return fullUrl, err
	}

	defer req.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return fullUrl, err
	}

	var data interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return fullUrl, err
	}

	c.JSON(res.StatusCode, data)
	return fullUrl, nil
}

func Flygon(c *gin.Context) {
	fullUrl, err := buildRequest("flygon", c)

	if err != nil {
		log.Warnf("[FLYGON] %s | error with request: %s", fullUrl, err)
		c.JSON(500, gin.H{"error": err.Error()})
	}
}
