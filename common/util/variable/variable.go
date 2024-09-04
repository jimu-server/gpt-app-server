package variable

import "reflect"

func IsNil(v any) bool {
	ref := reflect.ValueOf(v)
	switch ref.Kind() {
	case reflect.Pointer:
		return ref.IsNil()
	case reflect.Map:
		return ref.IsNil()
	case reflect.Struct:
		return ref.IsZero()
	}
	return false
}
