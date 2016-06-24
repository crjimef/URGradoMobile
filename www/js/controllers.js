angular.module('app.controllers', [])

// Controlador para la pantalla de bienvenida
.controller('introCtrl', function ($scope, $state, $document, $ionicHistory) {

    // Función para salir de la introducción
    var startApp = function () {
        $ionicHistory.nextViewOptions({// De la página de destino
            disableBack: true //Desactivamos la opc de volver atrás
        });
        window.localStorage['didTutorial'] = true;
        $state.go('noticias');      
    };

    var irConfiguracion = function () {
        $ionicHistory.nextViewOptions({// De la página de destino
            disableBack: true //Desactivamos la opc de volver atrás
        });
        window.localStorage['didTutorial'] = true; 
        $state.go('configuracion');
    };

    var next = function () {
        $scope.$broadcast('slideBox.nextSlide');
    };

    var prev = function () {
        $scope.$broadcast('slideBox.prevSlide');
    };
    // Comprueba si el usuario ha visto el tutorial previamente
    if (window.localStorage['didTutorial'] === "true") { 
        startApp(); // Si lo ha visto llama a la función startApp
    }
    else {
        $scope.verIntro = true; 
        setTimeout(function () {
            navigator.splashscreen.hide();
        }, 750);
    }

    $scope.next = next;
    $scope.salir = function () {
        startApp();
    };

    $scope.salir2 = function () {
        irConfiguracion();
    };
    // Called each time the slide changes
    $scope.slideChanged = function (index) {

        var btl = $document[0].getElementById('leftButtons');
        var btr = $document[0].getElementById('rightButtons');

        // Check if we should update the left buttons
        if (index > 0) {
            // If this is not the first slide, give it a back button

            btl.textContent = 'Anterior';
            $scope.salir = function () {
                // Move to the previous slide
                prev();
            };

        } else {
            // This is the first slide, use the default left buttons
            btl.textContent = 'Omitir';
            $scope.salir = function () {
                // Start the app on tap
                startApp();
            };
        }


        // If this is the last slide, set the right button to
        // move to the app

        if (index == 2) {
            btr.textContent = 'Comenzar';
            btr.onclick = function (e) {
                // Start the app on tap
                startApp();
            };
        } else {
            // Otherwise, use the default buttons
            btr.textContent = 'Siguiente';
            btr.onclick = function (e) {
                // Start the app on tap
                next();
            };
        }
    };
})

// Controlador para la pantalla de Listado de Noticias
.controller('noticiasCtrl', function ($scope, $ionicLoading, NoticiasFactory, $location, $ionicPopup) {

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    NoticiasFactory.initNoticias().then(function (data) { // Petición con éxito
        //Mandar a la vista los datos recibidos
        $scope.noticias = NoticiasFactory.getNoticias();
        $ionicLoading.hide();

    }).catch(function (err) { // Tratar el error
        
        $ionicLoading.hide();

        // Mostrar al usuario un popup que le indique que ha habido un error en la conexión
        var showAlert = function () {
            var alertPopup = $ionicPopup.alert({ // Configurar el popup
                title: "ERROR",
                template: "Error con el servidor o internet, visualizar noticias guardadas"
            });
            alertPopup.then(function (res) { // Cuando se confirme
                //Mandar a la vista las últimas noticias guardadas
                $scope.noticias = NoticiasFactory.getNoticias();
            });
        };
        showAlert();       
    })

    $scope.formatFecha = function (noticia) {
        return NoticiasFactory.formatFecha(noticia.publishedDate);
    }

    $scope.verNoticia = function (noticia) {
        NoticiasFactory.postNoticia(noticia);
        $location.path('/noticia');
    }

})

// Controlador para la pantalla de Detalle de una Noticia
.controller('noticiaCtrl', function ($scope, NoticiasFactory, $sce) {
    $scope.noticia = NoticiasFactory.getNoticia();
    $scope.contNoticia = $sce.getTrustedHtml(NoticiasFactory.getNoticia().content);
    $scope.formatFecha = function (noticia) {
        return NoticiasFactory.formatFecha(noticia.publishedDate);
    }
})

