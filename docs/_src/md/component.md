

# ReBars Components

Components are where everything happens. Each component has it's own `Handlebars.instance` so their helpers are isolated from other components/applications.


```javascript
export default {
  template: /*html*/ `<div></div>`, // your Handlebars template
  name: "myComponent", // must have a name
  data() { return {} }, // data for your template
  methods: {}, // event handlers
  hooks: {}, // lifecycle hooks
  watchers: {}, // methods to fire on change of data
  helpers: {} // Handlebars helpers just for this component
}
```

## Template
The template is the Handlebars template that will be rendered. What is defined as the return from your `data()` function will be the root scope of the template when rendering.

## Name
Each component must define a name. This is is the string you will use to render components using the [component](#the-component-helper) helper within your template.

## Data
The data for the component. Must be a function that returns an Object.

```javascript
data() {
  return {
    name: {
      first: "David",
      last: "Morrow"
    }
  }
}
```

> It is also possible to return a function as a key in your data. This can be very useful.

```javascript
data() {
  return {
    fullName() {
      return `${this.name.first}, ${this.name.last}`;
    },
    name: {
      first: "David",
      last: "Morrow"
    }
  }
}
```
```html
<p>{{ fullName }}</p>
```

## Methods
Methods defined in a component are available for use with the [method](#the-method-helper) helper, or can be called from within another method.

```html
<button {{ method "save:click" "fred" }}>save</button>
```

```javascript
methods: {
  save(event, name) {
    // this.$methods
    // this.$refs()
    // this.$props
  }
}
```

> Methods can reference other methods.

```javascript
methods: {
  findFriend(name) {
    this.friends.find(friend => friend.name === name);
  },
  save(event, name) {
    const friend = this.$methods.findFriend(name);
    // save your friend
  }
}
```

## Refs

ReBars keeps track of any element with a `ref=""` tag on it. This gives you the ability to save a reference to an element. This also gives a key for Array loop items so that the Array can be patched instead of re-rendered entirely.

> The ref tag is also needed on any input or other elements that need focused restored after a re-render. It is also needed to prevent a full re-render of an Array if watching an Array. See [the bound helper](#the-bound-helper) and [the watch helper](#the-watch-helper)

```html
<div>
  <h1 ref="header">Header</h1>
</div>
```

inside of a method, you can reference any ref by using the `$refs()` function from a method in your component.

```javascript
methods: {
  save() {
    this.$refs().header;
    // returns the <h1> element
  }
}
```

If there are more than one element with the same ref, they will be returned as an Array.

```html
<ul>
  <li {{ ref "listItem" }}>item one</li>
  <li {{ ref "listItem" }}>item one</li>
</ul>
```

```javascript
methods: {
  save() {
    this.$refs().listItem
    // return [li, li]
  }
}
```

## Watchers

Watchers give you the ability to call a function when a property in your data has change. You can watch any items in  your data or `$props`

> You cannot, however watch a method in your data. Methods defined in your data are only for convenience for your template rendering.

```javascript
data() {
  return {
    name: {
      first: "David"
    }
  };
},

watchers: {
  "name.first"() {
    console.log(this.name.first); // David
    // this.$refs()
    // this.$methods
    // this.$props
  }
}
```

Each time `name.first` is changed the method will be triggered with the same context you would have in a method.

## Hooks

Hooks are triggered at different points in the component instance's life.

- `created` triggered when the component is instantiated and prior to rendering
- `attached` the component has been rendered and added to the DOM
- `detached` the component is no longer on the DOM and is being garbage collected

> `this.$refs()` cannot be used in the created hook. The component is not yet on the DOM. If you need to do something with the component's `$refs` or DOM. Use the attached hook instead.


```javascript
data() {
  return {
    name: {
      first: "David"
    }
  }
},

hooks: {
  created() {
    // you can set items here pre-render
    this.name.first = "Mike";
  }
}
```

## Helpers

Any methods you define under Handlebars helpers methods you define in `helpers` will be automatically added to the instance rendering the component, and be available for use. ReBars includes several [helpers](helpers.html) as well.

```html
<input type="checkbox" {{ isChecked someBoolean }} />
```
```javascript
helpers: {
  isChecked: val => (val ? "checked" : ""),
}
```

These helpers are only available for the context of the component you are defining. If you would like to define helpers that are global. Add them to the [ReBars application](#a-rebars-application).
