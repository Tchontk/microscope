import {
  check,
} from 'meteor/check';
Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function update(userId, post) {
    return ownsDocument(userId, post);
  },
  remove: function remove(userId, post) {
    return ownsDocument(userId, post);
  },
});
Posts.deny({
  update: function update(userId, post, fieldNames) {
    // may only edit the following two fields
    return (_.without(fieldNames, 'url', 'title').length > 0);
  },
});
Posts.deny({
  update: function update(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

Meteor.methods({
  postInsert: function postInsert(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String,
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-post', 'You must set a title and URL for your post');
    };

    // Recherche d'un doublon
    // Attention l'ordre est important
    // Il faut que le return soit avant l'insert
    var postWithSameLink = Posts.findOne({
      url: postAttributes.url,
    });
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      votes: 0,
      commentsCount: 0,
    });
    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  },
  upvote: function upvote(postId) {
    check(this.userId, String);
    check(postId, String);
    var affected = Posts.update({
      _id: postId,
      upvoters: {
        $ne: this.userId
      }
    }, {
      $addToSet: {
        upvoters: this.userId
      },
      $inc: {
        votes: 1,
      },
    });
    if (!affected) {
      throw new Meteor.Error('invalid', "Votre vote n'a pas été enregistré");
    }
  },
});

// La fonction qui détermine si il existe une erreur
// Uniquement si le champ n'est pas vide
validatePost = function validatePost(post) {
  const errors = {};
  if (!post.title) errors.title = "Please fill in a headline";
  if (!post.url) errors.url = "Please fill in a URL";
  return errors;
};