// Controlador para la pantalla de Listado de asignaturas de un Grado
.controller('asignaturasGradoCtrl', function ($scope, $http, GradosFactory, $sce, AsignaturaFactory, AsignaturasFactory, $ionicLoading) {

    $scope.grado = GradosFactory.getGrado();

    if (AsignaturasFactory.getGrado() != GradosFactory.getGrado().slug) {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        AsignaturasFactory.initAsignaturas(GradosFactory.getGrado().slug).then(function (data) {
            //Tratar los datos recibidos
            $scope.mensajeError = false;

            //Poner las asignaturas por grupos en el scope
            $scope.groups = AsignaturasFactory.getGroups();
            $ionicLoading.hide();

            //Guardar grado relacionado con las asignaturas
            AsignaturasFactory.postGrado(GradosFactory.getGrado().slug);

        }).catch(function (err) {
            // Tratar el error
            $ionicLoading.hide();
            $scope.mensajeError = true;
        })
    }
    else {
        $scope.groups = AsignaturasFactory.getGroups();
    }

    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };
    $scope.verGuia = function (asignatura) {
        AsignaturaFactory.postAsignatura(asignatura);
    }
})

// Controlador para la pantalla de Listado de mis asignaturas
.controller('misAsignaturasCtrl', function ($scope, ConfiguracionFactory, AsignaturaFactory, GradosFactory, $ionicPopup, $ionicHistory, $state) {

    if (ConfiguracionFactory.getGrado() == null) {
        var showAlert = function () {
            var alertPopup = $ionicPopup.alert({ // Configurar el popup
                title: "Error: Sin configurar",
                template: "Para poder ver sus asignaturas debe configurar la App"
            });
            alertPopup.then(function (res) { // Cuando se confirme
                $ionicHistory.nextViewOptions({// De la página de destino
                    disableBack: true //Desactivamos la opc de volver atrás
                });
                $state.go('configuracion');
            });
        };
        showAlert();

    }
    else {
        $scope.grado = ConfiguracionFactory.getGrado();
        GradosFactory.postGrado($scope.grado);
        var filtrarAsignaturas = function (asigList) {
            var asignaturas = [];
            var length = asigList.length;
            for (i = 0; i < length; i++) {
                if (asigList[i].checked) {
                    asignaturas.push(asigList[i]);
                }
            }
            return asignaturas;
        };

        var groups = [];
        console.log('entro %O: ', ConfiguracionFactory.getAsignaturasPrimero());
        //formar grupos para motrar asignaturas
        groups[0] = filtrarAsignaturas(ConfiguracionFactory.getAsignaturasPrimero());
        groups[0].name = "Primer Curso";
        groups[1] = filtrarAsignaturas(ConfiguracionFactory.getAsignaturasSegundo());
        groups[1].name = "Segundo Curso";
        groups[2] = filtrarAsignaturas(ConfiguracionFactory.getAsignaturasTercero());
        groups[2].name = "Tercer Curso";
        groups[3] = filtrarAsignaturas(ConfiguracionFactory.getAsignaturasCuarto());
        groups[3].name = "Cuarto Curso";
        groups[4] = filtrarAsignaturas(ConfiguracionFactory.getAsignaturasOptativas());
        groups[4].name = "Optativas";

        $scope.groups = groups;

        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
        $scope.verGuia = function (asignatura) {
            AsignaturaFactory.postAsignatura(asignatura);
        }
    }
})

