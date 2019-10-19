(function(){
    var PAT_ADAPTERSERVICE_PLUGIN = {
        // DONE
        searchGroupSearch: function (params) {
            var actionArray = [];
            actionArray[0] = "GroupSearchAdapter";
            actionArray[1] = "GroupSearch";
            actionArray[5] = ProfileService.getAdapterName();

            if (!params) {
                actionArray[2] = JSON.stringify({});
            } else {
                actionArray[2] = JSON.stringify(params);
            }

            return new Promise(function (resolve, reject) {
                cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                    message = JSON.parse(message);
                    for (var i = 0; i < message.length; i++) {
                        message[i] = JSON.parse(message[i]);
                    }
                    resolve(message);
                }, function (error) {
                    reject(error);
                });
            });
        },
        // DONE
        searchNewAutomationPersonSearch: function (params) {
            var actionArray = [];
            actionArray[0] = "NewAutomationPersonSearchAdapter";
            actionArray[1] = "NewAutomationPersonSearch";
            actionArray[5] = ProfileService.getAdapterName();

            if (!params) {
                actionArray[2] = JSON.stringify({});
            } else {
                actionArray[2] = JSON.stringify(params);
            }

            return new Promise(function (resolve, reject) {
                cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                    message = JSON.parse(message);
                    for (var i = 0; i < message.length; i++) {
                        message[i] = JSON.parse(message[i]);
                    }
                    resolve(message);
                }, function (error) {
                    reject(error);
                });
            });
        },
        // DONE
        searchNewPersonSearch: function (params) {
            var actionArray = [];
            actionArray[0] = "NewPersonSearchAdapter";
            actionArray[1] = "NewPersonSearch";
            actionArray[5] = ProfileService.getAdapterName();

            if (!params) {
                actionArray[2] = JSON.stringify({});
            } else {
                actionArray[2] = JSON.stringify(params);
            }

            return new Promise(function (resolve, reject) {
                cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                    message = JSON.parse(message);
                    for (var i = 0; i < message.length; i++) {
                        message[i] = JSON.parse(message[i]);
                    }
                    resolve(message);
                }, function (error) {
                    reject(error);
                });
            });
        },
        searchCall: function (params) {
            var actionArray = [];
            actionArray[0] = "SearchPersonAdapter";
            actionArray[1] = "searchPerson";

            actionArray[5] = ProfileService.getAdapterName();

            var defer = {};
            var promise = new Promise(function (resolveFunc, rejectFunc) {
                defer.resolve = function (data) {
                    resolveFunc(data);
                }

                defer.reject = function (rejectMessage) {
                    rejectFunc(rejectMessage);
                }
            });


            //var object = {"firstName":"تست","lastName":"تستی"};
            actionArray[2] = JSON.stringify(params);

            cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                //console.log('SearchPersonAdapter is: ' , message);
                message = JSON.parse(message);
                for (var i = 0; i < message.length; i++) {
                    message[i] = JSON.parse(message[i]);
                    //message.bgcolor = null;
                }
                defer.resolve(message);

            }, function (error) {
                console.log('error occured getting search data ', error);
                defer.reject(error);
            });

            return promise;
        },
        // DONE
        searchOrganizationCall: function (params) {
            var actionArray = [];
            actionArray[0] = "OrganizationSearchAdapter";
            actionArray[1] = "OrganizationSearch";

            actionArray[5] = ProfileService.getAdapterName();

            var defer = {};
            var promise = new Promise(function (resolveFunc, rejectFunc) {
                defer.resolve = function (data) {
                    resolveFunc(data);
                }

                defer.reject = function (rejectMessage) {
                    rejectFunc(rejectMessage);
                }
            });

            actionArray[2] = JSON.stringify(params);

            cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                message = JSON.parse(message);
                for (var i = 0; i < message.length; i++) {
                    message[i] = JSON.parse(message[i]);
                    message.bgcolor = null;
                }
                defer.resolve(message);

            }, function (error) {
                console.log('error occured getting search data ', error);
                defer.reject(error);
            });

            return promise;
        },
        letterSearchByPersonSearchCall: function (params) {
            var actionArray = [];
            actionArray[0] = "LetterSearchByPersonAdapter";
            actionArray[1] = "letterSearchByPerson";

            actionArray[5] = ProfileService.getAdapterName();

            var defer = {};
            var promise = new Promise(function (resolveFunc, rejectFunc) {
                defer.resolve = function (data) {
                    resolveFunc(data);
                }

                defer.reject = function (rejectMessage) {
                    rejectFunc(rejectMessage);
                }
            });

            actionArray[2] = JSON.stringify(params);

            cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                message = JSON.parse(message);
                for (var i = 0; i < message.length; i++) {
                    message[i] = JSON.parse(message[i]);
                    message.bgcolor = null;
                }
                defer.resolve(message);

            }, function (error) {
                console.log('error occured getting search data ', error);
                defer.reject(error);
            });

            return promise;
        },
        searchLetterCall: function (params) {
            var actionArray = [];
            actionArray[0] = "LetterSearchAdapter";
            actionArray[1] = "searchLetter";

            actionArray[5] = ProfileService.getAdapterName();

            var defer = {};
            var promise = new Promise(function (resolveFunc, rejectFunc) {
                defer.resolve = function (data) {
                    resolveFunc(data);
                }

                defer.reject = function (rejectMessage) {
                    rejectFunc(rejectMessage);
                }
            });

            actionArray[2] = JSON.stringify(params);

            cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                //console.log('SearchPersonAdapter is: ' , message);
                message = JSON.parse(message);
                for (var i = 0; i < message.length; i++) {
                    message[i] = JSON.parse(message[i]);
                    message.bgcolor = null;
                }
                defer.resolve(message);

            }, function (error) {
                console.log('error occured getting search data ', error);
                defer.reject(error);
            });

            return promise;
        },
        searchDraftLetter: function (params) {

            var actionArray = [];
            actionArray[0] = "DraftLetterSearchAdapter";
            actionArray[1] = "searchDraftLetter";

            actionArray[5] = ProfileService.getAdapterName();

            var defer = {};
            var promise = new Promise(function (resolveFunc, rejectFunc) {
                defer.resolve = function (data) {
                    resolveFunc(data);
                }

                defer.reject = function (rejectMessage) {
                    rejectFunc(rejectMessage);
                }
            });

            this.getUserPosts().then(function (userdata) {

                if (!params)
                    params = {};
                params.vrcreator = userdata.personCode;

                actionArray[2] = JSON.stringify(params);

                cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                    //console.log('SearchPersonAdapter is: ' , message);
                    message = JSON.parse(message);
                    for (var i = 0; i < message.length; i++) {
                        message[i] = JSON.parse(message[i]);
                        message.bgcolor = null;
                    }
                    defer.resolve(message);

                }, function (error) {
                    console.log('error occured getting search data ', error);
                    defer.reject(error);
                });
            })
            return promise;

        },
        // DONE
        searchAndViewLetters: function (params) {
            var actionArray = [];
            actionArray[0] = "SearchAndViewLetterAdapter";
            actionArray[1] = "searchAndViewLetter";

            actionArray[5] = ProfileService.getAdapterName();

            var defer = {};
            var promise = new Promise(function (resolveFunc, rejectFunc) {
                defer.resolve = function (data) {
                    resolveFunc(data);
                }

                defer.reject = function (rejectMessage) {
                    rejectFunc(rejectMessage);
                }
            });

            this.getUserPosts().then(function (userdata) {
                if (!params)
                    params = {};
                params.vrPerson = userdata.personCode;

                actionArray[2] = JSON.stringify(params);

                cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                    //console.log('SearchPersonAdapter is: ' , message);
                    message = JSON.parse(message);
                    for (var i = 0; i < message.length; i++) {
                        message[i] = JSON.parse(message[i]);
                        message.bgcolor = null;
                    }
                    defer.resolve(message);

                }, function (error) {
                    console.log('error occured getting search data ', error);
                    defer.reject(error);
                });
            });
            return promise;
        },
        // DONE
        ReceivedLetters: function (params) {
            var actionArray = [];
            actionArray[0] = "ReceivedLettersAdapter";
            actionArray[1] = "ReceivedLetters";

            actionArray[5] = ProfileService.getAdapterName();

            var defer = {};
            var promise = new Promise(function (resolveFunc, rejectFunc) {
                defer.resolve = function (data) {
                    resolveFunc(data);
                }

                defer.reject = function (rejectMessage) {
                    rejectFunc(rejectMessage);
                }
            });

            this.getUserPosts().then(function (userdata) {
                if (!params)
                    params = {};
                params.vrPerson = userdata.personCode;

                actionArray[2] = JSON.stringify(params);

                cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                    //console.log('SearchPersonAdapter is: ' , message);
                    message = JSON.parse(message);
                    for (var i = 0; i < message.length; i++) {
                        message[i] = JSON.parse(message[i]);
                        message.bgcolor = null;
                    }
                    defer.resolve(message);

                }, function (error) {
                    console.log('error occured getting search data ', error);
                    defer.reject(error);
                });
            });
            return promise;
        },
        // DONE
        SentLetters: function (params) {
            var actionArray = [];
            actionArray[0] = "SentLettersAdapter";
            actionArray[1] = "SentLetters";

            actionArray[5] = ProfileService.getAdapterName();

            var defer = {};
            var promise = new Promise(function (resolveFunc, rejectFunc) {
                defer.resolve = function (data) {
                    resolveFunc(data);
                }

                defer.reject = function (rejectMessage) {
                    rejectFunc(rejectMessage);
                }
            });

            this.getUserPosts().then(function (userdata) {
                if (!params)
                    params = {};
                params.vrPerson = userdata.personCode;

                actionArray[2] = JSON.stringify(params);

                cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                    //console.log('SearchPersonAdapter is: ' , message);
                    message = JSON.parse(message);
                    for (var i = 0; i < message.length; i++) {
                        message[i] = JSON.parse(message[i]);
                        message.bgcolor = null;
                    }
                    defer.resolve(message);

                }, function (error) {
                    console.log('error occured getting search data ', error);
                    defer.reject(error);
                });
            });
            return promise;
        },
        // DONE
        ArchivesLetters: function (params) {
            var actionArray = [];
            actionArray[0] = "ArchivesLettersAdapter";
            actionArray[1] = "ArchivesLetters";

            actionArray[5] = ProfileService.getAdapterName();

            var defer = {};
            var promise = new Promise(function (resolveFunc, rejectFunc) {
                defer.resolve = function (data) {
                    resolveFunc(data);
                }

                defer.reject = function (rejectMessage) {
                    rejectFunc(rejectMessage);
                }
            });

            this.getUserPosts().then(function (userdata) {
                if (!params)
                    params = {};
                params.vrPerson = userdata.personCode;

                actionArray[2] = JSON.stringify(params);

                cordova.plugins.adaptercall.callAdapter(actionArray, function (message) {
                    //console.log('SearchPersonAdapter is: ' , message);
                    message = JSON.parse(message);
                    for (var i = 0; i < message.length; i++) {
                        message[i] = JSON.parse(message[i]);
                        message.bgcolor = null;
                    }
                    defer.resolve(message);

                }, function (error) {
                    console.log('error occured getting search data ', error);
                    defer.reject(error);
                });
            });
            return promise;
        }
    }

    Object.assign(adapterService, PAT_ADAPTERSERVICE_PLUGIN);
})();