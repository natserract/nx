package dal

import (
	"errors"
	"fmt"
	"reflect"

	"gorm.io/gorm"
)

// Scope GORM interaction scope.
type Scope struct {
	Name string
	F    func(*gorm.DB) *gorm.DB
	// reorders the scope order. Disabling this for now until we need it
	// Priority int
}

// Configuration GORM configuration to apply before final call.
type Configuration struct {
	Transaction  *gorm.DB
	PreloadObjs  []string
	SelectFields []string
	WhereClauses []WhereClause
	OrderClauses []OrderClause
	Scopes       []Scope
	Unscoped     bool
}

// ApplyConfiguration applies the GORM configuration to database client.
func ApplyConfiguration(db *gorm.DB, c *Configuration) *gorm.DB {
	client := db
	if c != nil {
		if c.Transaction != nil {
			client = c.Transaction
		}
		if c.Unscoped {
			client = client.Unscoped()
		}
		client = ApplyScopes(client, c.Scopes...)
		client = ApplyPreloadObjs(client, c.PreloadObjs...)
		client = ApplySelectFields(client, c.SelectFields...)
		client = ApplyWhereClauses(client, c.WhereClauses...)
		client = ApplyOrderClauses(client, c.OrderClauses...)
	}
	return client
}

// ApplyPreloadObjs applies preload objects.
func ApplyPreloadObjs(db *gorm.DB, preloadObjs ...string) *gorm.DB {
	for _, preloadObj := range preloadObjs {
		db = db.Preload(preloadObj)
	}
	return db
}

// WhereClause used for DAL statements requiring where clauses.
type WhereClause struct {
	Query interface{}
	Args  []interface{}
}

// ApplyWhereClauses create new db pointer with where clauses applied.
func ApplyWhereClauses(db *gorm.DB, wcs ...WhereClause) *gorm.DB {
	for _, wc := range wcs {
		db = db.Where(wc.Query, wc.Args...)
	}
	return db
}

// ApplyScopes apply scopes to gorm DB interactions.
func ApplyScopes(db *gorm.DB, scopes ...Scope) *gorm.DB {
	for _, s := range scopes {
		fmt.Printf("Applying scope %v\n", s.Name)
		db = db.Scopes(s.F)
	}
	return db
}

// OrderClause used for DAL statements requiring order clauses.
type OrderClause struct {
	Query interface{}
}

// ApplyOrderClauses create new db pointer with order clauses applied.
func ApplyOrderClauses(db *gorm.DB, ocs ...OrderClause) *gorm.DB {
	for _, oc := range ocs {
		db = db.Order(oc.Query)
	}
	return db
}

// ApplySelectFields create new db pointer with select fields applied.
func ApplySelectFields(db *gorm.DB, selectFields ...string) *gorm.DB {
	db = db.Select(selectFields)
	return db
}

// BeginTransaction starts a database transaction.
func BeginTransaction(parentTransaction *gorm.DB, f func(*gorm.DB) error) error {
	return parentTransaction.Transaction(f)
}

// SanitizePointer checks whether or not the parameter passed in fits to GORM requirements for
// results (must be a pointer to a struct or slice).
//
// See https://play.golang.org/p/kB6SPuOepwV for test cases.
func SanitizePointer(p interface{}) (interface{}, error) {
	pValue := reflect.ValueOf(p)

	if pValue.Kind() == reflect.Ptr {
		pElem := pValue.Elem()
		if !isValueGormResultType(pElem) {
			return nil, errors.New("gorm result must be either a pointer to a slice or struct")
		}
		return p, nil
	} else if pValue.Kind() == reflect.Slice {
		if !isValueGormResultType(pValue) {
			return nil, errors.New("gorm result must be either a pointer to a slice or struct")
		}
		return convertToPointer(p), nil
	} else if pValue.Kind() == reflect.Struct {
		return convertToPointer(p), nil
	}
	return nil, errors.New("gorm result must be either a pointer to a slice or struct")
}

func isValueGormResultType(pValue reflect.Value) bool {
	if pValue.Kind() == reflect.Slice {
		if pValue.Type().Elem().Kind() == reflect.Struct {
			// if it is a slice of struct then return true
			return true
		} else if pValue.Type().Elem().Kind() == reflect.Ptr &&
			pValue.Type().Elem().Elem().Kind() == reflect.Struct {
			// if it is a slice of pointers to structs then return true
			return true
		}
		return false
	} else if pValue.Kind() == reflect.Struct {
		return true
	} else if pValue.Kind() == reflect.Ptr {
		return isValueGormResultType(pValue.Elem())
	}
	return false
}

func convertToPointer(v interface{}) interface{} {
	p := reflect.New(reflect.TypeOf(v))
	p.Elem().Set(reflect.ValueOf(v))

	return p.Interface()
}

// SliceToMap converts slice of models to map of id to its respective model.
func SliceToMap(src, dest interface{}) error {
	sValue := reflect.ValueOf(src)
	if sValue.Kind() != reflect.Slice {
		return errors.New("source needs to be a slice")
	}
	if sValue.Kind() == reflect.Ptr {
		sValue = sValue.Elem()
	}

	dValue := reflect.ValueOf(dest)
	if dValue.Kind() != reflect.Ptr {
		return errors.New("destination needs to be a pointer")
	}
	dValue = dValue.Elem()
	if dValue.Kind() != reflect.Map {
		return errors.New("destination needs to be a map")
	}
	dValueType := dValue.Type()
	if dValue.IsNil() {
		dValue.Set(reflect.MakeMapWithSize(dValueType, sValue.Len()))
	}

	for i := 0; i < sValue.Len(); i++ {
		item := sValue.Index(i)
		if item.Kind() == reflect.Struct {
			obj := reflect.Indirect(item)

			id := obj.FieldByName("UUID")
			id = id.Convert(id.Type())
			item = item.Convert(item.Type())

			dValue.SetMapIndex(id, item)
		}
	}

	return nil
}

// SliceToUUIDs converts slice of models to slice of uuids.
func SliceToUUIDs(src, dest interface{}) error {
	sValue := reflect.ValueOf(src)
	if sValue.Kind() != reflect.Slice {
		return errors.New("source needs to be a slice")
	}
	if sValue.Kind() == reflect.Ptr {
		sValue = sValue.Elem()
	}

	dValue := reflect.ValueOf(dest)
	if dValue.Kind() != reflect.Ptr {
		return errors.New("destination needs to be a pointer")
	}
	dValue = dValue.Elem()
	if dValue.Kind() != reflect.Slice {
		return errors.New("destination needs to be a slice")
	}
	dValueType := dValue.Type()
	if dValue.IsNil() {
		dValue.Set(reflect.MakeSlice(dValueType, sValue.Len(), sValue.Len()))
	}

	for i := 0; i < sValue.Len(); i++ {
		item := sValue.Index(i)
		if item.Kind() == reflect.Struct {
			obj := reflect.Indirect(item)

			id := obj.FieldByName("UUID")
			id = id.Convert(id.Type())

			v := dValue.Index(i)
			v.Set(id)
		}
	}

	return nil
}
