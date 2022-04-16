package strings

import "strconv"

func ParseUint(str string) (uint, error) {
	u64, err := strconv.ParseUint(str, 10, 64)
	if err != nil {
		return 0, err
	}
	u := uint(u64)
	return u, nil
}
