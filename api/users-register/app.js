const { DuplicationError } = require('/iovel/commons/errors')
const db = require('/iovel/commons/db')
const userIndex = db.in('users')

module.exports = ({ body: { name, email } }, res) => {
  const users = userIndex.getIndexesFromProp({ email })
  if (users.length) throw new DuplicationError({ email })

  const user = userIndex.new()
  const created_at = Date.now().toString()
  user.writeMany({ name, email, created_at })
  return res.json({ id: user.getId(), created_at })
}
