Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    let $body = $(e.target).find('[name=body]')
    let comment = {
      body: $body.val(),
      postId: template.data._id,
    };

    let errors = validateComment(comment);
    if (errors.body) {
      return Session.set('commentSubmitErrors', errors);
    };

    Meteor.call('commentInsert', comment, function(error, commentId) {
      if (error) {
        return throwError(error.reason);
      };
      $body.val('');
    });
  }
});

Template.commentSubmit.onCreated(function() {
  Session.set('commentSubmitErrors', {});
});

Template.commentSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('commentSubmitErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
  }
});