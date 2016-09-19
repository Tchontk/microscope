Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    let post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };
    Meteor.call('postInsert', post, function(error, result) {
      if (error) {
        return throwError(error.reason);
      };
      if (result.postExists) {
        throwError('Ce lien a déjà été utilisé');
      };
      Router.go('postPage', {
        _id: result._id
      });
    });
  }
});