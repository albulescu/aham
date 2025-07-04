//
// Code generated by go-jet DO NOT EDIT.
//
// WARNING: Changes to this file may cause incorrect behavior
// and will be lost if the code is regenerated
//

package model

import (
	"time"
)

type Ads struct {
	ID           int32 `sql:"primary_key"`
	Slug         string
	Title        string
	Description  string
	Props        *string
	Category     int32
	Owner        int32
	City         *int32
	Coordinates  *string
	URL          *string
	Tags         *string
	Messages     *bool
	ShowPhone    *bool
	Phone        *string
	Price        int32
	Currency     *Currency
	Pictures     string
	History      *string
	Cycle        int32
	Created      time.Time
	Published    *time.Time
	ValidThrough *time.Time
	Status       string
}
