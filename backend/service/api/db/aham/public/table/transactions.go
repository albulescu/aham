//
// Code generated by go-jet DO NOT EDIT.
//
// WARNING: Changes to this file may cause incorrect behavior
// and will be lost if the code is regenerated
//

package table

import (
	"github.com/go-jet/jet/v2/postgres"
)

var Transactions = newTransactionsTable("public", "transactions", "")

type transactionsTable struct {
	postgres.Table

	// Columns
	ID       postgres.ColumnInteger
	Owner    postgres.ColumnInteger
	AdID     postgres.ColumnInteger
	AdCycle  postgres.ColumnInteger
	AdFrom   postgres.ColumnTimestamp
	AdTo     postgres.ColumnTimestamp
	Amount   postgres.ColumnFloat
	Created  postgres.ColumnTimestamp
	Approved postgres.ColumnTimestamp

	AllColumns     postgres.ColumnList
	MutableColumns postgres.ColumnList
}

type TransactionsTable struct {
	transactionsTable

	EXCLUDED transactionsTable
}

// AS creates new TransactionsTable with assigned alias
func (a TransactionsTable) AS(alias string) *TransactionsTable {
	return newTransactionsTable(a.SchemaName(), a.TableName(), alias)
}

// Schema creates new TransactionsTable with assigned schema name
func (a TransactionsTable) FromSchema(schemaName string) *TransactionsTable {
	return newTransactionsTable(schemaName, a.TableName(), a.Alias())
}

// WithPrefix creates new TransactionsTable with assigned table prefix
func (a TransactionsTable) WithPrefix(prefix string) *TransactionsTable {
	return newTransactionsTable(a.SchemaName(), prefix+a.TableName(), a.TableName())
}

// WithSuffix creates new TransactionsTable with assigned table suffix
func (a TransactionsTable) WithSuffix(suffix string) *TransactionsTable {
	return newTransactionsTable(a.SchemaName(), a.TableName()+suffix, a.TableName())
}

func newTransactionsTable(schemaName, tableName, alias string) *TransactionsTable {
	return &TransactionsTable{
		transactionsTable: newTransactionsTableImpl(schemaName, tableName, alias),
		EXCLUDED:          newTransactionsTableImpl("", "excluded", ""),
	}
}

func newTransactionsTableImpl(schemaName, tableName, alias string) transactionsTable {
	var (
		IDColumn       = postgres.IntegerColumn("id")
		OwnerColumn    = postgres.IntegerColumn("owner")
		AdIDColumn     = postgres.IntegerColumn("ad_id")
		AdCycleColumn  = postgres.IntegerColumn("ad_cycle")
		AdFromColumn   = postgres.TimestampColumn("ad_from")
		AdToColumn     = postgres.TimestampColumn("ad_to")
		AmountColumn   = postgres.FloatColumn("amount")
		CreatedColumn  = postgres.TimestampColumn("created")
		ApprovedColumn = postgres.TimestampColumn("approved")
		allColumns     = postgres.ColumnList{IDColumn, OwnerColumn, AdIDColumn, AdCycleColumn, AdFromColumn, AdToColumn, AmountColumn, CreatedColumn, ApprovedColumn}
		mutableColumns = postgres.ColumnList{OwnerColumn, AdIDColumn, AdCycleColumn, AdFromColumn, AdToColumn, AmountColumn, CreatedColumn, ApprovedColumn}
	)

	return transactionsTable{
		Table: postgres.NewTable(schemaName, tableName, alias, allColumns...),

		//Columns
		ID:       IDColumn,
		Owner:    OwnerColumn,
		AdID:     AdIDColumn,
		AdCycle:  AdCycleColumn,
		AdFrom:   AdFromColumn,
		AdTo:     AdToColumn,
		Amount:   AmountColumn,
		Created:  CreatedColumn,
		Approved: ApprovedColumn,

		AllColumns:     allColumns,
		MutableColumns: mutableColumns,
	}
}
