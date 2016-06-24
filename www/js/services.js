angular.module('app.services', [])

.factory('DepartamentosFactory', function ($q, $http) {
    var departamentos = [];

    var interfaz = {
        initDepartamentos: function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('http://urgrado.esy.es/api/core/get_category_posts/?slug=departamentos')
                .success(function (data) {
                    defered.resolve(data);
                    departamentos = data.posts;
                })
                .error(function (err) {
                    defered.reject(err)
                });

            return promise;
        },
        getDepartamentos: function () {
            return departamentos;
        },
        postDepartamentos: function (datos) 
        {
            departamentos = datos;
        }
    }
    return interfaz;
})

.factory('FacultadesFactory', function ($q, $http) {
    var facultades = [];

    var interfaz = {
        initFacultades: function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('http://urgrado.esy.es/api/core/get_category_posts/?slug=facultadesyescuelas')
                .success(function (data) {
                    defered.resolve(data);
                    facultades = data.posts;
                })
                .error(function (err) {
                    defered.reject(err)
                });

            return promise;
        },
        getFacultades: function () {
            return facultades;
        },
        postFacultades: function (datos) 
        {
            facultades = datos;
        },
        getFacultad: function (slug) {
  
            var length = facultades.length;
            for (i = 0; i < length; i++) {
                slug2 = ":" + facultades[i].slug;
                if (slug == slug2) {
                    return facultades[i];
                }
            };
        }

    }
    return interfaz;
})

.factory('GradosFactory', function ($q, $http) {
    var grados = [];
    var grado = [];
    var interfaz = {
        initGrados: function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('http://urgrado.esy.es/api/get_category_posts/?slug=grados')
                .success(function (data) {
                    defered.resolve(data);
                    grados = data.posts;
                })
                .error(function (err) {
                    defered.reject(err)
                });

            return promise;
        },
        getGrados: function () {
            return grados;
        },
        postGrados: function (datos) {
            grados = datos;
        },
        getGrado: function () {
        return grado;
        },
        postGrado: function (datos) {
            grado = datos;
        }
    }
    return interfaz;
})

.factory('AsignaturasFactory', function ($q, $http) {

    var asignaturas = [];
    var grado = "";
    var groups = [];

    var interfaz = {
        initAsignaturas: function (slug) {
            var defered = $q.defer();
            var promise = defered.promise;
            postsApi = 'http://urgrado.esy.es/api/get_post/?slug=asignaturas_' + slug;

            $http.get(postsApi)
                .success(function (data) {
                    defered.resolve(data);
                    asig = data.post;
                    asignaturas = JSON.parse(asig.custom_fields.asignaturas_lista);

                    //Separar asignaturas por cursos
                    groups[0] = asignaturas.asignaturas_primero;
                    groups[0].name = "Primer Curso";
                    groups[1] = asignaturas.asignaturas_segundo;
                    groups[1].name = "Segundo Curso";
                    groups[2] = asignaturas.asignaturas_tercero;
                    groups[2].name = "Tercer Curso";
                    groups[3] = asignaturas.asignaturas_cuarto;
                    groups[3].name = "Cuarto Curso";
                    groups[4] = asignaturas.optativas;
                    groups[4].name = "Optativas";
                })
                .error(function (err) {
                    defered.reject(err)
                });

            return promise;
        },
        getAsignaturas: function () {
            return asignaturas;
        },
        postAsignaturas: function (datos) {
            asignaturas = datos;
        },
        getGrado: function () {
            return grado;
        },
        postGrado: function (datos) {
            grado = datos;
        },
        getGroups: function () {
            return groups;
        },
    }
    return interfaz;
})

.factory('AsignaturaFactory', [function () {

    var asignatura = [];
    var interfaz = {
        getAsignatura: function () {
            return asignatura;
        },
        postAsignatura: function (datos) {
            asignatura = datos;
        }
    }
    return interfaz;
}])

