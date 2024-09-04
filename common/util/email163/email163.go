package email163

import (
	"gopkg.in/gomail.v2"
)

var client *gomail.Dialer

var user string

/*func init() {
	host := config.Evn.App.Email.Host
	port := config.Evn.App.Email.Port
	user = config.Evn.App.Email.User
	password := config.Evn.App.Email.Password
	client = gomail.NewDialer(host, port, user, password)
	client.TLSConfig = &tls.Config{InsecureSkipVerify: true}
}*/

func SendHtml(title, body string, address ...string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", user)
	m.SetHeader("To", address...)
	m.SetAddressHeader("Cc", user, "jimuos")
	m.SetHeader("Subject", title)
	m.SetBody("text/html", body)
	return client.DialAndSend(m)
}
