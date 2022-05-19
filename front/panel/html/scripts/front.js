
class nElement {
  container = document.createElement('span')
  element = document.createElement('span')

  constructor(options = {}) {
    this.container = document.createElement(options?.container?.tagName || 'div')
    this.element = document.createElement(options?.element?.tagName || 'div')

    this.container.classList.add('container')
    this.element.classList.add('element')

    const name = options?.component?.name || 'no-name'
    this.container.classList.add(`ct-${name}`)
    this.element.classList.add(`el-${name}`)

    this.style('margin-bottom', '0.5rem')
  }

  static fromId(id = '') {
    const self = new nElement()
    const element = document.getElementById(id)
    self.setElement(element)
    return self
  }

  setElement(element) {
    const self = this
    self.element = element
    return self
  }

  setText(text = '') {
    const self = this
    self.element.innerText = text
    return self
  }

  setHTML(html = '') {
    const self = this
    self.element.innerHTML = html
    return self
  }

  style(name, value = '') {
    const self = this
    self.element.style[name] = value
    return self
  }

  attr(name, value) {
    const self = this
    self.element[name] = value
    return self
  }

  event(name, func) {
    const self = this
    self.element.addEventListener(name, func)
    return self
  }

  append(nelement = new nElement) {
    const self = this
    self.element.append(nelement.render())
    return self
  }

  prepend(nelement = new nElement) {
    const self = this
    self.element.prepend(nelement.render())
    return self
  }

  render() {
    const self = this
    self.container.childNodes.forEach(child => child.remove())
    self.container.append(self.element)
    return self.container
  }


  styleContainer(name, value = '') {
    const self = this
    self.container.style[name] = value
    return this.component
  }

  attrContainer(name, value) {
    const self = this
    self.container[name] = value
    return this.component
  }

  eventContainer(name, func) {
    const self = this
    self.container.addEventListener(name, func)
    return this.component
  }

  appendContainer(nelement = new nElement) {
    const self = this
    self.container.append(nelement.render())
    return this.component
  }

  prependContainer(nelement = new nElement) {
    const self = this
    self.container.prepend(nelement.render())
    return this.component
  }
}

class nText extends nElement {
  constructor() {
    super({ component: { name: 'text' } })
  }
}

class nH1 extends nText {
  constructor() {
    super({ component: { name: 'h1' } })
    this.style('font-size', '2.5rem')
  }
}

class nH2 extends nText {
  constructor() {
    super({ component: { name: 'h1' } })
    this.style('font-size', '2rem')
  }
}

class nH3 extends nText {
  constructor() {
    super({ component: { name: 'h1' } })
    this.style('font-size', '1.5rem')
  }
}

class nTextInput extends nElement {

  label = new nText
  error = (new nText()).style('color', 'red')

  constructor() {
    super({ component: { name: 'text-input' }, element: { tagName: 'input' } })

    this.attr('type', 'text')

    this.style('width', '100%')
    this.style('border', 'none')
    this.style('outline', 'none')
    this.style('font', 'inherit')
    this.style('padding', '0.5rem')
    this.style('display', 'inline-block')
    this.style('box-sizing', 'border-box')

  }

  getValue(def = null) {
    const self = this
    return self.element.value || def
  }
}

class nButton extends nElement {
  constructor() {
    super({ component: { name: 'button' }, element: { tagName: 'button' } })

    this.style('width', '100%')
    this.style('border', 'none')
    this.style('font', 'inherit')
    this.style('padding', '0.5rem')
    this.style('display', 'inline-block')
    this.style('background-color', '#cbcbcb')
  }

}

class nLink extends nElement {
  constructor() {
    super({ component: { name: 'link' }, element: { tagName: 'a' } })

    this.style('text-decoration', 'none')
    this.style('display', 'inline-block')
    this.style('width', '100%')
  }

  href(url = '') {
    const self = this
    self.element.href = url
    return self
  }
}

class nTextInputPlus extends nElement {
  label = new nText()
  input = new nTextInput()
  error = new nText()

  constructor() {
    super({ component: { name: 'text-input-plus' } })

    const self = this

    self.append(self.label)

    self.input.event('keyup', () => self.error.setText(''))
    self.append(self.input)

    self.error.style('color', 'red')
    self.append(self.error)
  }
}

class nCenterForm extends nElement {
  title = new nH1()
  form = new nElement()
  button = new nButton()
  link = new nLink()

  constructor() {
    super({ component: { name: 'center-form' } })

    const self = this

    self.style('background-color', '#ededed')
    self.style('margin', '0 auto')
    self.style('padding', '1rem')
    self.style('padding', '1rem')
    self.style('width', '360px')

    self.title.style('text-align', 'center')
    self.append(self.title)

    self.append(self.form)

    self.append(self.button)

    self.link.style('text-align', 'center')
    self.append(self.link)
  }
}