.factory('ProfesoresFactory', function ($http, $q) {

    var profesores = [];

    var interfaz = {
        initProfesores: function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('http://urgrado.esy.es/api/get_post/?slug=profesores')
                .success(function (data) {
                    defered.resolve(data);
                    profesores = JSON.parse(data.post.custom_fields.lista_profesores[0]);
                })
                .error(function (err) {
                    defered.reject(err)
                });

            return promise;
        },
        getProfesor: function (profId) {

            for (i = 0; i < profesores.length; i++) {
                id = "" + profesores[i].id;
                if (profId == id) {
                    return profesores[i];
                }
            };
            return null;
        },
        getProfesores: function () {
            return profesores;
        },
        postProfesores: function (datos) {
            profesores = datos;
        }
    }
    return interfaz;
})

.factory('NoticiasFactory', function (ConfiguracionFactory, $q, $http) {

    var noticias = [];
    var noticia = {};

    var interfaz = {

        initNoticias: function () {
            var defered = $q.defer();
            var promise = defered.promise;
            var numNoticias = 5;
            if (ConfiguracionFactory.getNumNoticias() != null) { //Si tiene un número de noticias predefinido se obtiene
                numNoticias = ConfiguracionFactory.getNumNoticias();
            }

            $http.get("http://ajax.googleapis.com/ajax/services/feed/load", { params: { "v": "1.0", "num": numNoticias, "q": "http://www.gradosunirioja.es/rssnoticias.xml" } })
                .success(function (data) {
                    defered.resolve(data);
                    //Se guardan las últimas descargadas en la variable noticias 
                    noticias = data.responseData.feed.entries;
                    //Se guardan las noticias por si no hay conexión devolver las últimas descargadas
                    window.localStorage["noticias"] = JSON.stringify(data.responseData.feed.entries); 
                })
                .error(function (err) {
                    defered.reject(err)
                    //En caso de error se asignan las últimas noticias guardadas
                    noticias = JSON.parse(window.localStorage["noticias"]);
                });

            return promise;
        },
        getNoticia: function () {
            return noticia;
        },

        getNoticias: function () {
            return noticias;
        },

        postNoticia: function (datos) {
            noticia = datos;
        },

        postNoticias: function (datos) {
        noticias = datos;
        },

        formatFecha : function (date) {
        fecha = Date.parse(date);
        f = new Date(fecha);
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
        var formatF = "" + diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
        return formatF;
        }
    }
    return interfaz;
})

.factory('ConfiguracionFactory', function (ProfesoresFactory) {

    var noticias = [];
    var noticia = {};

    var interfaz = {
        getNumNoticias: function () {
            return window.localStorage.getItem('numNoticias');
        },

        postNumNoticias: function (num) {
            window.localStorage.setItem( 'numNoticias', num);
        },

        getAsignaturasPrimero: function () {
            return JSON.parse(window.localStorage.getItem('asigPrimero'));
        },

        getAsignaturasSegundo: function () {
            return JSON.parse(window.localStorage.getItem('asigSegundo'));
        },

        getAsignaturasTercero: function () {
            return JSON.parse(window.localStorage.getItem('asigTercero'));
        },

        getAsignaturasCuarto: function () {
            return JSON.parse(window.localStorage.getItem('asigCuarto'));
        },

        getAsignaturasOptativas: function () {
            return JSON.parse(window.localStorage.getItem('asigOptativas'));
        },

        postAsignaturasPrimero: function (datos) {
            window.localStorage.setItem('asigPrimero', JSON.stringify(datos));
        },

        postAsignaturasSegundo: function (datos) {
            window.localStorage.setItem('asigSegundo', JSON.stringify(datos));
        },

        postAsignaturasTercero: function (datos) {
            window.localStorage.setItem('asigTercero', JSON.stringify(datos));
        },

        postAsignaturasCuarto: function (datos) {
            window.localStorage.setItem('asigCuarto', JSON.stringify(datos));
        },

        postAsignaturasOptativas: function (datos) {
            window.localStorage.setItem('asigOptativas', JSON.stringify(datos));
        },

        getGrado: function () {
            return JSON.parse(window.localStorage.getItem('grado'));
        },

        postGrado: function (grado) {
            // Guardar Grado
            window.localStorage.setItem('grado', JSON.stringify(grado));
        }       
    }
    return interfaz;
})


