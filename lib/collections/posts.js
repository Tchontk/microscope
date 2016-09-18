Posts = new Mongo.Collection('posts');

Posts.allow({
  //insert: function(userId, doc) {
  //  return !!userId;
  //}
  insert: ((userId, doc) => !!userId)
})