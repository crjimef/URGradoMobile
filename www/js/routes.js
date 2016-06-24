angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
 
  .state('intro', {
      url: '/',
      templateUrl: 'templates/intro.html',
      controller: 'introCtrl'
  })

  .state('noticias', {
      cache: false,
      url: '/noticias',
      templateUrl: 'templates/noticias.html',
      controller: 'noticiasCtrl'
  })

  .state('tabsController.introGrado', {
    cache: false,
    url: '/introGrado',
    views: {
      'tab1': {
          templateUrl: 'templates/introGrado.html',
          controller: 'gradoCtrl'
      }
    }
  })

  .state('tabsController.asignaturas', {
    cache: false,
    url: '/asignaturas',
    views: {
      'tab3': {
        templateUrl: 'templates/asignaturas.html',
        controller: 'asignaturasGradoCtrl'
      }
    }
  })

  .state('tabsController.estructura', {
      cache: false,
      url: '/estructura',
    views: {
      'tab2': {
          templateUrl: 'templates/estructura.html',
          controller: 'gradoCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract: true
  })

  .state('noticia', {
    url: '/noticia',
    templateUrl: 'templates/noticia.html',
    controller: 'noticiaCtrl'
  })

  .state('estudiosDeGrado', {
    cache:false,
    url: '/grados',
    templateUrl: 'templates/estudiosDeGrado.html',
    controller: 'estudiosDeGradoCtrl'
  })

  .state('facultadesYEscuelas', {
    url: '/facultadesyescuelas',
    templateUrl: 'templates/facultadesYEscuelas.html',
    controller: 'facultadesYEscuelasCtrl'
  })

  .state('departamentos', {
    url: '/departamentos',
    templateUrl: 'templates/departamentos.html',
    controller: 'departamentosCtrl'
  })

  .state('facultadyescuela', {
    url: '/facultadyescuela/:slug',
    templateUrl: 'templates/facultad.html',
    controller: 'facultadesYEscuelasCtrl'
  })

  .state('departamento', {
    url: '/departamento/:slug',
    templateUrl: 'templates/departamentoDetails.html',
    controller: 'departamentosCtrl'
  })
  .state('misAsignaturas', {
      cache: false,
      url: '/misAsignaturas',
      templateUrl: 'templates/asignaturas.html',
      controller: 'misAsignaturasCtrl'
  })

  .state('miGrado', {
      cache: false,
      url: '/miGrado',
      templateUrl: 'templates/introGrado.html',
      controller: 'miGradoCtrl'
  })

  .state('configuracion', {
      cache:false,
      url: '/configuracion',
      templateUrl: 'templates/configuracion.html',
      controller: 'configuracionCtrl'
  })

  .state('detalleDeAsignatura', {
    cache: false,
    url: '/asignatura',
    templateUrl: 'templates/detalleDeAsignatura.html',
    controller: 'detalleDeAsignaturaCtrl'
  })

  .state('biblioteca', {
    cache: false,
    url: '/biblioteca',
    templateUrl: 'templates/biblioteca.html',
    controller: 'bibliotecaCtrl'
  })

  .state('serviciosDeportivos', {
    cache: false,
    url: '/serviciosDeportivos',
    templateUrl: 'templates/serviciosDeportivos.html',
    controller: 'serviciosDeportivosCtrl'
  })

  .state('calendario', {
    url: '/calendario',
    templateUrl: 'templates/calendario.html',
    controller: 'calendarioCtrl'
  })

$urlRouterProvider.otherwise('/') //Indica el estado inicial, en este caso la url '/'

});