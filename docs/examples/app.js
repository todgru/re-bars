export default {
  template: /*html*/ `
  <div>
    <div class="header-container">
      <h1>
        {{#watch header }}
          <span>{{ header.title }}</span>
          <small>{{ header.description }}</small>
        {{/watch}}
      </h1>

      <label>
        Title:
        <input type="text" {{ bound "header.title" }}/>
      </label>

      <label>
        Description:
        <input type="text" {{ bound "header.description" }}/>
      </label>
    </div>

    <ul class="simple">
      {{#watch "todos.*" }}
        {{#each todos }}
          <li ref="{{ id }}">
            <div class="todo">
              <label>
                <input type="checkbox" {{ isChecked done }} {{ method "toggleDone" id }} />
                {{#if done }}
                  <s>{{ name }}</s>
                {{else}}
                  <strong>{{ name }}</strong>
                {{/if}}
              </label>

              <div class="actions">
                <button {{ method "deleteTodo" id }}>delete</button>
              </div>
            </div>
          </li>
        {{/each}}
      {{/watch}}
    </ul>

    {{#watch "adding" }}
      {{#if adding }}
        <form>
          <input type="text" name="name" ref="newName" placeholder="the new todo" />
          <button class="push" {{ method "addItem" }}>Add todo</button>
          <button class="cancel" {{ method "toggleCreate" }}>Cancel</button>
        </form>
      {{else}}
        <button class="add" {{ method "toggleCreate" }}>Add another</button>
      {{/if}}
    {{/watch}}
  </div>
  `,

  data() {
    return {
      adding: false,
      header: {
        title: "Todos",
        description: "some things that need done",
      },
      todos: [
        {
          done: false,
          name: "Grocery Shopping",
          id: 22,
        },
        {
          done: true,
          name: "Paint the House",
          id: 44,
        },
      ],
    };
  },

  name: "DemoApp",

  helpers: {
    isChecked: val => (val ? "checked" : ""),
  },

  hooks: {
    attached() {
      console.log(this, "attached");
    },

    created() {
      console.log(this, "created");
    },
  },

  methods: {
    addItem(event) {
      event.preventDefault();
      const $input = this.$refs().newName;

      this.todos.push({
        id: new Date().getTime(),
        name: $input.value,
      });

      $input.value = "";
    },

    deleteTodo(event, id) {
      const index = this.todos.findIndex(todo => todo.id === id);
      this.todos.splice(index, 1);
    },

    toggleDone(event, id) {
      const todo = this.todos.find(todo => todo.id === id);
      todo.done = !todo.done;
    },

    toggleCreate(event) {
      event.preventDefault();
      this.adding = !this.adding;
    },
  },
};
