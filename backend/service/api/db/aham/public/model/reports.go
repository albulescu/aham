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

type Reports struct {
	ID            int32 `sql:"primary_key"`
	Reporter      *int32
	ReporterName  *string
	ReporterEmail *string
	Resource      string
	Reference     int32
	Reason        string
	Comments      string
	Navitator     string
	IP            string
	CreatedAt     time.Time
	Status        string
}