// Controlador para la pantalla de Detalle de mi Grado
.controller('miGradoCtrl', function ($scope, ConfiguracionFactory, $sce, $ionicPopup, $ionicHistory, $state) {

    if (ConfiguracionFactory.getGrado() == null) {
        var showAlert = function () {
            var alertPopup = $ionicPopup.alert({ // Configurar el popup
                title: "Error: Sin configurar",
                template: "Para poder ver su Grado debe configurar la App"
            });
            alertPopup.then(function (res) { // Cuando se confirme
                $ionicHistory.nextViewOptions({// De la página de destino
                    disableBack: true //Desactivamos la opc de volver atrás
                });
                $state.go('configuracion');
            });
        };
        showAlert();

    }
    else{
        var g = ConfiguracionFactory.getGrado();
        $scope.grado = g;
        $scope.videoURL = g.custom_fields.video[0];
        $scope.html = $sce.getTrustedHtml(g.content);
        $scope.mi_estructura = $sce.getTrustedHtml(g.custom_fields.estructura[0]);
        $scope.nota_estructura = g.custom_fields.nota_estructura[0];
        $scope.menciones = $sce.getTrustedHtml(g.custom_fields.menciones[0]);
    }
})

// Controlador para la pantalla de Listado de Grados
.controller('estudiosDeGradoCtrl', function ($scope, $ionicLoading, GradosFactory) {

    $scope.mensajeError = false;

    var iniciarGrados = function () {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        GradosFactory.initGrados().then(function (data) {
            // Tratar los datos recibidos
            $scope.mensajeError = false;
            $ionicLoading.hide();
            $scope.grados = data.posts;

        }).catch(function (err) {
            // Tratar el error
            $ionicLoading.hide();
            $scope.mensajeError = true;
        })
    };

    $scope.reiniciarGrados = function () {
        iniciarGrados();
    };

    if (GradosFactory.getGrados().length == 0) {
        iniciarGrados();
    }
    else {
        $scope.grados = GradosFactory.getGrados();
    }

    $scope.guardarGrado = function (grado) {
        GradosFactory.postGrado(grado);
    }
})

// Controlador para la pantalla de Detalle de un Grado
.controller('gradoCtrl', function ($scope, GradosFactory, $sce) {

    $scope.grado = GradosFactory.getGrado();
    $scope.videoURL = GradosFactory.getGrado().custom_fields.video[0];
    $scope.html = $sce.getTrustedHtml(GradosFactory.getGrado().content);
    $scope.estructura = $sce.getTrustedHtml(GradosFactory.getGrado().custom_fields.estructura[0]);
    $scope.nota_estructura = $scope.grado.custom_fields.nota_estructura[0];
    $scope.menciones = $sce.getTrustedHtml(GradosFactory.getGrado().custom_fields.menciones[0]);

})

// Controlador para la pantalla de Listado de Departamentos
.controller('departamentosCtrl', function ($scope, $ionicLoading, $ionicPopup, DepartamentosFactory, $stateParams) {

    if (DepartamentosFactory.getDepartamentos().length == 0) {

        //var postsApi = 'http://urgrado.esy.es/api/core/get_category_posts/?slug=departamentos';
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
     /*   $http.get(postsApi).success(function (data, status, headers, config) {
            $ionicLoading.hide();
            $scope.departamentos = data.posts;
            DepartamentosFactory.postDepartamentos(data.posts);
        }).error(function (data, status, headers, config) {
            $ionicLoading.hide();
        });*/

        DepartamentosFactory.initDepartamentos().then(function (data) {
            // Tratar los datos recibidos
            $ionicLoading.hide();
            $scope.departamentos = DepartamentosFactory.getDepartamentos();

        }).catch(function (err) {
            // Tratar el error
            $ionicLoading.hide();
            // Mostrar al usuario un popup que le indique que ha habido un error en la conexión
            var showAlert = function () {
                var alertPopup = $ionicPopup.alert({ // Configurar el popup
                    title: "ERROR",
                    template: "Error del servidor o de internet"
                });
            };
            showAlert();
        })
    }
    else {
        var depart = DepartamentosFactory.getDepartamentos();
        var length = depart.length;
        var slug = $stateParams.slug;
        for (i = 0; i < length; i++) {
            slug2 = ":" + depart[i].slug;
            if (slug == slug2) {
                $scope.departamento = depart[i];
            }
        };
        $scope.html = ' ' + $scope.departamento.content;
    }
})

