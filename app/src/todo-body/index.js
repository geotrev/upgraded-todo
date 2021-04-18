import debounce from "lodash/debounce"
import "../shared/todo-action-button"
import {
  UpgradedElement,
  register,
} from "upgraded-element/lib/upgraded-element.es.js"
import * as actionTypes from "../todo-action-types"
import { dispatch, store } from "../store"
import styles from "./styles.scss"

class TodoBody extends UpgradedElement {
  static get properties() {
    return {
      store: {
        default: store.getState(),
        type: "object",
      },
    }
  }

  static get styles() {
    return styles
  }

  constructor() {
    super()

    this.storeUpdated = this.storeUpdated.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.addTodoEvents = this.addTodoEvents.bind(this)
    this.debounceInput = debounce(this.handleInput, 500)
  }

  elementDidMount() {
    store.subscribe(this, this.storeUpdated)
    this.registerTodos()
  }

  elementDidUpdate() {
    const newTodo = this.store.todos[0]

    if (newTodo && newTodo.draft) {
      this.addTodoEvents(this.shadowRoot.querySelector(".todo"))
    }
  }

  registerTodos() {
    const todos = this.shadowRoot.querySelectorAll(".todo")
    todos.forEach(this.addTodoEvents)
  }

  addTodoEvents(todoElement) {
    const deleteBtn = todoElement.querySelector("todo-action-button")
    const input = todoElement.querySelector(".todo--input")
    deleteBtn.addEventListener("click", this.handleDelete)
    input.addEventListener("input", this.debounceInput)
  }

  handleDelete(event) {
    const todoElement = event.target.parentElement

    const deleteBtn = todoElement.querySelector("todo-action-button")
    deleteBtn.removeEventListener("click", this.handleDelete)
    const input = todoElement.querySelector(".todo--input")
    input.removeEventListener("input", this.debounceInput)

    dispatch(this, actionTypes.DELETE_TODO, {
      id: event.target.parentElement.id,
    })
  }

  handleInput(event) {
    dispatch(this, actionTypes.SAVE_TODO, {
      id: event.path[0].parentElement.id,
      value: event.path[0].textContent,
    })
  }

  storeUpdated(state) {
    this.store = state
  }

  renderTodos() {
    if (!this.store.todos.length) {
      return `
        <p>You're done! Rejoice! :)<br/><br/>Or... create more todos!</p>
      `
    }

    return this.store.todos.reduce((todos, todo) => {
      todos += `
        <div class="todo" data-key='${todo.id}' id='${todo.id}'>
          <div class="todo--input" contenteditable="true"></div>
          <todo-action-button icon="–">Delete</todo-action-button>
        </div>
      `
      return todos
    }, "")
  }

  render() {
    return `
      <main class="todo-body">
        ${this.renderTodos()}
      </main>
    `
  }
}

register("todo-body", TodoBody)
