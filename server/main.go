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

	api.GET("/areas/", routes.Flygon)
	api.GET("/areas/:area_id", routes.Flygon)
	api.POST("/areas/", routes.Flygon)
	api.DELETE("/areas/:area_id", routes.Flygon)
	api.PATCH("/areas/:area_id", routes.Flygon)

	api.GET("/accounts/", routes.Flygon)
	api.GET("/accounts/stats", routes.Flygon)
	api.GET("/accounts/level-stats", routes.Flygon)
	api.GET("/accounts/:account_name", routes.Flygon)
	api.POST("/accounts/", routes.Flygon)
	api.DELETE("/accounts/", routes.Flygon)
	api.PATCH("/accounts/", routes.Flygon)
	api.GET("/reload/accounts", routes.Flygon)

	api.GET("/reload", routes.Flygon)

	addr := fmt.Sprintf("%s:%d", config.SafeGetString("general.host"), config.SafeGetInt("general.port"))

	router.Use(static.Serve("/", static.LocalFile("../dist", false)))

	err := router.Run(addr)
	if err != nil {
		log.Fatal(err)
	}
}
