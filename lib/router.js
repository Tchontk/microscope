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
  waitOn: function waitOn() {
    // Avec cette syntaxe on récupère  l'ensemble des commentaires et posts
    // Pour les posts pas de problème maius pour les commentaires ...
    // return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];

    // La v2
    return [Meteor.subscribe('notifications')];
  },
});

// Création d'un controlleur pour la route postsList
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 25,
  postsLimit: function postsLimit() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function findOptions() {
    return {
      sort: {
        submitted: -1
      },
      limit: this.postsLimit()
    };
  },
  subscriptions: function subscriptions() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    var nextPath = this.route.path({
      postsLimit: this.postsLimit() + this.increment
    });
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? nextPath : null
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