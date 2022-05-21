const pathPkg = require('path')
const fsPkg = require('fs')

const DataObject = function (dir, id) {
  const self = this

  self.params = { dir, id }

  fsPkg.mkdirSync(pathPkg.join(dir, id), { recursive: true })

  self.getId = () => {
    return self.params.id
  }

  self.getPath = () => {
    return pathPkg.join(self.params.dir, self.params.id)
  }

  self.parsePropPath = (name) => {
    return pathPkg.join(self.getPath(), name)
  }

  self.readString = (name) => {
    return fsPkg.readFileSync(self.parsePropPath(name)).toString()
  }

  self.writeString = (name, content) => {
    fsPkg.writeFileSync(self.parsePropPath(name), content)
    return self
  }

  self.writeMany = (many) => {
    Object.keys(many)
      .map((key) => self.writeString(key, many[key].toString()))

    return self
  }

}

const DataBase = function (dir) {
  const self = this

  self.dir = dir
  fsPkg.mkdirSync(self.dir, { recursive: true })

  self.in = (dir) => {
    return new DataBase(pathPkg.join(self.dir, dir))
  }

  self.new = () => {
    const id = Date.now().toString() // FIXME: uuid
    return new DataObject(self.dir, id)
  }

  self.list = () => {
    return fsPkg.readdirSync(self.dir)
  }

  self.getAll = () => {
    return self.list()
      .map((id) => new DataObject(self.dir, id))
  }

  self.getIndexesFromProp = (props = {}) => {
    return self.getAll()
      .filter(data => {
        return Object.keys(props).every((name) => {
          return data.readString(name) == props[name]
        })
      })
  }

}

module.exports = new DataBase(process.env.DATA_PATH)
