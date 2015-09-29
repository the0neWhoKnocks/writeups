# Code Grammar

I work in a large corparate environment with a lot of moving parts. During my
years there I've come up with a workflow when dealing with JS & CSS that allows
for quick iteration, and symantic naming which allows for quick spin up time for 
new devs and a fundamental understanding of what's going on in the codebase.

---

## Markup

Everything stems from the markup, so we'll start with that. You can write all
your markup in straight HTML, but using a templating system makes thing much
easier to manage and update in the future. For this example I'll be using
Handlebars for our templating engine.

In this section I'll be referring to excerpts from [ExampleTemplate.hbs](view/ExampleTemplate.hbs)

You'll notice for things like `{{#each` or `{{#if` helpers I keep them at the
same spacing as their parent. I've found this to be easier to visually consume
since a child node has the same indentation that it normally would.

```
<ul class="{{cssPrefix}}__nav-list">
{{#each navURLs}}
  <li class="{{../cssPrefix}}__nav-item"><a href="{{url}}">{{label}}</a></li>
{{/each}}
</ul>
```

For nodes with attributes containing a lot of data, it's best to drop the attributes
down to their own line for easier reading/editing.

```
<a 
  class="{{../cssClassPrefix}}nav-item {{../cssModifierPrefix}}is-logout {{../jsPrefix}}NavItem {{../jsPrefix}}LogOutItem" 
  href="{{user.logoutURL}}"
>{{user.logoutLabel}}</a>
```

To [prevent white-space issues](https://css-tricks.com/fighting-the-space-between-inline-block-elements/)
it's best to keep the end of the start node on the same line as the beginning of 
the content. This wasn't an issue in html4, but in html5 if you have an item 
display as `inline-block` you may find leading or trailing space before or after 
an element.

```
>{{user.logoutLabel}}</a>
```

---

## Styling

I've found a modified BEM syntax works well for our environment. The modification
in our case is keeping the Element & Modifiers separate. Using this style removes
a majority of specificity and gives developers confidence that they're not going
to inadvertently alter other components on the page when editing CSS.

My preferred pre-processor is [Stylus](https://learnboost.github.io/stylus/), but
we use SCSS at my job. So you can reference [this file](css/ExampleClass.scss) 
for the below examples.

Setting up a file in the manor I've done takes a little extra thought, but as
everything in this dock, it's about maintainability. All styling classes are
built out dynamically. There was an argument that it made it harder to find a 
specific class such as `.namespace__some-element` because it's actually broken
out into something like below.

```
#{$namespace} {
  
  &__some-element {
    color: blue;
  }
}
```

In fact it makes it easier because we shouldn't be sharing any CSS namespaces.
Basically before creating a new component you'd do a search for 
`$namespace: '.element-class'`. If it's already being used by another file, you'd
want to choose another name. Having this convention in place means we'd be able
to drop any component on a page and not have to worry that it'll conflict with
any existing styling. Also, you may find that someone has already created what
you may be trying to achieve.

You'll also notice from the example above, the blank newline after the namespace.

```
#{$namespace} {
  
  &__some-element {
```

There should always be a blank line before a nested rule, even if the parent
rule doesn't have any styling assigned. So if there was styling assigned to the
parent element, the above styling would look like this.

```
#{$namespace} {
  color: #00FF00;
  
  &__some-element {
```

Modifiers are used to describe an experience state of an element. Modifiers are
the only thing JS should be adding or removing during a user session. So classes,
anything following this syntax `.namespace__element` are for base styling. And
anything following this syntax `.namespace--some-description` are a modifier
describing a modified state of an element.

For modifiers it's best to use at least a two word descriptor. Something along
the lines of `.namespace--is-hidden` or `.namespace--has-children`. The only purpose
`.namespace` serves in this case is to ensure that it doesn't conflict with another
modifier from another component.

---

## Interactions

For javascript, [the example I've included](js/ExampleClass.js) uses ES6, but 
can easily be translated to the ES5 prototypical Class pattern.

A handy trick when dealing with Events in JS (when utilizing jQuery) is to
namespace your events. This allows for easier debugging of what's bound on an
element, and you can more confidently kill all of your events on an element
without worrying about breaking any other experiences added by someone else. If
you're not using jQuery, you'll have to be more diligent in the manor in which
you remove listeners from an element.

**jQuery**

```
// add listeners
$('.js-someElement').on(this.events.CLICK, function(ev){});

// remove specific listener
$('.js-someElement').off(this.events.CLICK);
// remove all plugin listeners
$('.js-someElement').off(this.eventSuffix);
```

**vanilla**

```
// add listeners
var func = function(ev){};
var els = document.querySelectorAll('.js-someElement');
for(var i=0; i<els.length; i++){
  el[0].addEventListener('click', func);
}

// remove listener
for(var i=0; i<els.length; i++){
  el[0].removeEventListener('click', func);
}
```

---

## Testing


