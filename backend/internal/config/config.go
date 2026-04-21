package config

// Config holds all application configuration.
type Config struct {
	Port string
}

// Load returns the app config.
// Later: read from .env or OS environment variables.
func Load() *Config {
	return &Config{
		Port: "8080",
	}
}