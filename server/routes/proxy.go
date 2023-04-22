package routes

import (
	"compress/gzip"
	"encoding/json"
	"flygon-admin/server/config"
	"flygon-admin/server/util"
	"fmt"
	"io"
	"net/http"
	"strings"

	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
)

func getSecret(dest string) (string, string) {
	if dest == "flygon" {
		return "X-FlyGOn-Secret", config.SafeGetString("flygon.api_secret")
	}
	if dest == "koji" {
		return "Authorization", fmt.Sprintf("Bearer %s", config.SafeGetString("koji.bearer_token"))
	}
	return "X-Golbat-Secret", config.SafeGetString("golbat.api_secret")
}

func getEndpoint(dest string) string {
	if dest == "flygon" {
		return config.SafeGetString("flygon.api_endpoint")
	}
	if dest == "koji" {
		return config.SafeGetString("koji.api_endpoint")
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
		log.Infof("Setting header %s to %s", header, c.Request.Header.Get(header))
		req.Header.Set(header, c.Request.Header.Get(header))
	}

	httpClient := &http.Client{}
	res, err := httpClient.Do(req)

	if err != nil {
		return 500, fullUrl, err
	}

	defer res.Body.Close()

	// Types are not saved here since the request is just being proxied
	// Reference Flygon, Golbat, and Koji repos for the full types
	var body interface{}

	if res.Header.Get("Content-Encoding") == "gzip" {
		reader, err := gzip.NewReader(res.Body)
		if err != nil {
			return res.StatusCode, fullUrl, err
		}
		defer reader.Close()

		zippedBody, err := io.ReadAll(reader)
		if err != nil {
			panic(err)
		}
		err = json.Unmarshal(zippedBody, &body)
		if err != nil {
			return res.StatusCode, fullUrl, err
		}
	} else {
		err = json.NewDecoder(res.Body).Decode(&body)
		if err != nil {
			return res.StatusCode, fullUrl, err
		}
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

func KojiProxy(c *gin.Context) {
	buildProxy("koji", c)
}
