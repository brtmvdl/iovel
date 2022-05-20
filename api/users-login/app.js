const db = require('/iovel/commons/db')
const loginIndex = db.in('logins')

module.exports = ({ body: { email } }, res) => {
  const login = loginIndex.new()
  const created_at = Date.now().toString()
  login.writeMany({ email, created_at })
  return res.json({ id: login.getId(), created_at })
}
