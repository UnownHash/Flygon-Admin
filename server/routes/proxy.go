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

func GetSecret(dest string) (header string, secret string) {
	if dest == "flygon" {
		return "X-FlyGOn-Secret", config.SafeGetString("flygon.api_secret")
	}
	return "X-Golbat-Secret", config.SafeGetString("golbat.api_secret")
}

func GetApiEndpoint(dest string) (url string) {
	if dest == "flygon" {
		return config.SafeGetString("flygon.api_endpoint")
	}
	return config.SafeGetString("golbat.api_endpoint")
}

func BuildRequest(dest string, c *gin.Context) (err error) {
	fullUrl := util.JoinUrl(GetApiEndpoint(dest), c.Request.RequestURI)

	req, err := http.NewRequest(c.Request.Method, fullUrl, c.Request.Body)

	if err != nil {
		return err
	}

	req.Header.Set(GetSecret(dest))

	httpClient := &http.Client{}
	res, err := httpClient.Do(req)

	if err != nil {
		return err
	}

	defer req.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	var data interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return err
	}

	c.JSON(res.StatusCode, data)
	return nil
}

func Flygon(c *gin.Context) {
	err := BuildRequest("flygon", c)

	if err != nil {
		log.Warnf("[FLYGON] %s Error with request: %s", err)
		c.JSON(500, gin.H{"error": err.Error()})
	}
}
