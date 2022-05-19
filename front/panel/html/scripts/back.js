
const OBJECT_TYPES = {
  VALIDATION: 'validation',
  RESPONSE_SUCCESS: 'response-success',
  RESPONSE_ERROR: 'response-error',
}

const Validations = {
  required: (errorMessage = 'Informação inválida.') => (value) => value ? null : errorMessage,
  phone: (errorMessage = 'O texto não tem formato de telefone.') => {
    return (value) => {
      const valid = true // FIXME: validar padrao para numeros de telefone
      return !valid
        ? errorMessage
        : null
    }
  },
  email: (errorMessage = 'O texto não tem formato de e-mail.') => {
    return (value) => {
      const valid = true // FIXME: validar padrao para enderecos de e-mail
      return !valid
        ? errorMessage
        : null
    }
  },
  phoneOrEmail: (errorMessage = 'O texto não tem formato de telefone ou e-mail.') => {
    return (value) => {
      const email = Validations.email()(value)
      const phone = Validations.phone()(value)

      return (email || phone)
        ? errorMessage
        : null
    }
  }
}

const Validator = {
  response: function (errors = {}) {
    const self = this

    self.type = OBJECT_TYPES.VALIDATION

    self.toJSON = () => errors

    self.get = (name) => {
      const json = self.toJSON()
      return json[name] || null
    }
  },
  with: (params = {}) => ({
    validate: (fields) => new Promise((resolve, reject) => {
      const errors = {}

      Object.keys(fields)
        .map((field_key) => {
          const param = params[field_key]
          const validations = fields[field_key]
          const error = validations?.map((validation) => validation(param)).find(error => error)

          if (error) errors[field_key] = error
        })

      if (Object.keys(errors).length > 0) reject(new Validator.response(errors))
      else resolve()
    })
  })
}

const Ajax = {}

Ajax.BASE_URL = '/api/v1'

Ajax.responseSuccess = function (responseText) {
  const self = this

  self.type = OBJECT_TYPES.RESPONSE_SUCCESS

  self.toJSON = () => JSON.parse(responseText)
}

Ajax.responseError = function (responseText) {
  const self = this

  self.type = OBJECT_TYPES.RESPONSE_ERROR

  self.toJSON = () => JSON.parse(responseText)

  self.getMessage = () => {
    const json = self.toJSON()
    return json['message'] || 'Server error'
  }
}

Ajax.post = (paths, data = {}) => new Promise((resolve, reject) => {
  const url = [Ajax.BASE_URL, ...paths].join('/')

  const xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)

  xhr.onload = () => resolve(new Ajax.responseSuccess(xhr.responseText))
  xhr.onerror = () => reject(new Ajax.responseError(xhr.responseText))

  const fd = new FormData()
  Object.keys(data).map((prop) => fd.append(prop, data[prop]))
  xhr.send(fd)
})

const Api = {}

Api.login = ({ id }) =>
  Validator.with({ id })
    .validate({
      id: [Validations.phoneOrEmail()]
    })
    .then(() => Ajax.post(['users', 'login'], { id }))

Api.usersRegister = ({ name, document, phone, email }) =>
  Validator.with({ name, document, phone, email })
    .validate({
      name: [Validations.required()],
      phone: [Validations.phone()],
      email: [Validations.email()],
      document: [Validations.required()],
    })
    .then(() => Ajax.post(['users', 'register'], { name, document, phone, email }))
