import {
  check
} from 'meteor/check';

Meteor.publish('posts', function() {
  return Posts.find({});
});
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find();
});
/*
Meteor.publish('posts', function(author) {
  return Posts.find({
    flagged: false,
    author: author
  });
});
*/