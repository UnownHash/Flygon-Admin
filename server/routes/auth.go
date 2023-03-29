package routes

import (
	"encoding/json"
	"flygon-admin/server/config"
	"io/ioutil"

	"github.com/gin-gonic/gin"
)

type Auth struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	var data Auth
	err = json.Unmarshal(body, &data)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	if data.Password == config.SafeGetString("general.password") && data.Username == config.SafeGetString("general.username") {
		c.SetCookie("authorized", "true", 60*60*24*30, "/", "", false, true)
		c.JSON(200, gin.H{"message": "success"})
	} else {
		c.JSON(401, gin.H{"message": "incorrect username or password"})
	}
}

func Logout(c *gin.Context) {
	c.SetCookie("authorized", "false", -1, "/", "", false, true)
	c.JSON(200, gin.H{"message": "success"})
}

func Status(c *gin.Context) {
	cookie, err := c.Cookie("authorized")
	if err != nil || cookie != "true" {
		c.JSON(401, gin.H{"message": "unauthorized"})
		return
	}
	c.JSON(200, gin.H{"message": "authorized"})
}

func Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("authorized")
		if err != nil || cookie != "true" {
			c.JSON(401, gin.H{"message": "unauthorized"})
			c.Abort()
			return
		}
		c.Next()
	}
}
