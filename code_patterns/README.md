# Code Grammar

I work in a large corparate environment with a lot of moving parts. During my
years there I've come up with a workflow when dealing with JS & CSS that allows
for quick iteration, and semantic naming which allows for quick spin up time for 
new devs and a fundamental understanding of what's going on in the codebase.

---

## Markup (HTML)

Everything stems from the markup, so we'll start with that. You can write all
your markup in straight HTML, but using a templating system makes thing much
easier to manage and update in the future. For this example I'll be using
Handlebars for our templating engine.

In this section I'll be referring to excerpts from [ExampleTemplate.hbs](view/ExampleTemplate.hbs)

You'll notice for things like `{{#each` or `{{#if` helpers I keep them at the
same spacing as their parent. I've found this to be easier to visually consume
since a child node has the same indentation that it normally would.

Note that in the snippets below, these are the the values of the referenced
props from [ExampleClass.js](js/ExampleClass.js).

```
jsPrefix = 'js-exampleClass'
cssClassPrefix = 'example-class__'
cssModifierPrefix = 'example-class--'
```

```handlebars
<ul class="{{cssClassPrefix}}__nav-list">
{{#each navURLs}}
  <li class="{{../cssClassPrefix}}__nav-item"><a href="{{url}}">{{label}}</a></li>
{{/each}}
</ul>
```

For nodes with attributes containing a lot of data, it's best to drop the attributes
down to their own line for easier reading/editing.

```handlebars
<a 
  class="{{../cssClassPrefix}}nav-item {{../cssModifierPrefix}}is--logout {{../jsPrefix}}NavItem {{../jsPrefix}}LogOutItem" 
  href="{{user.logoutURL}}"
>{{user.logoutLabel}}</a>
```

