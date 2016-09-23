import {
  check
} from 'meteor/check';

Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});
Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find();
});
Meteor.publish('notifications', function() {
  return Notifications.find({
    userId: this.userId,
    read: false
  });
});
/*
Meteor.publish('posts', function(author) {
  return Posts.find({
    flagged: false,
    author: author
  });
});
*/