// Controlador para el modal que muestra el Plano de la UR
.controller('FullscreenImageCtrl', function ($scope, $ionicModal) {

    $ionicModal.fromTemplateUrl('image-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
    });
    $scope.$on('modal.shown', function () {
    });

    $scope.showImage = function (imgUrl) {
        $scope.imageSrc = imgUrl;
        $scope.openModal();
    }
})

// Controlador para el modal que muestra el detalle de un profesor
.controller('FullscreenProfesorCtrl', function ($scope, $ionicModal, $ionicPopup, $ionicLoading, ProfesoresFactory) {
    $ionicModal.fromTemplateUrl('profesor-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
    });
    $scope.$on('modal.shown', function () {
    });

    $scope.showProfesor = function (profesorId) {

        $scope.profesorId = profesorId;
        if (ProfesoresFactory.getProfesores().length == 0) {
            
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            ProfesoresFactory.initProfesores().then(function (data) {
                // Tratar los datos recibidos
                $ionicLoading.hide();
                // Pasar a la vista los datos del profesor seleccionado
                $scope.profesor = ProfesoresFactory.getProfesor($scope.profesorId);
                // Mostrar modal con la información del profesor
                $scope.openModal();

            }).catch(function (err) {
                // Tratar el error
                $ionicLoading.hide();
                // Mostrar al usuario un popup que le indique que ha habido un error en la conexión
                var showAlert = function () {
                    var alertPopup = $ionicPopup.alert({ // Configurar el popup
                        title: "ERROR",
                        template: "Error del servidor o de internet"
                    });
                };
                showAlert();
            })
        }
        else {
            // Pasar a la vista los datos del profesor seleccionado
            $scope.profesor = ProfesoresFactory.getProfesor($scope.profesorId);
            // Mostrar modal con la información del profesor
            $scope.openModal();
        }

    }
})

// Controlador para la pantalla de Listado de Facultades y Escuelas
.controller('facultadesYEscuelasCtrl', function ($scope, $http, $ionicLoading, $stateParams, FacultadesFactory, $compile) {

    $scope.mensajeError = false;

    var iniciarFacultades = function () {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        FacultadesFactory.initFacultades().then(function (data) {
            // Tratar los datos recibidos
            $scope.mensajeError = false;
            $ionicLoading.hide();
            $scope.facultades = data.posts;

        }).catch(function (err) {
            // Tratar el error
            $ionicLoading.hide();
            $scope.mensajeError = true;
        })
    };

    $scope.reiniciarFacultades = function () {
        iniciarFacultades();
    };

    if (FacultadesFactory.getFacultades().length == 0) {

        iniciarFacultades();
    }
    else {
        var slug = $stateParams.slug;
        $scope.facultad = FacultadesFactory.getFacultad(slug);
        $scope.html = ' ' + $scope.facultad.content;
    }
})

