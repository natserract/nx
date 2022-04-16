package errs

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/go-errors/errors"
	"github.com/jackc/pgconn"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

const (
	// Complete list of postgres error: https://www.postgresql.org/docs/9.3/errcodes-appendix.html
	pgNotNullConstraintViolation = "23502"
	pgForeignKeyViolation        = "23503"
	pgUniqueConstraintViolation  = "23505"
)

// Plain create a new status.Error from code.
func Plain(ctx context.Context, code codes.Code) error {
	SendToSentry(ctx, code, errors.New(code.String()))
	return status.Error(code, code.String())
}

// New create a new status.Error from code and message.
func New(ctx context.Context, code codes.Code, msg string) error {
	SendToSentry(ctx, code, errors.New(msg))
	return status.Error(code, msg)
}

// Newf create a new status.Error from code and message.
func Newf(ctx context.Context, code codes.Code, format string, args ...interface{}) error {
	formattedString := fmt.Sprintf(format, args...)
	SendToSentry(ctx, code, errors.New(formattedString))
	return status.Error(code, formattedString)
}

// From create a new status.Error from a preexisting error.
func From(ctx context.Context, code codes.Code, err error) error {
	SendToSentry(ctx, code, err)
	return status.Error(code, err.Error())
}

// SendToSentry sends an error event to sentry to be captured.
func SendToSentry(ctx context.Context, code codes.Code, err error) {
	if code == codes.OK {
		return
	}

	log.Println(errors.Wrap(err, 2))

	// sentryhub := sentry.CurrentHub()
	// sentryhub.CaptureException(err)
}

// APIError writes default error message and header for a given http status code.
func APIError(ctx context.Context, w http.ResponseWriter, code int, err error) {
	log.Println(err)
	http.Error(w, http.StatusText(code), code)
}

// IsGormNotFound returns true if error is related to gorm.ErrRecordNotFound.
func IsGormNotFound(err error) bool {
	return errors.Is(err, gorm.ErrRecordNotFound)
}

// TryConvertPostgresError best effort conversion to pg.Error.
func TryConvertPostgresError(err error) (*pgconn.PgError, bool) {
	pgError, ok := err.(*pgconn.PgError)
	return pgError, ok
}

// IsPostgresUniqueConstraintViolationError returns true if error is related to unique constraint.
func IsPostgresUniqueConstraintViolationError(err error) bool {
	pqerr, ok := TryConvertPostgresError(err)
	if !ok {
		return false
	}
	return pqerr.Code == pgUniqueConstraintViolation
}

// IsPostgresNotNullConstraintViolationError returns true if error is related to not null
// constraint.
func IsPostgresNotNullConstraintViolationError(err error) bool {
	pqerr, ok := TryConvertPostgresError(err)
	if !ok {
		return false
	}
	return pqerr.Code == pgNotNullConstraintViolation
}

// IsPostgresForeignKeyViolationError returns true if error is related to foreign key violation.
func IsPostgresForeignKeyViolationError(err error) bool {
	pqerr, ok := TryConvertPostgresError(err)
	if !ok {
		return false
	}
	return pqerr.Code == pgForeignKeyViolation
}
