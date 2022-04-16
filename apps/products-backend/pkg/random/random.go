package random

import (
	"crypto/rand"
	"encoding/base64"
	"math"
	"math/big"
)

// Int generates cryptographically random number with N digits.
func Int(digits uint) (int64, error) {
	nBig, err := rand.Int(
		rand.Reader,
		// 10^digits - 10^(digits-1)
		big.NewInt(int64(math.Pow10(int(digits))-math.Pow10(int(digits-1)))))
	if err != nil {
		return 0, err
	}
	// add 10^(digits-1) here so that the first digit will always be non-zero
	n := nBig.Int64() + int64(math.Pow10(int(digits-1)))
	return n, nil
}

// String generates cryptographically secure string of N length.
func String(length uint) (string, error) {
	b, err := Bytes(length)
	return base64.URLEncoding.EncodeToString(b), err
}

// Bytes generates cryptographically secure bytes of N size.
func Bytes(length uint) ([]byte, error) {
	b := make([]byte, length)
	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}
	return b, nil
}