// Controlador para la pantalla de Configuración
.controller('configuracionCtrl', function ($scope, GradosFactory, $ionicModal, $ionicLoading, AsignaturasFactory, ConfiguracionFactory, $ionicPopup) {

    //Modal opciones
    $ionicModal.fromTemplateUrl('fancy-select-items.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
    });
    $scope.$on('modal.shown', function () {
    });

    /*-------------------------------------------------------------------*/
    //Iniciar las opciones predefinidas del usuario

    //Iniciar variable número de noticias
    if (ConfiguracionFactory.getNumNoticias() == null) { //Si no tiene una predefinida se predefine con 5 
        $scope.numNoticias = 5;
    }
    else {
        $scope.numNoticias = ConfiguracionFactory.getNumNoticias(); // Si la tiene configurada se obtiene
    }

    //Iniciar variable grado del usuario
    if (ConfiguracionFactory.getGrado() == null) { //Si no tiene un grado asignado 
        $scope.gradoSeleccionado = false; //Se ocultan los seleccionables de asignaturas
        $scope.mi_grado = "";

        //Se inician los contenedores de las asignaturas vacios
        $scope.asigPrimero = [];
        $scope.asigSegundo = [];
        $scope.asigTercero = [];
        $scope.asigCuarto = [];
        $scope.asigOptativas = [];
    }
    else { //Tiene un grado asignado, se obtiene

        $scope.gradoSeleccionado = true;
        $scope.mi_grado = ConfiguracionFactory.getGrado();

        //Se obtienen sus asignaturas
        $scope.asigPrimero = ConfiguracionFactory.getAsignaturasPrimero();
        $scope.asigSegundo = ConfiguracionFactory.getAsignaturasSegundo();
        $scope.asigTercero = ConfiguracionFactory.getAsignaturasTercero();
        $scope.asigCuarto = ConfiguracionFactory.getAsignaturasCuarto();
        $scope.asigOptativas = ConfiguracionFactory.getAsignaturasOptativas();
    }



    /*------------------------------------------------------------------------------------------------------------*/
    //Cargar lista de Grados
    if (GradosFactory.getGrados().length == 0) {//Si no han sido descargados previamente, se inicia la factoría de Grados
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        GradosFactory.initGrados().then(function (data) {
            // Tratar los datos recibidos
            $scope.mensajeError = false;
            $ionicLoading.hide();
            $scope.grados = data.posts;

        }).catch(function (err) {
            // Tratar el error
            $ionicLoading.hide();
            $scope.mensajeError = true;
        })
    }
    else {
        $scope.grados = GradosFactory.getGrados(); //Si han sido descargados previamente, se obtiene la lista de la factoría de Grados
    }

    /*--------------------------------------------------------------------------------------------------------*/
    // Función auxiliar para cargar las asignaturas de un grado, que NO están guardadas en la factoría de asignaturas
    var cargarAsignaturasGrado = function (slug) {
        var groups = [];
        $scope.asigPrimero = [];
        $scope.asigSegundo = [];
        $scope.asigTercero = [];
        $scope.asigCuarto = [];
        $scope.asigOptativas = [];

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        AsignaturasFactory.initAsignaturas(slug).then(function (data) {
            // Tratar los datos recibidos
            $scope.mensajeError = false;

            groups = AsignaturasFactory.getGroups();
            $scope.asigPrimero = groups[0];
            $scope.asigSegundo = groups[1];
            $scope.asigTercero = groups[2];
            $scope.asigCuarto = groups[3];
            $scope.asigOptativas = groups[4];

            $ionicLoading.hide();

            //Guardar grado relacionado con las asignaturas
            AsignaturasFactory.postGrado(slug);

        }).catch(function (err) {
            // Tratar el error
            $ionicLoading.hide();
            $scope.mensajeError = true;
        })
    };

    /*--------------------------------------------------------------------------------------------------------*/
    // Función auxiliar para cargar las asignaturas de un grado, que SÍ están guardadas en la factoría de asignaturas
    var cargarAsignaturasFactoria = function () {
        //Reiniciar contenedores de asignaturas
        var groups = [];
        $scope.asigPrimero = [];
        $scope.asigSegundo = [];
        $scope.asigTercero = [];
        $scope.asigCuarto = [];
        $scope.asigOptativas = [];

        //Traer asignaturas desde la factoría de asignaturas
        groups = AsignaturasFactory.getGroups();
        $scope.asigPrimero = groups[0];
        $scope.asigSegundo = groups[1];
        $scope.asigTercero = groups[2];
        $scope.asigCuarto = groups[3];
        $scope.asigOptativas = groups[4];
    };

    /*--------------------------------------------------------------------------------------------------------*/
    //Prueba popup: Confirmar cambio de Grado teniendo un Grado asignado
    $scope.showConfirm = function (titulo, contenido) {
        var confirmPopup = $ionicPopup.confirm({
            title: titulo,
            template: contenido
        });

        confirmPopup.then(function (res) {

            if (res) {//El usuario responde que desea cambiar el Grado

                if (AsignaturasFactory.getGrado() != grado.slug) { //Las asignaturas no están en la factoría de asignaturas

                    cargarAsignaturasGrado(grado.slug);
                    $scope.mi_grado = grado;
                    $scope.gradoSeleccionado = true;
                }
                else { //Las asignaturas están en la factoría de asignaturas

                    cargarAsignaturasFactoria();
                    $scope.mi_grado = grado;
                    $scope.gradoSeleccionado = true;
                }
            } 
        });
    };

    /*--------------------------------------------------------------------------------------------------------*/
    //Item de tipo único seleccionado, o Grado o Número de noticias
    $scope.itemSelect = function (item) {

        $scope.mensajeError = false;

        //Caso 1: item seleccionado para cambiar el número de noticias
        if ($scope.headerText == 'N. de noticias a mostrar') {

            // Cambiar número de noticias a mostrar
            $scope.numNoticias = item.title;
            $scope.closeModal();
        }

            //Caso 2: item seleccionado para cambiar el grado
        else {
            grado = item;
            $scope.closeModal();

            // Se ha seleccionado un grado por primera vez o no tiene grado asignado
            if ($scope.mi_grado.slug == "" || ConfiguracionFactory.getGrado() == null) {
                if (AsignaturasFactory.getGrado() != grado.slug) { //Las asignaturas no están en la factoría de asignaturas

                    cargarAsignaturasGrado(grado.slug); //Cargo las asignaturas en la factoría
                    $scope.mi_grado = grado;
                    $scope.gradoSeleccionado = true;
                }
                else { //Las asignaturas están en la factoría de asignaturas

                    cargarAsignaturasFactoria(); // Cargo las asignaturas desde la factoría
                    $scope.mi_grado = grado;
                    $scope.gradoSeleccionado = true;
                }
            }
            else if (grado.slug != $scope.mi_grado.slug) { // El usuario cambia de Grado y tiene Grado asignado
                
                if (ConfiguracionFactory.getGrado().slug != grado.slug) { // El usuario tiene Grado asignado y se quiere cambiar
                    
                    $scope.showConfirm('Cambio de Grado', 'Seguro de que desea realizar un cambio de Grado');
                }
                else { // El usuario quiere volver a su Grado asignado
                  
                    $scope.gradoSeleccionado = true;
                    $scope.mi_grado = ConfiguracionFactory.getGrado();

                    //Se obtienen sus asignaturas
                    $scope.asigPrimero = ConfiguracionFactory.getAsignaturasPrimero();
                    $scope.asigSegundo = ConfiguracionFactory.getAsignaturasSegundo();
                    $scope.asigTercero = ConfiguracionFactory.getAsignaturasTercero();
                    $scope.asigCuarto = ConfiguracionFactory.getAsignaturasCuarto();
                    $scope.asigOptativas = ConfiguracionFactory.getAsignaturasOptativas();
                }
            }
        }
    };

    /*--------------------------------------------------------------------------------------------------------*/
    //Función para recoger los resultados del multiselect
    $scope.validate = function (event) {
        
        var items = $scope.items;
        var id = $scope.id;

        //Por el id se sabe que listado de asignaturas se ha modificado
        switch (id) {
            case 2:
                $scope.asigPrimero = items;
                break;
            case 3:
                $scope.asigSegundo = items;
                break;
            case 4:
                $scope.asigTercero = items;
                break;
            case 5:
                $scope.asigCuarto = items;
                break;
            case 6:
                $scope.asigOptativas = items;
                break;
        }

        //Cerrar el modal
        $scope.closeModal();
    };

    //Mostrar el select modal, se le asignan el tipo (multi o single select), los objetos y el título  
    $scope.showItems = function (id) {
        $scope.id = id;
        switch (id) {
            case 0:
                $scope.multiSelect = false;
                $scope.items = [];
                $scope.items = [{ "title": 3 }, { "title": 5 }, { "title": 10 }];
                $scope.headerText = 'N. de noticias a mostrar';
                $scope.openModal();
                break;
            case 1:
                $scope.multiSelect = false;
                $scope.items = $scope.grados;
                $scope.headerText = 'Selecciona tu Grado';
                $scope.openModal();
                break;
            case 2:
                $scope.multiSelect = true;
                $scope.items = $scope.asigPrimero;
                $scope.headerText = 'Asignaturas de primero';
                $scope.openModal();
                break;
            case 3:
                $scope.multiSelect = true;
                $scope.items = $scope.asigSegundo;
                $scope.headerText = 'Asignaturas de segundo';
                $scope.openModal();
                break;
            case 4:
                $scope.multiSelect = true;
                $scope.items = $scope.asigTercero;
                $scope.headerText = 'Asignaturas de tercero';
                $scope.openModal();
                break;
            case 5:
                $scope.multiSelect = true;
                $scope.items = $scope.asigCuarto;
                $scope.headerText = 'Asignaturas de cuarto';
                $scope.openModal();
                break;
            case 6:
                $scope.multiSelect = true;
                $scope.items = $scope.asigOptativas;
                $scope.headerText = 'Asignaturas Optativas';
                $scope.openModal();
                break;
        }
    };

    /*--------------------------------------------------------------------------------------------------------*/
    //Función auxiliar para mostrar popup de alerta
    $scope.showAlert = function (titulo, contenido) {
        var alertPopup = $ionicPopup.alert({ // Configurar el popup
            title: titulo,
            template: contenido
        });
    };

    /*--------------------------------------------------------------------------------------------------------*/
    // Función para guardar la configuración de forma persistente
    $scope.guardarConfiguracion = function () { 

        ConfiguracionFactory.postNumNoticias($scope.numNoticias); // Se guarda el número de noticias
        if ($scope.gradoSeleccionado == true) {

            if ($scope.mi_grado.slug == '801g') { // Se guarda el grado (sólo se permite el que tiene asignaturas)
                
                ConfiguracionFactory.postGrado($scope.mi_grado);
                ConfiguracionFactory.postAsignaturasPrimero($scope.asigPrimero);
                ConfiguracionFactory.postAsignaturasSegundo($scope.asigSegundo);
                ConfiguracionFactory.postAsignaturasTercero($scope.asigTercero);
                ConfiguracionFactory.postAsignaturasCuarto($scope.asigCuarto);
                ConfiguracionFactory.postAsignaturasOptativas($scope.asigOptativas);
                $scope.showAlert('Configurado correctamente', 'Ya puede ver sus asignaturas y su Grado');
            }
            else {
                $scope.showAlert('Grado sin asignaturas','No se puede seleccionar este Grado');
            }
        }
    };
})

