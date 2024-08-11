package db

import (
	logs "github.com/jimu-server/logger"
	_ "github.com/mattn/go-sqlite3"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
	"log"
	"time"
)

var DB *gorm.DB

func init() {
	var err error
	conStr := "file:gpt.db?charset=utf8"
	DB, err = gorm.Open(sqlite.Open(conStr), getConfig())
	if err != nil {
		logs.Logger.Panic(err.Error())
	}
	sqlDB, err := DB.DB()
	if err != nil {
		logs.Logger.Panic(err.Error())
		return
	}

	if err := sqlDB.Ping(); err != nil {
		logs.Logger.Panic(err.Error())
		return
	}
	// SetMaxIdleConns sets the maximum number of connections in the idle connection pool.
	sqlDB.SetMaxIdleConns(10)
	// SetMaxOpenConns sets the maximum number of open connections to the database.
	sqlDB.SetMaxOpenConns(100)
	// SetConnMaxLifetime sets the maximum amount of time a connection may be reused.
	sqlDB.SetConnMaxLifetime(time.Hour)
}

func getConfig() *gorm.Config {
	newLogger := logger.New(
		log.New(logs.MultiWriteSyncer, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second, // Slow SQL threshold
			LogLevel:                  logger.Info, // Log level
			IgnoreRecordNotFoundError: true,        // Ignore ErrRecordNotFound error for logger
			ParameterizedQueries:      true,        // Don't include params in the SQL log
			Colorful:                  false,       // Disable color
		},
	)
	return &gorm.Config{
		Logger:                                   newLogger,
		DisableAutomaticPing:                     true,
		DisableForeignKeyConstraintWhenMigrating: true,
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true, // use singular table name, table for `User` would be `user` with this option enabled
			NoLowerCase:   true, // skip the snake_casing of names
		},
	}
}