To [prevent white-space issues](https://css-tricks.com/fighting-the-space-between-inline-block-elements/)
it's best to keep the end of the start node on the same line as the beginning of 
the content. This wasn't an issue in html4, but in html5 if you have an item 
display as `inline-block` you may find leading or trailing space before or after 
an element.

```handlebars
>{{user.logoutLabel}}</a>
```

Referencing the anchor markup above, you'll see we have a separation of style 
and interaction in the form of a CSS prefixed class and a JS prefixed class.
This does a couple things for us. One, it allows us to change the CSS class
name if a refactor is required without the added worry of breaking any JS
interactions. And two, it tells us that the DOM node is being utilized by JS 
for some sort of interaction. There is no need to add a JS class to a node 
unlesss it's being used by JS, just like there's no need to add a CSS class 
to a node unless it's being styled.

Another thing to note is the naming convention of the CSS & JS classes.

**CSS**

Utilizes a modified BEM sytax. `namespace` is the component name so
something like `chat-module`. `name-of-class` would be the current element,
something like `cta-btn`. Combined they'd be `chat-module__cta-btn`. Ideally
you'll only have one level per class. A level is defined by the two underscores.

For modifiers (classes that describe the state of an element), the format would
be `verb--adjective` or `namespace--verb--adjective` (depending on whether or 
not you have global modifiers setup that you don't want to conflict with). Some
examples would be `is--hidden`, `has--error`, or `was--successful`.

**JS**

The class will be prefixed by `js-` and words will be treated like a JS variable 
to further set it apart from a class utilized for styling `js-namespaceNameOfClass`.
Using the class from the CSS example above, it's JS equivalent would be
`js-chatModuleCtaBtn`.

---

## Styling (CSS)

I've found a modified BEM syntax works well for our environment. The modification
in our case is keeping the Element & Modifiers separate. Using this style removes
a majority of specificity and gives developers confidence that they're not going
to inadvertently alter other components on the page when editing CSS.

My preferred pre-processor is [Stylus](https://learnboost.github.io/stylus/), but
we use [SCSS](http://sass-lang.com/) at my job. So you can reference [this file](css/ExampleClass.scss) 
for the below examples.

Setting up a file in the manor I've done takes a little extra thought, but as
everything in this dock, it's about maintainability. All styling classes are
built out dynamically. There was an argument that it made it harder to find a 
specific class such as `.namespace__some-element` because it's actually broken
out into something like below.

```scss
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

```scss
#{$namespace} {
  
  &__some-element {
```

There should always be a blank line before a nested rule, even if the parent
rule doesn't have any styling assigned. So if there was styling assigned to the
parent element, the above styling would look like this.

```scss
#{$namespace} {
  color: #00FF00;
  
  &__some-element {
```

Modifiers are used to describe the state of an element. Modifiers are the only 
thing JS should be adding or removing during a user session. So classes,
anything following this syntax `.namespace__element` are for base styling. 
Anything following this syntax `.namespace--verb--adjective` are a modifier
describing the state of an element.

For modifiers it's best to use at least a two word descriptor. Something along
the lines of `.namespace--is--hidden` or `.namespace--has--no-children`. The only 
purpose `.namespace` serves in this case is to ensure that it doesn't conflict 
with another modifier from another component. Take note that the adjective only
uses one hyphen for word separation.

---

## Interactions (Javascript)

For javascript, [the example I've included](js/ExampleClass.js) uses ES6, but 
can easily be translated to the ES5 prototypical Class pattern. You'll see in
the example that jQuery is utilized for DOM manipulation. Vanilla JS can be
used to achieve a majority of what I cover. If it can't I'll show how it
should be handled with a jQuery/vanilla comparison.

Going forward whenever I refer to `module` it'll be synonymous with
Class, plugin, component, or widget.


#### Extensibility

When creating a module you'll want to make sure it's extensible and it's easy
for a dev to override properties or methods. I can't count how many times I've
tried to implmement a module and there's been an inaccesible property or
method that bascially causes us to deviate from the base code just to get an
experience to work, which in turn leads to code disparity.

In the code example you'll see the module allows for an `opts` (or options)
argument. All default module properties are set, and then overridden by the
`opts` via `Object.assign(this, opts);`. `Object.assign` is new to ES6,
you can use a recursive loop, jQuery's `extend`, or lodashes `merge` to
accomplish the same result.

#### Semantics

Make you're code easy to understand with semantic method and variable names. For
example, if you have a function that starts a countdown.

```javascript
function startCountDown(){
```

Or if you have a variable that stores a user's score.

```javascript
var userScore = 0;
```

Seems like real simple stuff but I still come across things like

```javascript
var uS = 0;

// or

function sCD(){
```

without comments or any info about what the variable or function does, which of
course does nothing to help a dev understand what's going on at a cursory glance,
which in turn leads to wasted time for a dev.

Another good habit to get into is to prefix your handlers with `handle` so a dev
knows that a function is wired up to an event.

```javascript
function handleCtaClick(ev){}
...
$('.el').on('click', handleCtaClick);

// or

function handleUserLogin(resp){}
...
$.ajax({
  ...
  success: handleUserLogin
});
```

#### Logic

This is a point of contention in some circles. Simply put, to write logic, use
logic. Matches can start a fire that cooks your dinner, or they can burn a
house down, think and be responsible.

**Ternary**

Use a ternary when you need to set one value based on some logic. If multiple
values need to be set or functions need to be called, use an `if`.

```javascript
// Good (one level deep)
var loggedIn = (user) ? true : false;
// or (wrap lines if value is lengthy)
var currVal = (val2)
  ? Math.round(Math.abs(val) - Math.abs(val2))
  : val;

// Bad (don't nest)
var currVal = (val2 && ((fu) ? bar : ((val && val2) ? bar : fu)))
  ? Math.round(Math.abs(val) - Math.abs(val2))
  : val;
```

**Switch**

Use a `switch` when you're checking one prop for one value, it's cleaner and
processes faster.

```javascript
// Good
switch(country){
  case 'US' :
    currency = 'USD';
    break;
  
  case 'GB' :
    currency = 'GBP';
    break;
}

// Bad
if( country === 'US' ){
  currency = 'USD';
}else if( country === 'GB' ){
  currency = 'GBP';
}
```


#### Documentation

There's no hard rule as to when you should document your code, but I'll give you 
an example of my flow. When creating a new function I'd come up with a semantic 
name for it, and then outline what I want the function to do with inner comments.

```javascript
function makeHamburger(order){
  // place bun on plate
  
  // add ingredients
  
  // put a bird on it
}
```

After you've fleshed out the inner workings of your new method, and things
are working as expected, I'd then go and add the method [documentation](http://usejsdoc.org/).
I do this at the end of the flow since things will get changed as you're
figuring things out, and you don't want to spend extra time re-writing
your docs.

```javascript
/**
 * This method makes a hamburger. I'm obviously hungry while writing this.
 *
 * @param {Object} baseOrder - The basic stuff like type of bun, cook of the burger, etc.
 * @param {Array} extras - Extra ingredients you want added.
 */
function makeHamburger(baseOrder, extras){
  var burgerFixins = '';
  var i;
  
  // add the basics
  for( i in baseOrder ){
    if( baseOrder.hasOwnProperty(i) ){
      if( baseOrder[i] ){
        burgerFixins += i +'|';
      }
    }
  }
  
  // add ingredients
  for( i=0; i<extras.length; i++ ){
    burgerFixins += extras[i] +'|';
  }
  
  // add bun
  return 'top bun|'+ burgerFixins +'btm bun';
}
```

I find a separation of code easier to visually parse. By that I mean, 
vars (newline), logic (newline), & functions (in that order). The comments in
the below example are just for the example and are not required.

Vars with defined values should be at the top on their own line and undefined 
vars should be at the bottom and can be placed on one line.

First off I subscribe to space in the `if` parenthesis rather than outside. The
reason for that is because this `if( fu(bar()) ){` is easier to read and
less error prone than this `if (fu(bar())) {`. There are multiple ways to write 
`if` statements, and the reasons as to why are called out below. 

```javascript
// == vars ==========================

var fu = opts.fu || 'bar';
var bar = opts.bar || 'fu';
var boom = opts.boom || 'splat';
var num, num2, num3;

// == logic =========================

// No braces required because only one thing occurs.
if( fu === '' ) fu = bar;
// Braces required because multiple commands are run.
if( !bar ){
  errorCallback();
  return false;
}
// New line for each logical check for readability.
if(
  !firstCheck()
  && !someCheck()
  && (!anotherCheck() || followingCheck())
){
  errorCallback();
  return false;
}

// == functionality =================

successCallback();
```


#### Events

A handy trick while dealing with Events (when utilizing jQuery) is to 
namespace them. This allows for easier debugging of what's bound on an
element, and you can more confidently kill all of your events on an element
without worrying about breaking any other experiences added by someone else. If
you're not using jQuery, you'll have to be more diligent in the manner in which
you remove listeners from an element.

**jQuery**

```javascript
// add listeners
var $els = $('.js-someElement');
$els.on(this.events.CLICK, function(ev){});

// remove specific listener
$els.off(this.events.CLICK);
// remove all plugin listeners
$els.off(this.eventSuffix);
```

**vanilla**

```javascript
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


#### Dynamic Variables

You'll see a chunk of code in the example file containing this code.

```javascript
this.namespace = 'exampleClass';

this.jsPrefix = '.js-'+ this.namespace;

this.cssClassPrefix = 'example-class__';

this.cssModifierPrefix = 'example-class--';

this.eventSuffix = '.'+ this.namespace;
```

What does something like this give us? There have been times in the
past where myself & others have made the simple mistake of not adding
a `.` for JS selectors, or adding a `.` for CSS classes and waisting
time trying to figure out why an experience isn't functioning as expected.
Setting up prefixes & suffixes allows us to then do something like this.

```javascript
this.selectors = {
  NAV_ITEM: this.jsPrefix +'NavItem',
};

this.cssModifiers = {
  IS_HIDDEN: this.cssModifierPrefix +'is--hidden',
};

this.events = {
  CLICK: 'click'+ this.eventSuffix
};

this.els = {
  $navItems: $(this.selectors.NAV_ITEM)
};
```

There are a few key take-aways from the code snippet above.

**Name Propagation** - Lets say a refactor occurs and you change a piece
of markup to something different. For example the `nav-item`'s become `ui-item`'s.
The markup would then look like this after the refactor.

```handlebars
<a class="{{../cssClassPrefix}}ui-item {{../jsPrefix}}UIItem" href="{{url}}">{{label}}</a>
```

The CSS would change to this

```scss
&__ui {
  ...
  
  &-item
```

And the JS would change to this

```javascript
this.selectors = {
  UI_ITEM: this.jsPrefix +'UIItem',
};

this.els = {
  $uiItems: $(this.selectors.UI_ITEM)
};

// You'd also want to do a search and replace for `els.$navItems`
```

The argument could be made "well I could just do a search and
replace in all the files for the class I updated", and you'd
be correct. The power in this schema is the knowledge of where
items are that need to be updated a limitation on possible typos
leading to bugs. There have been times in the past where people have 
done some fairly tricky things with selectors, and after a refactor 
those tricky selectors weren't updated and bugs arose. There's no real 
extra thought required with this schema, the dev will know they'll have 
to update it once in CSS, once in the template, a couple places in JS, 
and a few areas in any tests.

You may be asking, "where's the propagation in Name Propagation?". In
the example above I mentioned updating the JS selector property name.
So from `NAV_ITEM` to `UI_ITEM`. You don't actually have to change the
constants name (it's more consistent if you do), but you could simply change
it to `NAV_ITEM: this.jsPrefix +'UIItem'` and everything else will continue
to function as expected.


**Property Casing**

I've seen a variation of casing when it comes to variables so here's a simple 
question to ask yourself when naming something.

> "Is the content of my variable going to change?"

If not then use all caps cuz that variable is a constant. Otherwise, it's JS,
and in JS we camelcase the variable. Also, you could make the argument that
`this.selectors` should be `this.SELECTORS`. I try to keep it simple when it 
comes to constants, basically a constant is a variable with one unchanging value. 
So since `selectors` contains multiple values I keep it in lowercase, and the 
same would apply to Arrays.

When it comes to the naming & casing of props in `els`, the leading `$` is used
to denote that it's a jQuery element, and the variable name is camelcase because
jQuery Objects are inherently dynamic.


---


## Template Helpers

A pattern I follow when it comes to block helpers is to set data attributes when 
adding data to a context. This helps a developer know right away that the 
property in question was added via a helper and not possibly through a service 
or backend processing. An example of that can be seen in [helpers.js](js/helpers.js)

Then in your template you'd reference the custom attribute like so

```
<div data-build-for="{{@customProp}}"
```

The `@` symbol being the key difference here.


---


## Testing


#### General Rules

When writing tests you'll want to ensure that you reset any base vars that may
have been set via a bootstrap file, if you've altered them. If you don't, tests 
that were previously passing, may now start to fail.

When writing names for `describe`'s use the name of the Class or method, and
use single quotes.
```javascript
describe('ClassName', function(){
...
  describe('setUser', function(){
```

When writing names for `it`'s write a **general** description of what should happen
in the method your testing. Use double quotes since you or someone else may use
an apostrophe in the description.
```javascript
// Good
it("should fire some events and setup a button", function(){

// Bad (because it calls out a specific function name, which could change later)
it("shouldn't fire functionName", function(){
```


#### Sinon API

Use `.should.equal(VAL)` for simple values like Strings, Booleans, or Numbers.

Use `.should.deepEqual(OBJ)` for Objects or Arrays.

Sometimes you want to verify that something is `null` or `undefined`, in that
case you'd use `expect( func('fu') ).to.be.undefined`.

Use a `spy` when:
- You want to check if a function is called.
```javascript
var funcSpy = sandbox.spy(className, 'func');
...
funcSpy.should.be.called;
// or
funcSpy.should.be.calledWith(arg, arg2);
```

Use a `stub` when:
- You want to check if a function is called.
- You don't want a function to actually execute.
- The function doesn't exist in your current scope and you don't want to deal
with the setup of that function.
```javascript
var funcStub = sandbox.stub(className, 'func', function(){
  return true;
});
...
funcStub.should.be.called;
// or
funcStub.should.be.calledWith(arg, arg2);
```

There are times with `spy`'s or `stub`'s that you want to ensure a function call
has a specific signature, but the args may be dynamic. In those cases you'll
use the [match API](http://sinonjs.org/docs/#matchers).
```javascript
funcStub.should.be.calledWith(sinon.match.string, sinon.match.func);
```

Sometimes you need to travel forward in time like when `setTimeout` is used. In 
that case you'll want to use the [clock API](http://sinonjs.org/docs/#clock).
```javascript
beforeEach(function(){
  sandbox.clock = sinon.useFakeTimers();
});

afterEach(function(){
  sandbox.clock.restore();
});

...

  someFunc();
  sandbox.clock.tick(500);
  
  callbackSpy.should.be.called;
```

If you want to skip something from running you can add `.skip` to either a
`describe` or an `it`.

If you want to run just one test you can add `.only` to a `describe` or an `it`.