// Controlador para la pantalla de Servicios Deportivos
.controller('serviciosDeportivosCtrl', function ($scope, $rootScope) {
    // Permite refrescar la página cada vez que se entra
    $rootScope.$emit('refreshedPressed');
})

// Controlador para la pantalla de Detalle de una asignatura
.controller('detalleDeAsignaturaCtrl', function ($scope, AsignaturaFactory, GradosFactory, $sce) {

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });
    $scope.titulo_grado = GradosFactory.getGrado().attachments[0].title;
    $scope.asig = AsignaturaFactory.getAsignatura();
    $scope.temario = $sce.getTrustedHtml($scope.asig.guia.temario_con_estilo);
    $scope.comentarios = $sce.getTrustedHtml($scope.asig.guia.comentarios_evaluacion);
    $scope.criterios = $sce.getTrustedHtml($scope.asig.guia.criterios_criticos);

    $scope.shownGroup = 1;
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };

    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };
})

// Controlador para la pantalla de la Biblioteca
.controller('bibliotecaCtrl', function ($scope, $rootScope) {
    // Permite refrescar la página cada vez que se entra
    $rootScope.$emit('refreshedPressed');
})

// Controlador para la pantalla del Calendario académico
.controller('calendarioCtrl', function ($scope, $ionicScrollDelegate) {

    //Establecer en zoom inicial
    var initZoom = 0.3;
    $scope.$on('$ionicView.enter', function () {
        $ionicScrollDelegate.$getByHandle('wavesScroller').zoomBy(initZoom);
    });
})
