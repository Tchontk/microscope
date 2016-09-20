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
    // Avec cette syntaxe on récupère  l'ensemble des commentaires et posts
    // Pour les posts pas de problème maius pour les commentaires ...
    // return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];

    // La v2 
    return [Meteor.subscribe('notifications')];
  }
});

// Création d'un controlleur pour la route postsList
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {
      sort: {
        submitted: -1
      },
      limit: this.postsLimit()
    };
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  data: function() {
    return {
      posts: Posts.find({}, this.findOptions())
    };
  }
});

// La route par défaut 
Router.route('/:postsLimit?', {
  name: 'postsList',
});
// La route de lecture d'un postPage
Router.route('/posts/:_id', {
  name: 'postPage',
  // On attend le chargement des commentaires à ce niveau !
  waitOn: function() {
    return Meteor.subscribe('comments', this.params._id);
  },
  data: function() {
    return Posts.findOne(this.params._id);
  },
});
// La route d'edition du post
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() {
    return Posts.findOne(this.params._id);
  }
});
// La route de creation de post
Router.route('/submit', {
  name: 'postSubmit',
});

// La fonction de controle d'authentification
var requireLogin = function() {
  if (!Meteor.user()) {
    // Une tampo pour éviter d'apparition du message d'erreur 
    // le temps de vérifier si l'utilisateur est vraiment identifié'
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
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