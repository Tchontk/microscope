Router.configure({
  // Le template de base
  // Il appelle le header
  // Le yield est déterminé en fonction de la route
  layoutTemplate: 'layout',
  // La petite roue de chargement 
  loadingTemplate: 'loading',
  // Si il n'existe pas de temlplate
  notFoundTemplate: 'notFound',
  // On attend la fin du chargement 
  waitOn: function() {
    return Meteor.subscribe('posts');
  }
});
// La route par défaut 
Router.route('/', {
  name: 'postsList',
});
// La route de lecture d'un postPage
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() {
    return Posts.findOne(this.params._id);
  },
});
// La route de creation de post
Router.route('/submit', {
  name: 'postSubmit',
});

// La fonction de controle d'authentification
var requireLogin = function() {
  if (!Meteor.user()) {
    this.render('accessDenied');
  } else {
    this.next();
  }
};

// Un hook
// Il faut être authentifié pour accéder à postSubmit
Router.onBeforeAction(requireLogin, {
  only: 'postSubmit'
});
// La page n'a pas été trouvée
Router.onBeforeAction('dataNotFound', {
  only: 'postPage',
});