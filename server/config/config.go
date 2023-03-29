package config

import (
	"fmt"
	"strings"

	"github.com/spf13/viper"
)

func setDefaults() {
	viper.SetDefault("general.host", "0.0.0.0")
	viper.SetDefault("general.port", 9003)
	viper.SetDefault("general.username", "")
	viper.SetDefault("general.password", "")

	viper.SetDefault("golbat.api_endpoint", "http://127.0.0.1:9001")
	viper.SetDefault("golbat.api_secret", "")
	viper.SetDefault("flygon.api_endpoint", "http://127.0.0.1:9002")
	viper.SetDefault("flygon.api_secret", "")
}

func ReadConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("toml")
	viper.AddConfigPath("../")

	viper.SetEnvPrefix("flygon-admin")
	viper.AutomaticEnv()

	stringReplacer := strings.NewReplacer(".", "_")
	viper.SetEnvKeyReplacer(stringReplacer)

	setDefaults()

	err := viper.ReadInConfig()

	if err != nil && !strings.Contains(err.Error(), "Config File \"config\" Not Found in") {
		panic(fmt.Errorf("fatal config file error: %w", err))
	}
}

func SafeGetString(key string) string {
	if !viper.IsSet(key) {
		panic(fmt.Errorf("value `%s` not configured", key))
	}

	return viper.GetString(key)
}

func SafeGetInt(key string) int {
	if !viper.IsSet(key) {
		panic(fmt.Errorf("value `%s` not configured", key))
	}

	return viper.GetInt(key)
}
