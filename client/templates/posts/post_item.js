Template.postItem.helpers({
  domain: function domain() {
    const a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  ownPost: function ownPost() {
    return this.userId === Meteor.userId();
  },
});

Template.postItem.events({
  'click .upvote': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id)
  }
});