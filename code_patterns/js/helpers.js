Handlebars.registerHelper('blockHelperName', function(data, opts){
  var attributes = { data: {} };
  
  if( data.someVal ){
    attributes.data.customProp = 'fu';
  }
  
  return ( data.doSomething )
    ? opts.fn(data, attributes)
    : opts.inverse(data);
});