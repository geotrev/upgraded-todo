import {
  UpgradedElement,
  register,
} from "upgraded-element/lib/upgraded-element.es.js"
import styles from "./styles.scss"

class TodoActionButton extends UpgradedElement {
  static get styles() {
    return styles
  }

  renderIcon() {
    const icon = this.getAttribute("icon")
    if (!icon) return ""

    return `
      <span aria-hidden="true" class="todo-action-button--icon">${icon}</span>
    `
  }

  render() {
    const size = this.getAttribute("size") || "md"

    return `
      <button class="todo-action-button ${size}">
        ${this.renderIcon()}
        <span class="todo-action-button--text">
          <slot></slot>
        </span>
      </button>
    `
  }
}

register("todo-action-button", TodoActionButton)
