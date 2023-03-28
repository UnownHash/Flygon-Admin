package main

import (
	"flygon-admin/server/config"
	"flygon-admin/server/routes"
	"fmt"

	"github.com/gin-contrib/static"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	ginlogrus "github.com/toorop/gin-logrus"
)

func main() {
	config.ReadConfig()

	router := gin.Default()
	router.Use(ginlogrus.Logger(log.StandardLogger()), gin.Recovery())
	router.Use(gin.Recovery())
	api := router.Group("/api")

	api.GET("/areas/", routes.FlygonRedirect)
	api.GET("/areas/:area_id", routes.FlygonRedirect)
	api.POST("/areas/", routes.FlygonRedirect)
	api.DELETE("/areas/:area_id", routes.FlygonRedirect)
	api.PATCH("/areas/:area_id", routes.FlygonRedirect)

	api.GET("/accounts/", routes.FlygonRedirect)
	api.GET("/accounts/stats", routes.FlygonRedirect)
	api.GET("/accounts/level-stats", routes.FlygonRedirect)
	api.GET("/accounts/:account_name", routes.FlygonRedirect)
	api.POST("/accounts/", routes.FlygonRedirect)
	api.DELETE("/accounts/", routes.FlygonRedirect)
	api.PATCH("/accounts/", routes.FlygonRedirect)
	api.GET("/reload/accounts", routes.FlygonRedirect)

	api.GET("/reload", routes.FlygonRedirect)

	addr := fmt.Sprintf("%s:%d", config.SafeGetString("general.host"), config.SafeGetInt("general.port"))

	router.Use(static.Serve("/", static.LocalFile("../dist", false)))

	err := router.Run(addr)
	if err != nil {
		log.Fatal(err)
	}
}
