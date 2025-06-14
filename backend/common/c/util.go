package c

import (
	"crypto/rand"
	"database/sql/driver"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"

	"github.com/go-chi/chi/v5"
	"golang.org/x/text/runes"
	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
)

type D map[string]any
type M map[string]string

func (a D) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *D) Scan(value interface{}) error {

	if value == nil {
		return nil
	}

	b, ok := value.(string)

	if !ok {
		return errors.New("c.D type assertion to []byte failed")
	}

	return json.Unmarshal([]byte(b), &a)
}

func (a M) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *M) Scan(value interface{}) error {

	if value == nil {
		return nil
	}

	b, ok := value.(string)

	if !ok {
		return errors.New("c.M type assertion to []byte failed")
	}

	return json.Unmarshal([]byte(b), &a)
}

func NilID(id int64) *int64 {
	return Int64P(id)
}

func Int64P(v int64) *int64 {
	if v == 0 {
		return nil
	}
	return &v
}

func String(s string) *string {
	return &s
}

func Dev() bool {
	return os.Getenv("DEV") == "true"
}

type Subdomain string

const (
	Web Subdomain = "web"
	Api Subdomain = "api"
	Cdn Subdomain = "cdn"
)

func URLF(sd Subdomain, s string, a ...any) string {

	dev := os.Getenv("DEV") == "true"

	domains := map[Subdomain]string{
		Web: "https://aham.ro",
		Api: "https://api.aham.ro",
		Cdn: "https://cdn.aham.ro",
	}

	if dev {
		domains[Web] = "http://localhost:3000"
		domains[Api] = "http://localhost:8001"
		domains[Cdn] = "http://localhost:8002"
	}

	return fmt.Sprintf(domains[sd]+s, a...)
}

func NilString(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func QueryIntParam(r *http.Request, name string, def int64) int64 {

	p := r.URL.Query().Get(name)
	n, err := strconv.ParseInt(p, 10, 64)

	if err != nil {
		return def
	}

	return n
}

func ID(r *http.Request, name string) int64 {

	p := chi.URLParam(r, name)
	n, err := strconv.ParseInt(p, 10, 64)

	if err != nil {
		panic(fmt.Sprintf("ID(%s) missing from request", name))
	}

	return n
}

func Todo(todo string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotImplemented)
		w.Write([]byte("Todo: " + todo))
	}
}

func GenerateNonce(n int) (string, error) {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func MustGenerateNonce(n int) string {
	nonce, _ := GenerateNonce(n)
	return nonce
}

func Copy(dst, from any) error {

	data, err := json.Marshal(from)

	if err != nil {
		return err
	}

	return json.Unmarshal(data, dst)
}

func Normalize(s string) string {
	t := transform.Chain(norm.NFD, runes.Remove(runes.In(unicode.Mn)), norm.NFC)
	result, _, err := transform.String(t, s)
	if err != nil {
		return ""
	}
	return strings.ToLower(result)
}

func Ucfirst(s string) string {
	if s == "" {
		return s
	}

	// Decode the first rune (character) from the string
	r, size := utf8.DecodeRuneInString(s)
	if r == utf8.RuneError {
		return s
	}

	// Convert the first rune to uppercase
	first := unicode.ToUpper(r)

	// Concatenate the uppercase first rune with the rest of the string
	return string(first) + s[size:]
}

// IP extracts the client IP address and returns it in a format compatible with PostgreSQL INET type
func IP(r *http.Request) string {
	// First, try to get the IP from X-Forwarded-For header (if behind a proxy)
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		// X-Forwarded-For may contain a comma-separated list of IPs
		parts := strings.Split(forwarded, ",")
		clientIP := strings.TrimSpace(parts[0]) // the first one is usually the client's real IP
		if net.ParseIP(clientIP) != nil {
			return clientIP // return valid IP
		}
	}

	// Fall back to RemoteAddr if not behind a proxy
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		ip = r.RemoteAddr // In case there's no port
	}

	// Normalize localhost
	if ip == "[::1]" || ip == "::1" || ip == "" {
		ip = "127.0.0.1"
	}

	if net.ParseIP(ip) != nil {
		return ip
	}

	return "" // Return empty string if IP is invalid
}
