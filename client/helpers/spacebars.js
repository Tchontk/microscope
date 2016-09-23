Template.registerHelper('pluralize', function(n, thing) {
  // pluraliser assez simpliste
  if (n === 1 || n === 0) {
    return n + ' ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }
});