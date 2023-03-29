package main

import (
	"flygon-admin/server/config"
	"flygon-admin/server/routes"
	"fmt"
	"os"
	"strings"

	"github.com/gin-contrib/static"
	ginlogrus "github.com/toorop/gin-logrus"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func main() {
	config.ReadConfig()

	router := gin.Default()
	router.Use(ginlogrus.Logger(log.StandardLogger()), gin.Recovery())
	router.Use(gin.Recovery())

	auth := router.Group("/auth")

	auth.POST("/login", routes.Login)
	auth.GET("/logout", routes.Logout)
	auth.GET("/status", routes.Status)

	api := router.Group("/api")
	api.Use(routes.Middleware())

	api.GET("/areas/", routes.FlygonProxy)
	api.GET("/areas/:area_id", routes.FlygonProxy)
	api.POST("/areas/", routes.FlygonProxy)
	api.PATCH("/areas/:area_id", routes.FlygonProxy)
	api.DELETE("/areas/:area_id", routes.FlygonProxy)

	api.GET("/accounts/", routes.FlygonProxy)
	api.GET("/accounts/stats", routes.FlygonProxy)
	api.GET("/accounts/level-stats", routes.FlygonProxy)
	api.GET("/accounts/:account_name", routes.FlygonProxy)
	api.POST("/accounts/", routes.FlygonProxy)
	api.PATCH("/accounts/", routes.FlygonProxy)
	api.DELETE("/accounts/", routes.FlygonProxy)

	api.GET("/reload", routes.FlygonProxy)
	api.GET("/reload/accounts", routes.FlygonProxy)

	api.POST("/quest-status", routes.GolbatProxy)

	addr := fmt.Sprintf("%s:%d", config.SafeGetString("general.host"), config.SafeGetInt("general.port"))

	path := "./dist"
	if strings.Contains(os.Getenv("PWD"), "server") {
		path = "../dist"
	}
	router.Use(static.Serve("/", static.LocalFile(path, false)))

	err := router.Run(addr)
	if err != nil {
		log.Fatal(err)
	}
}
