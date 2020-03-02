export default {
  template: /*html*/ `
  <div>
    {{#watch "isAdding" }}
      {{#if isAdding }}
        <form>
          {{#watch "newTodo.name" }}
            <h1>{{ newTodo.name }}</h1>
          {{/watch}}

          {{#watch "newTodo.id" }}
            <input type="text" name="name" value="{{ newTodo.name }}" {{ bind "newTodo.name" }} placeholder="the new todo" />
          {{/watch}}

          <button class="push" {{ method "addItem" }}>Add todo</button>
          <button class="cancel" {{ method "toggleAdd" }}>Cancel</button>
        </form>
      {{ else }}
        <button class="add" {{ method "toggleAdd" }}>Add another</button>
      {{/if}}
    {{/watch}}
  </div>
  `,

  name: "AddComponent",

  data: {
    isAdding: false,
    newTodo: {
      name: "",
      id: null,
    },
  },

  methods: {
    toggleAdd({ data }, event) {
      event.preventDefault();
      data.isAdding = !data.isAdding;
    },

    addItem({ data }, event) {
      event.preventDefault();
      data.newTodo.id = new Date().getTime();
      data.todos.push({ ...data.newTodo });

      data.newTodo.name = "";
      data.newTodo.id = null;
    },
  },
};
