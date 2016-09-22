Errors = new Meteor.Collection(null);

// function utilisée pour récupérer les messages d'erreurs 
throwError = function(message) {
  Errors.insert({
    message: message,
  });
};

// Helper du template d'affichage
// On notera que errors.html comporte deux template
// _la boucle d'erreurs
// _le template d'une erreur
Template.errors.helpers({
  errors: function() {
    return Errors.find();
  },
});

// Suppresion de l'alert
Template.error.onRendered(function() {
  var error = this.data;
  Meteor.setTimeout(function() {
    Errors.remove(error._id);
  }, 3000);
});