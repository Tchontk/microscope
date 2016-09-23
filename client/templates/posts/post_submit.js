// Supprime les possibles erreurs d'une précédente visite
// A chaque appel de ce formulaire, l'objet est remis à vide
Template.postSubmit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});

// Gère l'affichage des erreurs
// _field est le nom du champ
Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    // On appel la fonction de validation des posts
    var errors = validatePost(post);
    if (errors.title || errors.url) {
      return Session.set('postSubmitErrors', errors);
    };

    Meteor.call('postInsert', post, function(error, result) {
      if (error) {
        return throwError(error.reason);
      };
      if (result.postExists) {
        throwError('Ce lien a déjà été utilisé');
      };
      Router.go('postPage', {
        _id: result._id,
      });
    });
  },
});