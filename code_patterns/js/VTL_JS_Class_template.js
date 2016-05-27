#set( $CAMELCASE_NAMESPACE = $NAME.substring(0,1).toLowerCase() + $NAME.substring(1) )
#set( $CSS_PREFIX = $CAMELCASE_NAMESPACE.replaceAll("([A-Z])", "-$1").toLowerCase() )
//import '/path/to/styles.css';
//import '/path/to/ExampleTemplate.hbs';
//import '/path/to/extra/code.js';

class ${NAME} {

  constructor(opts = {}){
    /**
     * The namespace of the Class.
     * @type {String}
     */
    this.namespace = '${CAMELCASE_NAMESPACE}';
    /**
     * Each JS selector is prefixed per the Class so as
     * not to conflict with any other Classes on the page.
     * @type {String}
     */
    this.jsPrefix = '.js-'+ this.namespace;
    /**
     * Each CSS class is prefixed per the Class so as
     * not to conflict with any other styling on the page.
     * @type {String}
     */
    this.cssClassPrefix = '${CSS_PREFIX}__';
    /**
     * Each CSS modifier is prefixed per the Class so as
     * not to conflict with any other styling on the page.
     * @type {String}
     */
    this.cssModifierPrefix = '${CSS_PREFIX}--';
    /**
     * Namespace Events so that Class specific event bindings
     * can be enabled/disabled at once, and to aid in debugging.
     * @type {String}
     */
    this.eventSuffix = '.'+ this.namespace;
    /**
     * Prefix logging statements to easily differentiate between
     * other logging on the page.
     * @type {String}
     */
    this.LOG_PREFIX = '[ ${NAME} ] -';
    /**
     * A map of templates used by the Class.
     * @type {Object}
     */
    this.templates = {
      //EXAMPLE_TEMPLATE: Handlebars.templates.ExampleTemplate,
    };
    /**
     * A map of JS selectors used to access the DOM.
     * @type {Object}
     */
    this.selectors = {
      //SELECTOR_NAME : this.jsPrefix +'SelectorName',
    };
    /**
     * A map of CSS modifiers used to alter the DOM.
     * @type {Object}
     */
    this.cssModifiers = {
      //IS_HIDDEN : this.cssModifierPrefix +'is--hidden',
    };
    /**
     * A map of commonly used DOM elements.
     * @type {Object}
     */
    this.els = {
      //$name: $(this.selectors.NAME),
    };
    /**
     * A map of event types used by the Class.
     * @type {Object}
     */
    this.events = {
      //CLICK: 'click'+ this.eventSuffix
    };

    // override defaults with user opts
    Object.assign(this, opts);
  }

  /**
   * Initialize the Class by executing any methods required
   * to make it function.
   */
  init(){
    var _self = this;
    appTools.log( _self.LOG_PREFIX, 'Initializing' );


  }
}