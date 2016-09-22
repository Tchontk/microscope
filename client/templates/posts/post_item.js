Template.postItem.helpers({
  domain: function domain() {
    const a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  ownPost: function ownPost() {
    return this.userId === Meteor.userId();
  },
  upvotedClass: function upvotedClass() {
    const userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return ('btn-primary upvotable');
    } else {
      return ('disabled');
    }
  }
});

Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id)
  }
});