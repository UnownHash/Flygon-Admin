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

func FlygonRedirect(c *gin.Context) {
	fullUrl := util.JoinUrl(config.SafeGetString("flygon.api_endpoint"), c.Request.RequestURI)
	var x interface{}

	req, err := http.NewRequest(c.Request.Method, fullUrl, c.Request.Body)

	if err != nil {
		log.Warnf("Error creating request: %s", err)
	}

	req.Header.Set("X-FlyGOn-Secret", config.SafeGetString("flygon.api_secret"))

	httpClient := &http.Client{}
	res, err := httpClient.Do(req)

	if err != nil {
		log.Warnf("Error sending request: %s", err)
	}

	defer req.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Warnf("Error reading request: %s", err)
	}

	err = json.Unmarshal(body, &x)
	if err != nil {
		log.Warnf("Error parsing request: %s", err)
	}

	if err != nil {
		c.JSON(res.StatusCode, gin.H{"error": err.Error()})
		return
	}
	c.JSON(res.StatusCode, x)

}
