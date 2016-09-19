Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function(postAttributes) {
    var user = Meteor.user();
    var comment = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
    });
    Posts.update(comment.postId, {
      $inc: {
        commentsCount: 1
      }
    });
    Comments.insert(comment);
    return {
      _id: comment.postId
    }
  }
})

validateComment = function(comment) {
  var errors = {};
  if (!comment.body) errors.body = "Please write some content";
  return errors;
};