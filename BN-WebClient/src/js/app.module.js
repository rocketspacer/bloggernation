var app = angular.module('app', ['ui.router', 'ngAnimate', 'appComponents', 'appControllers', 'appServices']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // SPA HTML5 Mode
    $locationProvider.html5Mode({ enabled: true }); //.hashPrefix('!');
    $urlRouterProvider.otherwise('/');

    // UI-Router
    // Application states
    var applicationStates = [
      // Pre-authenticated
      {
        abstract: true,
        name: 'preauth',
        templateUrl: 'partials/preauth.html',
        defaultSubstate: 'preauth.landing'
      },
      {
        name: 'preauth.landing',
        component: 'landing',
        url: '/'
      },
      {
        name: 'preauth.login',
        component: 'login',
        url: '/login'
      },
      {
        name: 'preauth.signup',
        component: 'signup',
        url: '/join'
      },
      {
        name: 'preauth.about',
        templateUrl: 'partials/about.html',
        url: '/about',
        authState: 'auth.about'
      },
      {
        name: 'preauth.help',
        templateUrl: 'partials/help.html',
        url: '/help',
        authState: 'auth.help'
      },
      {
        name: 'preauth.search',
        component: 'search',
        url: '/search?q',
        authState: 'auth.search'
      },
      {
        name: 'preauth.profile',
        component: 'profile',
        url: '/profiles/:profileId',
        authState: 'auth.profile'
      },
      {
        name: 'preauth.blog',
        component: 'blog',
        url: '/blogs/:blogId',
        authState: 'auth.blog'
      },

      // OAuth
      {
        abstract: true,        
        name: 'oauth'
      },
      {
        name: 'oauth.facebook',
        url: '/oauth/facebook/callback?code',
        template: ''
      },

      // Authenticated
      {
        abstract: true,
        name: 'auth',
        templateUrl: 'partials/auth.html',
        defaultSubstate: 'auth.home'
      },
      {
        name: 'auth.home',
        component: 'newsfeed',
        url: '/'
      },
      {
        name: 'auth.about',
        templateUrl: 'partials/about.html',
        url: '/about',
        preauthState: 'preauth.about'
      },
      {
        name: 'auth.help',
        templateUrl: 'partials/help.html',
        url: '/help',
        preauthState: 'preauth.help'
      },
      {
        name: 'auth.search',
        component: 'search',
        url: '/search?q',
        preauthState: 'preauth.search'
      },
      {
        name: 'auth.profile',
        component: 'profile',
        url: '/profiles/:profileId',
        preauthState: 'preauth.profile'
      },
      {
        name: 'auth.blog',
        component: 'blog',
        url: '/blogs/:blogId',
        preauthState: 'preauth.blog'
      },
      {
        name: 'auth.settings',
        component: 'settings',
        url: '/settings',
      }
    ];


    applicationStates.forEach((state) => {
      $stateProvider.state(state);
    });
  }
]);

app.run(['$rootScope', '$transitions',
  function ($rootScope, $transitions) {

    // Authenticate Redirection
    $transitions.onBefore({ to: 'preauth.**' }, (trans) => {

      var authService = trans.injector().get('authService');
      if (!authService.isAuthenticated()) return true;

      var targetState = trans.to();
      if (targetState.authState !== undefined)
        return trans.router.stateService.target(targetState.authState, trans.params());

      return trans.router.stateService.target('auth');
    });

    $transitions.onBefore({ to: 'auth.**' }, (trans) => {

      var authService = trans.injector().get('authService');
      if (authService.isAuthenticated()) return true;

      var targetState = trans.to();
      if (targetState.preauthState)
        return trans.router.stateService.target(targetState.preauthState, trans.params());

      return trans.router.stateService.target('preauth');
    });

    // Default Substate Redirection
    $transitions.onBefore({ to: (state) => state.defaultSubstate }, (trans) => {
      return trans.router.stateService.target(trans.to().defaultSubstate);
    });


    // OAuth Redirection
    $transitions.onBefore({ to: 'oauth.**'}, (trans) => {
      var authService = trans.injector().get('authService');
      var targetState = trans.to();

      var promise = new Promise((fulfill, reject) => {
        authService.authFacebook(trans.params().code, (err, response) => {
          if (err) return reject(err);
          fulfill(trans.router.stateService.target('auth'));
        });
      });

      return promise;           
    });

    

    // Loading Screen Trigger
    $transitions.onStart({}, () => { $rootScope.loading = true; });
    $transitions.onFinish({}, () => {
      $rootScope.loading = false;
      $("html, body").animate({ scrollTop: 0 }, 200);
    });
  }]);