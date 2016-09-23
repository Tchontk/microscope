Router.configure({
  // Le template de base appelle le header
  // Le yield est déterminé en fonction de la route
  layoutTemplate: 'layout',
  // La petite roue de chargement
  loadingTemplate: 'loading',
  // Si il n'existe pas de temlplate
  notFoundTemplate: 'notFound',
  // On attend la fin du chargement
  waitOn: function waitOn() {
    // Avec cette syntaxe on récupère  l'ensemble des notifications
    return [Meteor.subscribe('notifications')];
  },
});

// Les controlleur

// Création d'un controlleur pour la route postsList
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function postsLimit() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function findOptions() {
    return {
      sort: this.sort,
      limit: this.postsLimit(),
    };
  },
  subscriptions: function subscriptions() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function posts() {
    return Posts.find({}, this.findOptions());
  },
  data: function data() {
    let hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {
    submitted: -1,
    _id: -1
  },
  nextPath: function() {
    return Router.routes.newPosts.path({
      postsLimit: this.postsLimit() + this.increment
    })
  }
});

BestPostsController = PostsListController.extend({
  sort: {
    votes: -1,
    submitted: -1,
    _id: -1
  },
  nextPath: function() {
    return Router.routes.bestPosts.path({
      postsLimit: this.postsLimit() + this.increment
    })
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {
  name: 'newPosts',
});

Router.route('/best/:postsLimit?', {
  name: 'bestPosts',
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return [Meteor.subscribe('singlePost', this.params._id)]
  },
  data: function() {
    return Posts.findOne(this.params._id);
  },
});

Router.route('/posts/:_id', {
  name: 'postPage',
  // On attend le chargement des commentaires à ce niveau !
  waitOn: function() {
    return [Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id),
    ]
  },
  data: function() {
    return Posts.findOne(this.params._id);
  },
});

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
  } else {
    this.next();
  }
};

// Les hook

// La page n'a pas été trouvée
Router.onBeforeAction('dataNotFound', {
  only: 'postPage',
});

// Il faut être authentifié pour accéder à postSubmit
Router.onBeforeAction(requireLogin, {
  only: 'postSubmit',
});