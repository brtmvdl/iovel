const netPkg = require('net')
const { Buffer } = require('buffer')

const app = require('/iovel/app/app')
const { ApplicationError } = require('./errors')

const LINE_BREAK = '\r\n'

const HttpRequest = function (str) {
  const self = this

  self.parseBody = (req = '\n\n{}') => {
    const [, body] = req.toString()
      .split(/\r?\n\r?\n/ig)
      .filter(f => f)

    return JSON.parse(body)
  }

  self.body = self.parseBody(str)

  self.headers = {} // TODO

  self.query = {} // TODO

  self.url = '' // TODO
}

const HttpResponse = function () {
  const self = this

  self.config = {
    statusCode: 200,
    statusMessage: 'OK',
    contentType: 'text/html',
    body: '',
  }

  self.error = (err) => {
    const body = {
      status: 'error',
      message: err.message,
      data: { stack: err?.stack },
    }

    self.config.contentType = 'application/json'
    self.config.statusCode = err.statusCode || '403'
    self.config.statusMessage = 'Forbidden'

    if (err instanceof ApplicationError) {
      self.config.statusCode = err.statusCode
      self.config.statusMessage = err.statusMessage
      body.data.extras = err.extras
    }

    self.config.body = JSON.stringify(body)
    return self
  }

  self.json = (data = {}) => {
    self.config.body = JSON.stringify({
      status: 'ok',
      message: null,
      data,
    })

    self.config.contentType = 'application/json'
    return self
  }

  self.toString = () => {
    const body = self.config.body.toString()
    const length = Buffer.from(body).length

    return ([
      `HTTP/1.1 ${self.config.statusCode} ${self.config.statusMessage}`,
      `Content-Type: ${self.config.contentType}`,
      `Content-Length: ${length}`,
      'Connection: close',
      'Access-Control-Allow-Origin: *',
      '',
      body,
    ].join(LINE_BREAK))
  }
}

const server = netPkg.createServer((socket) => {
  socket.on('data', (chunk) => {
    const reqt = new HttpRequest(chunk.toString())

    try {
      const resp = new HttpResponse()
      socket.write(app(reqt, resp).toString())
    } catch (e) {
      const resp = new HttpResponse()
      resp.error(e)
      socket.write(resp.toString())
    }

  })
})

server.listen(80, () => console.log('listening'))
