FormManager.forms.PAT_TP_NewGenerateLetter = function (formKey, angularModule) {

    if (!(this instanceof FormManager.forms.PAT_TP_NewGenerateLetter))
        return new FormManager.forms.PAT_TP_NewGenerateLetter(formKey);

    BaseFormModule.call(this, formKey, "PAT_TP_NewGenerateLetter", angularModule);

    var _that = this;

    this.getClassName_ = function () {
        // return "com.fanap.fanrp.pat.business.dto.LetterFlowDTO";
        return "com.fanap.midhco.pat.process.PAT_TP_NewGenerateLetter_1";
    }

    this.getTemplateURL = function () {
        return "js/plugins/PAT/forms/PAT_TP_NewGenerateLetter/PAT_TP_NewGenerateLetter.html";
    }

    this.getExtraCSS = function () {
        return [];
    }

    this.getExtraJS = function () {
        return [];
    }

    this.isComposite = function () {
        return true;
    }

    this.getDate = function (date) {
        return new Promise(function (resolve, reject) {
            var actionArray = { "date": date || "today" };
            cordova.plugins.adaptercall.getPersianDate(actionArray,
                function (message) {
                    resolve({
                        date: message.date,
                        jdate: new JDate(message.date).getTime()
                    });
                },
                function (error) {
                    reject(error);
                });
        });
    }

    this.batchSqlLoad = function (sqlDescriptorArray, $scope) {
        // SAMPLE: params.sqlDescriptorMap = JSON.stringify({ "1": { sqlKey: "METHOD_CategoryElements", columnNames: ["id", "code", "value"], instanceId: sqlInsId, params: [{ "code": "HSEPublishPermitStatus" }] } });
        var params = {};
        var descriptors = {};
        var sqlInsId = _that.getProcessObject().processInstanceId + "_" + _that.getProcessObject().threadIndex;
        for (var i = 0; i < sqlDescriptorArray.length; i++) {
            sqlDescriptorArray[i].instanceId = sqlInsId;
            descriptors[i] = sqlDescriptorArray[i];
        }
        params.sqlDescriptorMap = JSON.stringify(descriptors);
        params.engineName = _that.getProcessObject().engineName;
        return new Promise(function (resolve, reject) {
            adapterService.sqlLoad(params).then(function parseResult(res) {
                var content = JSON.parse(JSON.parse(res).content);
                for (var j = 0; j < sqlDescriptorArray.length; j++) {
                    try {
                        content[j] = JSON.parse(content[j]);
                    } catch (exception) {
                        console.error("Exception in parsing query number: " + j, ", Exception description: ", exception);
                        console.error("Query: ", sqlDescriptorArray[j]);
                        console.error("Result: ", content[j]);
                        if($scope) 
                            $scope.formHasError = true;
                    }
                }
                resolve(content);
            }, function (err) {
                if($scope) 
                    $scope.formHasError = true;
                reject(err);
            });
        });
    }

    this.loadSignature = function(userId, $scope){
        return new Promise(function(resolve, reject){
            if (!userId) 
                reject("Empty userId!");
            var sqlDescriptorArray = [
                {
                    "sqlKey":"METHOD_loadSignature",
                    "columnNames":["result"],
                    "params":[{"userName":userId.toString()}],
                }
            ];

            _that.batchSqlLoad(sqlDescriptorArray, $scope).then(function (res) {
                try {
                    if(res[0][0].result)
                        resolve(res[0][0].result);
                    else
                        reject();
                } catch (err) {
                    reject(err);
                }
            }, function(err){
                reject(err);
            });
        });  
    }

    this.defineController = function () {
        var controllerName = _that.getControllerName();
        console.log('getFormKey ', _that.getFormKey());

        _that.getAngularModule().register.controller(controllerName, function ($scope, $q, $rootScope, $state, $http, notificationService, attachmentService, pluginRendererService, pluginManagerService, searchService, $sce) {

            // setInterval(function(){
            //     var x = 0; // FOR DEBUGGGING
            //     var thatScope = $scope;
            // },5000);

            $scope.isLoading = true;
            $scope.dragControlListeners = {
                accept: function(sourceItemHandleScope, destSortableScope){
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                }
            }

            $scope.dzOptions = null;
            $scope.isAttachmentMutable = true;
            $scope.onAttachmentSend = function(){
                setTimeout(function(){
                    $scope.openAttachmentListModal();
                }, 5000);
            }
            uploadService($scope, $http, $rootScope);


            $scope.innerDzOptions = {};
            $scope.innerDzOptions.dzMethods = {};
            $scope.innerDzOptions.dzOptions = {
                maxFiles: 1,
                url: config.fileServerUrl + 'fileServer/upload',
                paramName: 'ph',
                maxFilesize: '50',
                acceptedFiles: null,
                acceptedMimeTypes: null,
                addRemoveLinks: true
            }
            $scope.innerDzOptions.dzCallbacks = {
                'addedfile': function (file) {
                    console.log(file);
                    $scope.newFile = file;
                },
                'success': function (file, response) {
                    $scope.attachFileKey = response;
        
                    $scope.fileData = {
                        name : file.name,
                        key : response,
                        size: file.size
                    };
        
                    $scope.letter.bodyFile = $scope.fileData.key;
                    $scope.letter.bodyFile_trusted = $sce.trustAsResourceUrl(config.fileServerUrl + 'fileServer/download?key=' + $scope.fileData.key);                      
        
                    var persistUrl = config.fileServerUrl + 'fileServer/persist?key=' + response;
                    $http({
                        method: "GET",
                        url: persistUrl,
                        responseType: 'text',
                        headers: {},
                        transformResponse: [function (data) {
                            // Do whatever you want!
                            console.log(data);
                            return data;
                        }]
                    }).then(function (data) {
                        console.log(data);
                        $scope.iconattach = "fa fa-paperclip";
                        $('.dropzone .dz-preview .dz-remove').attr('style', 'display: block !important');
                    }, function (data) {
                        console.log(data);
                        $scope.removeLetterBodyFile();
                        notificationService.showAlert(`<div style='direction: rtl'>بارگذاری ناموفق بود! لطفا دوباره تلاش نمایید.</div>`, BundleService.getKeyValueFromBundle("ALERT"), "fa fa-minus-circle red");
                    });
                },
                'error': function (file, response) {
                    console.log(response);
                },
                'removedfile': function() {
                    $scope.fileData = null;
                    $scope.removeLetterBodyFile();
                }
            };


            $scope.pat = {};
            $rootScope.pat = $scope.pat;

            $scope.loaders = {};

            $scope.toolbarTitle = BundleService.getKeyValueFromBundle(_that.getProcessObject().processName);

            $scope.showFlowPanelTree = false;
            $scope.showLetterPanelTree = false;

            $scope.backButton = function () {
                $rootScope.loadingNew = null;
                $state.go('base.CartableDisplayState');
            }

            $scope.downloadItem = function (fileKey) {
                var key;
                try {
                    key = JSON.parse(fileKey.key)[0].key;
                } catch (exception) {
                    console.log("bodyFile is not JSON, using as key string. It is probably using a template.");
                    key = fileKey.key;
                }
                adapterService.downloadFile({ url: config.fileServerUrl + 'fileServer/download?key=' + key });
            }

            $scope.showCommentArea = function(item){
                $scope.activeItemForComment = item;
                $scope.commentAreaModal.show();
            }

            if (!$scope.toolbarTitle) {
                $scope.toolbarTitle = _that.getProcessObject().processName;
            }

            $scope.removePersonTag = function (index, scope) {
                $scope.$applyAsync(function () {
                    $scope[scope].splice(index, 1);
                })
            }

            $scope.toggleFlowPanel = function () {
                $scope.$applyAsync(function () {
                    $scope.showFlowPanelTree = !$scope.showFlowPanelTree;
                    
                    function expandTree(tree){
                        for(var i = 0; i < tree.length; i++){
                            tree[i].value.displayVerifyDate = $scope.convertTimestampToDateTime(tree[i].value.verifyDate);
                            $scope.showSlide(tree[i]);
                            if(tree[i].children)
                                expandTree(tree[i].children);
                        }
                    }
                    expandTree($scope.treeStructure);
                });
            }

            $scope.showGroupSearchModal = function(target){
                $scope.modalGroupSearchResultArray = [];
                $scope.searchTarget = target;
                groupSearchModal.show();
            }

            $scope.toggleLetterPanel = function () {
                $scope.$applyAsync(function () {
                    $scope.showLetterPanelTree = !$scope.showLetterPanelTree;
                });
            }

            $scope.removeLetterBodyFile = function(){
                $scope.$applyAsync(function () {
                    $scope.fileData = null;
                    $scope.letter.bodyFile = null;
                    $scope.letter.bodyFile_trusted = null;
                    $scope.innerDzOptions.dzMethods.removeFile($scope.newFile);
                });
            }

            $scope.promiseLoadOrganizationTags = function (query) {
                $scope.$apply(function () {
                    $scope.toOrganizationSet_wait = true;
                });

                var defer = {};

                var promise = new Promise(function (resolve, reject) {
                    defer.resolve = function (data) {
                        resolve(data);
                    }

                    defer.reject = function (rejectCause) {
                        reject(rejectCause);
                    }
                });

                var params = { 
                    "connectionName": _that.getProcessObject().engineName,
                    "searchName": "OrganizationSearch",
                    "filters": [
                        {
                            name: "title",
                            value: query,
                            type: "Edm.String",
                            operator: "substringof"
                        }
                    ]
                }

                adapterService.universalSearch(params).then(function (data) {
                    $scope.$apply(function () {
                        $scope.toOrganizationSet_wait = false;
                    });
                    defer.resolve(data);
                }).catch(function (e) {
                    $scope.$apply(function () {
                        $scope.toOrganizationSet_wait = false;
                    });
                    defer.reject(e);
                });

                setTimeout(function () {
                    $scope.toOrganizationSet_wait = false;
                }, 30000);

                return promise;
            }

            $scope.searchNewPersonById = function (query, loaderName) {
                $scope.$applyAsync(function () {
                    $scope.loaders[loaderName] = true;
                });
                
                var params = {
                    "connectionName": _that.getProcessObject().engineName,
                    searchName: "NewPersonSearch",
                    to: 10000,
                    filters: [
                        {
                            name: "id",
                            value: query,
                            type: "Edm.Decimal",
                            operator: "eq"
                        }
                    ]
                }
      
                
                return new Promise(function(resolve, reject){
                    adapterService.universalSearch(params).then(function (data) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                        });
                        resolve(data);
                    }).catch(function (e) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                        });
                        console.log(e);
                        reject(e);
                    });
                });
            }

            $scope.searchNewPersonByIdAndAutoAssign = function(id){
                if(!Array.isArray(id)){
                    id = [id];
                }
                $scope.searchNewPersonById(id).then(function(resultSet){
                    $scope.$applyAsync(function () {
                        for(var res of resultSet){
                            for(var dest of ['toPersonSet', 'ccPersonSet', 'bccPersonSet', 'signer']){
                                if($scope[dest])
                                    for(var person of $scope[dest]){
                                        if(person.id == res.id){
                                            console.log("XProcessing " + dest + ": " + res.id + ". Assigning: " + person.id + " to " + res.id);
                                            person.first_name = res.first_name;
                                            person.last_name = res.last_name;
                                        }
                                    }
                            }
                            
                            if($scope.incomingLetter && $scope.incomingLetter.sender){
                                if($scope.incomingLetter.sender.id == res.id){
                                    console.log("XProcessing: " + res.id + ". Assigning: " + $scope.incomingLetter.sender.id + " to " + res.id);
                                    $scope.incomingLetter.sender.first_name = res.first_name;
                                    $scope.incomingLetter.sender.last_name = res.last_name;
                                }
                            }
                        }
                    });
                }, function(err){
                    console.log("Error in search: ", err);
                });
            }

            $scope.searchNewPersonTags = function (query, loaderName) {
                $scope.$applyAsync(function () {
                    $scope.loaders[loaderName] = true;
                });

                var params = { 
                    "connectionName": _that.getProcessObject().engineName,
                    searchName: "NewPersonSearch",
                    filters: [
                        {
                            name: "title",
                            value: query,
                            type: "Edm.String",
                            operator: "substringof"
                        }
                    ]
                    // "rolelaboractive": "1",
                }
                
                return new Promise(function(resolve, reject){
                    adapterService.universalSearch(params).then(function (data) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                        });
                        resolve(data);
                    }).catch(function (e) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                        });
                        console.log(e);
                        reject(e);
                    });
                });
            }

            $scope.searchNewAutomationPersonTags = function (query, loaderName) {
                $scope.$applyAsync(function () {
                    $scope.loaders[loaderName] = true;
                });

                var params = { 
                    "connectionName": _that.getProcessObject().engineName,
                    searchName: "NewAutomationPersonSearch",
                    filters: [
                        {
                            name: "title",
                            value: query,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "rootid",
                            value: $scope.rootid,
                            type: "Edm.Decimal",
                            operator: "eq"
                        }
                    ]
                    // "rolelaboractive": "1",
                }
                
                return new Promise(function(resolve, reject){
                    adapterService.universalSearch(params).then(function (data) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                        });
                        resolve(data);
                    }).catch(function (e) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                        });
                        console.log(e);
                        reject(e);
                    });
                });
            }

            $scope.selectPersonFromSearchModal = function(item){
                var selectedArray;
                switch($scope.searchTarget){
                    case "signer":
                        selectedArray = $scope.signer;
                        break;
                    case "receiverReferralSet":
                        selectedArray = $scope.pat.receiverReferralSet;
                        break;
                    case "ccPersonSet":
                        selectedArray = $scope.ccPersonSet;
                        break;
                    case "bccPersonSet":
                        selectedArray = $scope.bccPersonSet;
                        break;
                    case "toPersonSet":
                        selectedArray = $scope.toPersonSet;
                        break;
                }

                var index = selectedArray.findIndex(function(val){
                    if(val.id == item.id)
                        return true;
                })

                if(index === -1){
                    selectedArray.push(item);
                }

                console.log("Added Person: ", item);
                searchPersonModal.hide();
            }

            $scope.showPersonSearchModal = function(target){
                $scope.modalPersonSearchResultArray = [];
                $scope.searchTarget = target;
                searchPersonModal.show();
            }

            $scope.searchGroupForModal = function(gutitle, loaderName, lastIndex){
                var params = {
                    searchName: "GroupSearch",
                    filters: [
                        {
                            name: "gutitle",
                            value: gutitle,
                            type: "Edm.String",
                            operator: "substringof"
                        }
                    ]
                }
                params.connectionName = _that.getProcessObject().engineName;
                $scope.$applyAsync(function () {
                    $scope.loaders[loaderName] = true;
                });

                if(lastIndex){
                    params.from = lastIndex + 1;
                    params.to = lastIndex + 10;
                }
                
                return new Promise(function(resolve, reject){
                    adapterService.universalSearch(params).then(function (data) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                            if(lastIndex){
                                Array.prototype.push.apply($scope.modalGroupSearchResultArray, data);
                            } else {
                                $scope.modalGroupSearchResultArray = data;
                            }
                        });
                        resolve(data);
                    }).catch(function (e) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                        });
                        console.log(e);
                        reject(e);
                    });
                });
            }

            $scope.selectGroupFromSearchModal = function(item){
                var selectedArray;
                switch($scope.searchTarget){
                    case "signer":
                        selectedArray = $scope.signer;
                        break;
                    case "receiverReferralSet":
                        selectedArray = $scope.pat.receiverReferralSet;
                        break;
                    case "ccPersonSet":
                        selectedArray = $scope.ccPersonSet;
                        break;
                    case "bccPersonSet":
                        selectedArray = $scope.bccPersonSet;
                        break;
                    case "toPersonSet":
                        selectedArray = $scope.toPersonSet;
                        break;
                }

                var sqlDescriptorArray = [];
                sqlDescriptorArray.push(
                    {
                        "sqlKey": "METHOD_LoadUsersByGId",
                        "columnNames": ["vrPerson","labor","vrPost","vrOrganization","vrTitle","vrPostId","vrOrganizationId"],
                        "params": [{ "gId": item.gid }]
                    }
                );

                _that.batchSqlLoad(sqlDescriptorArray, $scope).then(function (res) {
                    console.log("batchSqlLoad_unitChange Result: ", res);
                    var tempArray = [];
                    for(var i = 0; i < res[0].length; i++){
                        if(res[0][i].vrPerson){
                            var index = selectedArray.findIndex(function(val){
                                if(val.id == res[0][i].vrPerson)
                                    return true;
                            });

                            if(index === -1){
                                tempArray.push(res[0][i]);
                            }
                        }
                    }
                    
                    replaceNoDataInTree(tempArray);
                    for (var i = 0; i < tempArray.length; i++) {
                        selectedArray.push({});
                        selectedArray[selectedArray.length - 1].vrPersonValue = tempArray[i].value;
                        selectedArray[selectedArray.length - 1].prefix = tempArray[i].vrTitle;
                        selectedArray[selectedArray.length - 1].role_title = tempArray[i].vrPost;
                        selectedArray[selectedArray.length - 1].ou_title = tempArray[i].vrOrganization;
                        selectedArray[selectedArray.length - 1].rlid = tempArray[i].labor;
                        selectedArray[selectedArray.length - 1].ou_id = tempArray[i].vrOrganizationId;
                        selectedArray[selectedArray.length - 1].role_id = tempArray[i].vrPostId;
                        selectedArray[selectedArray.length - 1].id = tempArray[i].vrPerson;
                    }

                    var tempArray2 = [];
                    for(var person of tempArray){
                        tempArray2.push(person.vrPerson);
                    }
                    
                    $scope.searchNewPersonByIdAndAutoAssign(tempArray2);
                    $scope.$applyAsync();
                }, function (err) {
                    console.log("batchSqlLoad_unitChange Error: ", err);
                    $scope.$applyAsync(function () {
     
                    });
                });

                console.log("Added Person: ", item);
                groupSearchModal.hide();
            }

            $scope.searchPersonForModal = function(first_name, last_name, loaderName, lastIndex){
                var params = {
                    searchName: "NewAutomationPersonSearch",
                    filters: [
                        {
                            name: "first_name",
                            value: first_name,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "last_name",
                            value: last_name,
                            type: "Edm.String",
                            operator: "substringof"
                        }
                    ]
                }
                params.connectionName = _that.getProcessObject().engineName;
                $scope.personSearchResultArray = [];

                $scope.$applyAsync(function () {
                    $scope.loaders[loaderName] = true;
                });

                if(lastIndex){
                    params.from = lastIndex + 1;
                    params.to = lastIndex + 10;
                }
                
                return new Promise(function(resolve, reject){
                    switch($scope.searchTarget){
                        case "signer":
                        case "receiverReferralSet":
                            params.filters.push({
                                name: "rootid",
                                value: $scope.rootid,
                                type: "Edm.Decimal",
                                operator: "eq"
                            });
                            params.searchName = "NewAutomationPersonSearch";
                            break;
                        case "ccPersonSet":
                        case "bccPersonSet":
                        case "toPersonSet":
                            params.searchName = "NewPersonSearch";
                            break;
                    }
                    adapterService.universalSearch(params).then(function (data) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                            if(lastIndex){
                                Array.prototype.push.apply($scope.modalPersonSearchResultArray, data);
                            } else {
                                $scope.modalPersonSearchResultArray = data;
                            }
                        });
                        resolve(data);
                    }).catch(function (e) {
                        $scope.$applyAsync(function () {
                            $scope.loaders[loaderName] = false;
                        });
                        console.log(e);
                        reject(e);
                    });
                });
            }

            setTimeout(function () {
                $('#toolbarTitle').text($scope.toolbarTitle);
            }, 500);

            var isFormComplete = function () {
                if( $scope.signer[0] == undefined || 
                    $scope.signer[0].id == undefined || 
                    $scope.letter.subject == undefined ||
                    $scope.letter.subject.trim().length == 0 ||
                    $scope.letterPriority.value == undefined ||
                    $scope.letterSecurity.value == undefined ||
                    $scope.letterPriority.value.id == undefined ||
                    $scope.letterSecurity.value.id == undefined ){
                        return false
                }
                
                if( $scope.actionType == 'SEND' &&
                    !$scope.pat.receiverReferralSet.length){
                        return false;
                }

                if( !$scope.toPersonSet.length &&
                    !$scope.toOrganizationSet.length){
                        return false;
                }

                if( $scope.isSigned && !$scope.receiverReferralSet.length){
                    return false;
                }

                if(!$scope.docType.value){
                    return false;
                }
                
                if( $scope.docType.value.id == '383' && 
                    (!$scope.letter.body || !$scope.letter.body.length)){
                    return false;
                }
                
                if( $scope.docType.value.id != '383' && 
                    (!$scope.letter.bodyFile && !$scope.fileData)){
                    return false;
                }

                for(var i = 0; i < $scope.letter.relatedLetter.length; i++){
                    if(!$scope.letter.relatedLetter[i].relatedLetterType || !$scope.letter.relatedLetter[i].relatedLetterType.meta || !$scope.letter.relatedLetter[i].relatedLetterType.meta.id)
                        return "نوع نامه مرتبط را انتخاب کنید.";                        
                }

                for(var i = 0; i < $scope.toPersonSet.length; i++){
                    if($scope.signer[0].id == $scope.toPersonSet[i].id){
                        return "گیرنده و رونوشت نباید با امضا کننده یکسان باشد.";
                    }
                }

                for(var i = 0; i < $scope.ccPersonSet.length; i++){
                    if($scope.signer[0].id == $scope.ccPersonSet[i].id){
                        return "گیرنده و رونوشت نباید با امضا کننده یکسان باشد.";
                    }
                }

                for(var i = 0; i < $scope.bccPersonSet.length; i++){
                    if($scope.signer[0].id == $scope.bccPersonSet[i].id){
                        return "گیرنده و رونوشت نباید با امضا کننده یکسان باشد.";
                    }
                }

                return true;
            }

            var serializeForm = function () {
                var deferred = $q.defer();

                var formError = isFormComplete()
                if(formError !== true){
                    notificationService.showAlert(`<div style='direction: rtl'>${formError || "لطفا موارد اجباری را تکمیل نمایید."}</div>`, BundleService.getKeyValueFromBundle("ALERT"), "fa fa-minus-circle red");
                    deferred.reject()
                    return deferred.promise;
                }

                var out = {
                    "letter": {
                        "ccPersonSet": [
                            // WILL BE FILLED ON LOOP
                        ],
                        "bccPersonSet": [
                            // WILL BE FILLED ON LOOP                            
                        ],
                        "body": $scope.docType.value.id == '383' ? $scope.letter.body : null,
                        "bodyFile": $scope.docType.value.id != '383' ? JSON.stringify([$scope.fileData]) : null,
                        "receiverReferralSet": [
                            // WILL BE FILLED ON LOOP
                        ],
                        "vrCreator": $scope.letter.vrCreator,
                        "fromPerson": {
                            "vrPerson": $scope.letter.fromPerson.vrPerson
                        },
                        "actionType": $scope.actionType,
                        "subject": $scope.letter.subject,
                        "priority": {
                            "id": parseInt($scope.letterPriority.value.id)
                        },
                        "security": {
                            "id": parseInt($scope.letterSecurity.value.id)
                        },
                        "keywords": $scope.letter.keywords ? $scope.letter.keywords : null,
                        "letterType": {
                            "id": $scope.letterType.value ? parseInt($scope.letterType.value.id) : null
                        },
                        "signer": {
                            "sign": $scope.signer[0].sign,
                            "personName": $scope.signer[0].title || $scope.signer[0].first_name +" "+ $scope.signer[0].last_name,
                            "vrPerson": $scope.signer[0].id,
                            "vrPost": $scope.signer[0].role_title || null,
                            "vrTitle": $scope.signer[0].prefix,
                            "vrOrganization": $scope.signer[0].ou_title || null,
                            "firstname": $scope.signer[0].first_name,
                            "lastname": $scope.signer[0].last_name,
                            "labor": (($scope.signer[0].rlid!==null)&&($scope.signer[0].rlid!==undefined)) ? $scope.signer[0].rlid.toString() : null,
                            "vrOrganizationId": $scope.signer[0].ou_id || null,
                            "vrPostId": $scope.signer[0].role_id || null
                        },
                        "docType": {
                            "id": parseInt($scope.docType.value.id)
                        },
                        "toPersonSet": [
                            // WILL BE FILLED ON LOOP                            
                        ],
                        "toOrgSet": [
                            // WILL BE FILLED ON LOOP                            
                        ],
                        "relatedLetter": [
                            // WILL BE FILLED ON LOOP                                                        
                        ],
                        "attachmentSet": [
                            // WILL BE FILLED ON LOOP                                                        
                        ],
                        "className_": "com.fanap.fanrp.pat.datamodel.Letter"
                    }
                }

                for(var i = 0; i < $scope.letter.attachmentSet.length; i++){
                    if($scope.letter.attachmentSet[i].vrAttachmentDocument)
                        out.letter.attachmentSet.push({
                            vrAttachmentDocument: $scope.letter.attachmentSet[i].vrAttachmentDocument,
                            description: $scope.letter.attachmentSet[i].description || null,
                            objectHashCode: ""
                        });
                }

                function convertToTimestamp(date){
                    console.log(new JDate(date).getTime());
                    return new JDate(date).getTime();
                }

                for(var i = 0; i < $scope.letter.relatedLetter.length; i++){
                    out.letter.relatedLetter.push({
                        "letter": {
                            "id": parseInt($scope.letter.relatedLetter[i].letter.id),
                            "letterNo": $scope.letter.relatedLetter[i].letter.letterNo,
                            "subject": $scope.letter.relatedLetter[i].letter.subject
                        },
                        "objectHashCode": "",
                        "relatedLetterType": { 
                            "id": parseInt($scope.letter.relatedLetter[i].relatedLetterType.meta.id)
                        }
                    });
                }

                for(var i = 0; i < $scope.ccPersonSet.length; i++){
                    out.letter.ccPersonSet.push({
                        "deadline": $scope.ccPersonSet[i].deadline ? convertToTimestamp($scope.ccPersonSet[i].deadline) : null,
                        "description": $scope.ccPersonSet[i].description || null,
                        "personName": $scope.ccPersonSet[i].vrPersonValue || $scope.ccPersonSet[i].title || $scope.ccPersonSet[i].first_name +" "+ $scope.ccPersonSet[i].last_name,
                        "vrPerson": $scope.ccPersonSet[i].id,
                        "vrPost": $scope.ccPersonSet[i].job_title || $scope.ccPersonSet[i].role_title || null,
                        "vrTitle": $scope.ccPersonSet[i].prefix,
                        "vrOrganization": $scope.ccPersonSet[i].ou_title || null,
                        "lastname": $scope.ccPersonSet[i].last_name,
                        "firstname": $scope.ccPersonSet[i].first_name,
                        "labor": (($scope.ccPersonSet[i].rlid!==null)&&($scope.ccPersonSet[i].rlid!==undefined)) ? $scope.ccPersonSet[i].rlid.toString() : null,
                        "vrOrganizationId": $scope.ccPersonSet[i].ou_id || null,
                        "vrPostId": $scope.ccPersonSet[i].xjob_id || $scope.ccPersonSet[i].role_id || null,
                        "order": i + 1
                    });
                }

                for(var i = 0; i < $scope.bccPersonSet.length; i++){
                    out.letter.bccPersonSet.push({
                        "deadline": $scope.bccPersonSet[i].deadline ? convertToTimestamp($scope.bccPersonSet[i].deadline) : null,
                        "description": $scope.bccPersonSet[i].description || null,
                        "personName": $scope.bccPersonSet[i].vrPersonValue || $scope.bccPersonSet[i].title || $scope.bccPersonSet[i].first_name +" "+ $scope.bccPersonSet[i].last_name,
                        "vrPerson": $scope.bccPersonSet[i].id,
                        "vrPost": $scope.bccPersonSet[i].job_title || $scope.bccPersonSet[i].role_title || null,
                        "vrTitle": $scope.bccPersonSet[i].prefix,
                        "vrOrganization": $scope.bccPersonSet[i].ou_title || null,
                        "lastname": $scope.bccPersonSet[i].last_name,
                        "firstname": $scope.bccPersonSet[i].first_name,
                        "labor": (($scope.bccPersonSet[i].rlid!==null)&&($scope.bccPersonSet[i].rlid!==undefined)) ? $scope.bccPersonSet[i].rlid.toString() : null,
                        "vrOrganizationId": $scope.bccPersonSet[i].ou_id || null,
                        "vrPostId": $scope.bccPersonSet[i].xjob_id || $scope.bccPersonSet[i].role_id || null,
                        "order": i + 1
                    });
                }

                for(var i = 0; i < $scope.pat.receiverReferralSet.length; i++){
                    out.letter.receiverReferralSet.push({
                        "deadline": $scope.pat.receiverReferralSet[i].deadline ? convertToTimestamp($scope.pat.receiverReferralSet[i].deadline) : null,
                        "description": $scope.pat.receiverReferralSet[i].description ? $scope.pat.receiverReferralSet[i].description : null,
                        "personName": $scope.pat.receiverReferralSet[i].vrPersonValue || $scope.pat.receiverReferralSet[i].title || $scope.pat.receiverReferralSet[i].first_name +" "+ $scope.pat.receiverReferralSet[i].last_name,
                        "vrPerson": $scope.pat.receiverReferralSet[i].id,
                        "vrPost": $scope.pat.receiverReferralSet[i].job_title || $scope.pat.receiverReferralSet[i].role_title || null,
                        "vrTitle": $scope.pat.receiverReferralSet[i].prefix,
                        "vrOrganization": $scope.pat.receiverReferralSet[i].ou_title || null,
                        "firstname": $scope.pat.receiverReferralSet[i].first_name,
                        "lastname": $scope.pat.receiverReferralSet[i].last_name,
                        "labor": (($scope.pat.receiverReferralSet[i].rlid!==null)&&($scope.pat.receiverReferralSet[i].rlid!==undefined)) ? $scope.pat.receiverReferralSet[i].rlid.toString() : null,
                        "vrOrganizationId": $scope.pat.receiverReferralSet[i].ou_id || null,
                        "vrPostId": $scope.pat.receiverReferralSet[i].xjob_id || $scope.pat.receiverReferralSet[i].role_id || null,
                    });

                }

                for(var i = 0; i < $scope.toPersonSet.length; i++){
                    out.letter.toPersonSet.push({
                        "personName": $scope.toPersonSet[i].vrPersonValue || $scope.toPersonSet[i].title || $scope.toPersonSet[i].first_name +" "+ $scope.toPersonSet[i].last_name,
                        "vrPerson": $scope.toPersonSet[i].id,
                        "vrPost": $scope.toPersonSet[i].job_title || $scope.toPersonSet[i].role_title || null,
                        "vrTitle": $scope.toPersonSet[i].prefix,
                        "vrOrganization": $scope.toPersonSet[i].ou_title || null,
                        "lastname": $scope.toPersonSet[i].last_name,
                        "firstname": $scope.toPersonSet[i].first_name,
                        "labor": (($scope.toPersonSet[i].rlid!==null)&&($scope.toPersonSet[i].rlid!==undefined)) ? $scope.toPersonSet[i].rlid.toString() : null,
                        "vrOrganizationId": $scope.toPersonSet[i].ou_id || null,
                        "vrPostId": $scope.toPersonSet[i].xjob_id || $scope.toPersonSet[i].role_id || null,
                        "order": i + 1
                    });
                }

                for(var i = 0; i < $scope.toOrganizationSet.length; i++){
                    out.letter.toOrgSet.push({
                        "vrTitle": $scope.toOrganizationSet[i].title,
                        "vrOrganization": $scope.toOrganizationSet[i].id,
                        "vrPost": null,
                        "order": i + 1
                    });
                }

                if(!out.letter.toPersonSet.length) 
                    delete out.letter.toPersonSet;

                if(!out.letter.ccPersonSet.length) 
                    delete out.letter.ccPersonSet;

                if(!out.letter.bccPersonSet.length) 
                    delete out.letter.bccPersonSet;

                if(!out.letter.relatedLetter.length) 
                    delete out.letter.relatedLetter;

                if(out.letter.letterType.id == null) 
                    delete out.letter.letterType;

                if(out.letter.body == null) 
                    delete out.letter.body;
                
                if(out.letter.bodyFile == null) 
                    delete out.letter.bodyFile;

                if(!out.letter.receiverReferralSet.length) 
                    delete out.letter.receiverReferralSet;

                if($scope.actionType == 'SEND'){
                    deferred.resolve(out);                
                    console.log("Sent JSON: ", out);
                } else if($scope.actionType == 'ARCHIVE'){
                    deferred.resolve(out);                
                    console.log("Sent JSON: ", out);
                } else if($scope.actionType == 'SUBMIT'){
                    _that.loadSignature($scope.signer[0].id).then(function(signature){
                        out.letter.signer.sign = signature;
                        deferred.resolve(out);
                        console.log("Sent JSON: ", out);
                    }, function(){
                        // notificationService.showAlert("خطا در دریافت امضا", BundleService.getKeyValueFromBundle("ALERT"), "fa fa-minus-circle red");
                        deferred.resolve(out);
                        console.log("Sent JSON: ", out);
                    });
                } else {
                    deferred.reject("Sending form data failed: Unknown actionType");
                    console.error("No send type have been chosen!");
                }
                
                return deferred.promise;
            }

            var serializeEventKey = _that.getFormKey() + "_serialize";
            $scope.$on(serializeEventKey, function (event, listener) {
                serializeForm().then(function (serializedData) {
                    console.log('_that.getFormKey() ', _that.getFormKey());
                    listener.notify(serializedData);
                });
            });

            $scope.convertTimestampToDateTime = function(timestamp){
                console.log("converting date...");
                return new JDate(parseInt(timestamp)).toLocaleStringWithTime();
            }

            var restoreForm = function (formData) {
                console.log("formData: ", formData);
                $scope.letter = formData[0].objectSentToUI;
                $scope.pat.receiverReferralSet = [];
                $scope.letterPriority = {};
                $scope.letterSecurity = {};
                $scope.docType = {};
                $scope.letterType = {};
                $scope.rootid = null;
                
                $scope.selectedRelatedLetterIndex = 0;
                $scope.PATDocTypeArray = [
                    {code: "FILE", id: "385", value: "فایل"},
                    {code: "BYCK", id: "383", value: "پرونده جدید با ویرایشگر داخلی"}
                ];

                // UserPostsService.getUserCode().then(function(res){
                //     console.log("getUserCode: ", res);
                //     $scope.letter.fromPerson = {
                //         vrPerson: res
                //     }
                //     $scope.letter.vrCreator = res;
                //     if($scope.myId === undefined)
                //         $scope.myId = res;
                // }, function(err){
                //     console.error("Can not get UserID. Error: ", err);
                // });

                var sqlDescriptorArray = [];
                sqlDescriptorArray.push(
                    {
                        "sqlKey": "METHOD_getCategoryElementsByCatCode",
                        "columnNames": ["id", "value", "code"],
                        "params": [{ "catCode": "PATLetterPriority" }]
                    },
                    {
                        "sqlKey": "METHOD_getCategoryElementsByCatCode",
                        "columnNames": ["id", "value", "code"],
                        "params": [{ "catCode": "PATSecurity" }]
                    },
                    {
                        "sqlKey": "METHOD_getCategoryElementsByCatCode",
                        "columnNames": ["id", "value", "code"],
                        "params": [{ "catCode": "PATLetterType" }]
                    },
                    {
                        "sqlKey": "METHOD_getCategoryElementsByCatCode",
                        "columnNames": ["id", "value", "code"],
                        "params": [{ "catCode": "PATRelatedLetterType" }]
                    },
                    {
                        "sqlKey":"METHOD_getComByUserVo",
                        "columnNames":["result"],
                        "params":[]
                    },
                    {
                        "sqlKey":"METHOD_patGetCurrentPerson",
                        "columnNames":["id","value"],
                        "params":[]
                    }
                );
    

                _that.batchSqlLoad(sqlDescriptorArray, $scope).then(function (res) {
                    console.log("batchSqlLoad_unitChange Result: ", res);
                    $scope.signer = $scope.letter.signer || [];
                    $scope.PATLetterPriorityArray = res[0];
                    $scope.letterPriority.value = $scope.PATLetterPriorityArray[2];
                    $scope.PATSecurityArray = res[1];
                    $scope.letterSecurity.value = $scope.PATSecurityArray[1];
                    $scope.PATLetterTypeArray = res[2];
                    $scope.PATRelatedLetterTypeArray = res[3];
                    $scope.rootid = parseInt(res[4][0].result);
                    $scope.myId = res[5][0].id;
                    $scope.letter.fromPerson = {
                        vrPerson: res[5][0].id
                    }
                    $scope.letter.vrCreator = res[5][0].id;
                    $scope.toOrganizationSet = $scope.letter.toOrgSet || [];
                    $scope.toPersonSet = $scope.letter.toPersonSet || [];
                    $scope.ccPersonSet = $scope.letter.ccPersonSet || [];
                    $scope.bccPersonSet = $scope.letter.bccPersonSet || [];
                    $scope.letter.relatedLetter = $scope.letter.relatedLetter || [];
                    $scope.letter.attachmentSet = $scope.letter.attachmentSet || [];

                    $scope.PATLetterPriorityArray_wait = false;
                    $scope.PATSecurityArray_wait = false;
                    $scope.PATLetterTypeArray_wait = false;
                    $scope.isLoading = false;
                    setTimeout(function(){
                        $scope.$applyAsync(function () {
                            $scope.loaderDestroyed = true;
                        });
                    }, 1000);
                    $scope.$applyAsync();
                }, function (err) {
                    console.log("batchSqlLoad_unitChange Error: ", err);
                    $scope.$applyAsync(function () {
                        $scope.PATLetterPriorityArray_wait = false;
                        $scope.PATSecurityArray_wait = false;
                        $scope.PATLetterTypeArray_wait = false;
                    });
                });
                $scope.PATLetterPriorityArray_wait = true;
                $scope.PATSecurityArray_wait = true;
                $scope.PATLetterTypeArray_wait = true;
            }

            $scope.showValue = function (item) {
                console.log("showValue: ", item);
            }

            $scope.openEditor = function(){
                $rootScope.openRichTextEditor($scope.letter.body).then(function(res){
                    $scope.$applyAsync(function(){
                        $scope.letter.body = res;
                    });
                })
            }

            $scope.openAttachmentListModal = function() {
                $scope.attachmentListModal.show();
                var sqlDescriptorArray = [];
                for(var i = 0; i < $scope.letter.attachmentSet.length; i++){
                    if($scope.letter.attachmentSet[i].vrAttachmentDocument)
                        sqlDescriptorArray.push(
                            {
                                "sqlKey": "METHOD_getCreatedAttachmentPack",
                                "columnNames": ["attachPack", "displayMode", "categorySet", "directorySet"],
                                "serviceName": "LoaderService",
                                "loaderType": "Service",
                                "params": [{ "param1": JSON.stringify({
                                    attachPack: {
                                        id: $scope.letter.attachmentSet[i].vrAttachmentDocument.toString()
                                    }
                                }) }]
                            }
                        );
                }

                _that.batchSqlLoad(sqlDescriptorArray, $scope).then(function (res) {
                    console.log("batchSqlLoad Result: ", res);
                    $scope.$applyAsync(function () {
                        for(var i = 0; i < $scope.letter.attachmentSet.length; i++){
                            try {
                                $scope.letter.attachmentSet[i].title = JSON.parse(res[i][0].attachPack).title;
                            } catch (e){
                                console.error("Error parsing METHOD_getCreatedAttachmentPack result");
                            }
                        }
                    });
                });
            }

            $scope.goToAttachmentPage = function (attachConfigFromUi, item) {
                $scope.$applyAsync(function(){
                    item.vrAttachmentDocument_wait = true;
                });
                setTimeout(function(){
                    $scope.$applyAsync(function(){
                        item.vrAttachmentDocument_wait = false;
                    });
                }, 10000);
                
                attachmentService.goToAttachmentPage(attachConfigFromUi, item.vrAttachmentDocument, _that.getProcessObject().engineName, _that).then(function(vrAttachmentDocument){
                    $scope.$applyAsync(function(){
                        item.vrAttachmentDocument_wait = false;
                    });
                    var index = $scope.letter.attachmentSet.findIndex(function(value, index){
                        if(value.vrAttachmentDocument == vrAttachmentDocument)
                            return true;
                    });

                    if(index === -1){
                        index = $scope.letter.attachmentSet.findIndex(function(value, index){
                            if(!value.vrAttachmentDocument)
                                return true;
                        });
                    }

                    if(index !== -1){
                        $scope.letter.attachmentSet[index].vrAttachmentDocument = vrAttachmentDocument;
                    }
                }, function(err){
                    $scope.$applyAsync(function(){
                        item.vrAttachmentDocument_wait = false;
                    });
                    notificationService.showAlert(err, "خطا", "fa fa-minus-circle redcolor");
                });
            }
            
            $scope.setResponseTime = function (dest) {
                _that.getDate(dest.deadline).then(function (res) {
                    $scope.$applyAsync(function () {
                        dest.deadline = res.date;
                    });
                }, function (err) {
                    console.log("Error getting date! Error: ", err);
                });
            }

            $scope.relatedLetterSearchResultArray = [];
            $scope.searchRelatedLetter = function (lastIndex) {

                var params = {
                    "connectionName": _that.getProcessObject().engineName,
                    "searchName": "SearchAndViewLetters",
                    "filters": [
                        {
                            name: "subj",
                            value: $scope.searchRelatedLetters_subject,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "no",
                            value: $scope.searchRelatedLetters_letterNo,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "persons",
                            value: $scope.myId,
                            type: "Edm.String",
                            operator: "eq"
                        }
                    ]
                };
   
                params.from = 0;
                params.to = 10;

                if(lastIndex != undefined){
                    params.from = lastIndex + 1;
                    params.to = lastIndex + 10;
                } else {
                    $scope.relatedLetterSearchResultArray.length = 0;
                }

                // var params = {"letid":formData.relatedLetter.id}
                adapterService.universalSearch(params).then(function (data) {
                    $scope.$applyAsync(function () {
                        for (var i = 0; i < data.length; i++) {
                            var letter = {
                                letterNo: data[i].no,
                                subject: data[i].subj,
                                id: data[i].letid,
                                verifydate_persian: new JDate(parseInt(data[i].verifydate)).toLocaleString()
                            };
                            $scope.relatedLetterSearchResultArray.push(letter);
                        }
                        $scope.relatedLetterSearchResultArray_wait = false;
                    });
                }).catch(function (e) {
                    $scope.$applyAsync(function () {
                        $scope.relatedLetterSearchResultArray_wait = false;
                        console.log(e);
                    });
                });
                $scope.relatedLetterSearchResultArray_wait = true;
            }
            $scope.relatedLetterSearchResultArray_wait = false;

            $scope.selectRelatedLetterFromSearch = function (item) {
                var letterIndex = $scope.letter.relatedLetter.findIndex(function (value, index) {
                    if (value.letter.id == item.id)
                        return true;
                });

                var relatedLetter = {
                    letter: item,
                    relatedLetterType: {}
                };

                if (letterIndex < 0) {
                    $scope.letter.relatedLetter.push(relatedLetter);
                }
                $scope.searchRelatedLettersModal.hide();
            }

            $scope.selectRelatedLetterToDisplay = function (index) {
                $scope.$applyAsync(function () {
                    $scope.selectedRelatedLetterIndex = index;
                });
            }

            $scope.showSlide = function (item) {
                $scope.$applyAsync(function () {
                    try {
                        if (item.children && item.children.length > 0) {
                            for (var i = 0; i < item.children.length; i++) {
                                if (item.children[i].value.slide)
                                    item.children[i].value.slide = false;
                                else
                                    item.children[i].value.slide = true;
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                })
            }

            var buildHierarchy = function (arry) {
                var roots = [], children = {};

                for (var i = 0, len = arry.length; i < len; ++i) {
                    var item = arry[i],
                        p = item.parentFlowId,
                        target = !p ? roots : (children[p] || (children[p] = []));

                    target.push({ value: item });
                }

                var findChildren = function (parent) {
                    if (children[parent.value.id]) {
                        parent.children = children[parent.value.id];
                        for (var i = 0, len = parent.children.length; i < len; ++i) {
                            findChildren(parent.children[i]);
                        }
                    }
                };

                for (var i = 0, len = roots.length; i < len; ++i) {
                    findChildren(roots[i]);
                }

                return roots;
            }

            if (_that.getOriginalData()) {
                try {
                    restoreForm(_that.getOriginalData());
                } catch(e) {
                    console.log("Exception in restoreForm! Details:", e);
                    notificationService.showAlert(`<div style='direction: rtl'>خطا در پردازش داده های دریافتی از سرور!</div>`, BundleService.getKeyValueFromBundle("ALERT"), "fa fa-minus-circle red");
                    $state.go('base.CartableDisplayState');
                }
            }

            $scope.updateSelectFields = function () {
                $('.mobileSelect').mobileSelect({
                    animation: 'zoom',
                    buttonSave: 'انتخاب',
                    buttonClear: 'پاک کردن',
                    buttonCancel: 'انصراف'
                });
            }

            // setTimeout($scope.updateSelectFields, 5000);

            $scope.sendForm = function (actionType) {
                $scope.actionType = actionType;
                $rootScope.sendForm(_that, $scope);
            }

        });


    }

}