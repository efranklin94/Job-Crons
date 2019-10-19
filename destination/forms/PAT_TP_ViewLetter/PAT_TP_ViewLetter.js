FormManager.forms.PAT_TP_ViewLetter = function (formKey, angularModule) {

    if (!(this instanceof FormManager.forms.PAT_TP_ViewLetter))
        return new FormManager.forms.PAT_TP_ViewLetter(formKey);

    BaseFormModule.call(this, formKey, "PAT_TP_ViewLetter", angularModule);
    //bundledProcessName:"مشاهده نامه"
    
    var _that = this;

    this.getClassName_ = function () {
        return "com.fanap.midhco.pat.process.PAT_TP_ViewLetter_1";
    }

    this.getTemplateURL = function () {
        return "js/plugins/PAT/forms/PAT_TP_ViewLetter/PAT_TP_ViewLetter.html";
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
                resolve(res[0][0].result);
            }, function(err){
                reject(err);
            });
        });  
    }

    this.defineController = function () {
        var controllerName = _that.getControllerName();
        console.log('getFormKey ', _that.getFormKey());

        _that.getAngularModule().register.controller(controllerName, function ($scope, $q, $rootScope, $state, $http, notificationService, attachmentService, $sce) {

            // setInterval(function(){
            //     debugvarx = $scope;  // FOR DEBUGGGING
            // },5000);
            
            $scope.isLoading = true;

            $scope.isAttachmentMutable = false;
            $scope.dzOptions = null;
            $scope.onAttachmentSend = null;
            uploadService($scope, $http, $rootScope);
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

            $scope.toggleLetterPanel = function () {
                $scope.$applyAsync(function () {
                    $scope.showLetterPanelTree = !$scope.showLetterPanelTree;
                });
            }

            $scope.toggleIncomingLetterPanel = function () {
                $scope.$applyAsync(function () {
                    $scope.showIncomingLetterPanelTree = !$scope.showIncomingLetterPanelTree;
                });
            }

            $scope.removeLetterBodyFile = function(){
                $scope.$applyAsync(function () {
                    $scope.letter.bodyFile = null;
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
                        selectedArray = $scope.receiverReferralSet;
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
            
            $scope.showGroupSearchModal = function(target){
                $scope.modalGroupSearchResultArray = [];
                $scope.searchTarget = target;
                groupSearchModal.show();
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

            $scope.showPersonSearchModal = function(target){
                $scope.modalPersonSearchResultArray = [];
                $scope.searchTarget = target;
                searchPersonModal.show();
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
                if( $scope.actionType == 'SEND' &&
                    !$scope.receiverReferralSet.length){
                        return false;
                }

                return true;
            }

            var serializeForm = function () {
                var deferred = $q.defer();
                
                if(!isFormComplete()){
                    notificationService.showAlert("<div style='direction: rtl'>لطفا موارد اجباری را تکمیل نمایید.</div>", BundleService.getKeyValueFromBundle("ALERT"), "fa fa-minus-circle red");
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
                        "body": $scope.letter.docType.id == '383' ? $scope.letter.body : null,
                        "date": $scope.letter.date || null,
                        "bodyFile": $scope.letter.docType.id != '383' ? ($scope.letter.bodyFile || JSON.stringify([$scope.fileData])) : null,
                        "docFile": $scope.letter.docFile,
                        "vrCreator": $scope.letter.vrCreator,
                        "fromPerson": {
                            "vrPerson": $scope.letter.fromPerson.vrPerson
                        },
                        "id": $scope.letter.id,
                        "taskNo": $scope.letter.taskNo || null,
                        "letterNo": $scope.letter.letterNo || null,
                        "subject": $scope.letter.subject,
                        "priority": {
                            "id": parseInt($scope.letterPriority.id)
                        },
                        "security": {
                            "id": parseInt($scope.letterSecurity.id)
                        },
                        "signer": null,
                        "docType": {
                            "id": $scope.letter.docType.id
                        },
                        "isSubmit": $scope.letter.isSubmit,
                        "insertTime": $scope.letter.insertTime,
                        "forAction": null,
                        "toPersonSet": [
                            // WILL BE FILLED ON LOOP                            
                        ],
                        "toOrgSet": [
                            // WILL BE FILLED ON LOOP                            
                        ],
                        "relatedLetter": [
                            // WILL BE FILLED ON LOOP                                                        
                        ],
                        "className_": "com.fanap.fanrp.pat.datamodel.Letter"
                    },
                    "letterFlow": {
                        "actionType": $scope.actionType == 'ARCHIVE' ? "ARCHIVE" : "SEND",
                        "className_": "com.fanap.fanrp.pat.datamodel.LetterFlow"
                    },
                    "letterFlowDTOs": [ // WILL BE FILLED (PREPEND) ON LOOP
                        {
                            "className_": "com.fanap.fanrp.pat.business.dto.LetterFlowDTO"
                        }
                    ]
                }

                out.letter.attachmentSet = $scope.letter.attachmentSet;
                if($scope.actionType == 'ARCHIVE'){
                    out.newLetterFlow = {
                        "className_": "com.fanap.fanrp.pat.datamodel.LetterFlow",
                        "description": $scope.letter._description || null
                    }
                }

                if($scope.signer && $scope.signer.length){
                    out.letter.signer = {
                        "sign": $scope.signer[0].sign || null,
                        "personName": $scope.signer[0].vrPersonValue || $scope.signer[0].title || $scope.signer[0].first_name +" "+ $scope.signer[0].last_name,
                        "vrPerson": $scope.signer[0].id,
                        "vrPost": $scope.signer[0].role_title || null,
                        "vrTitle": $scope.signer[0].prefix,
                        "vrOrganization": $scope.signer[0].ou_title || null,
                        "firstname": $scope.signer[0].first_name,
                        "lastname": $scope.signer[0].last_name,
                        "labor": (($scope.signer[0].rlid!==null)&&($scope.signer[0].rlid!==undefined)) ? $scope.signer[0].rlid.toString() : null,
                        "vrOrganizationId": $scope.signer[0].ou_id || null,
                        "vrPostId": $scope.signer[0].role_id || null
                    }
                }

                if($scope.previousLetFlowDTO){
                    out.previousLetFlowDTO = {
                        "personName": $scope.previousLetFlowDTO.personName,
                        "className_": "com.fanap.fanrp.pat.business.dto.LetterFlowDTO"
                    }
                }

                if($scope.letter.forAction){
                    out.letter.forAction = {
                        "id": $scope.letter.forAction.id
                    }
                }

                if($scope.incomingLetter){
                    out.incomingLetter = {
                        "className_": "com.fanap.fanrp.pat.datamodel.SecretariatInfo",
                        "indicatorNo": $scope.incomingLetter.indicatorNo,
                        "personContactInfo": $scope.incomingLetter.personContactInfo,
                        "deliveryDate": $scope.incomingLetter.deliveryDate,
                        "deliveryInfo": $scope.incomingLetter.deliveryInfo,
                    }

                    if($scope.incomingLetter.deliveryType && $scope.incomingLetter.deliveryType.id !== null){
                        out.incomingLetter.deliveryType = {
                            "id": parseInt($scope.incomingLetter.deliveryType.id)
                        }
                    }

                    if($scope.incomingLetter.sender){
                        out.incomingLetter.sender = {
                            "personType": $scope.incomingLetter.sender.personType,
                            "vrPerson": $scope.incomingLetter.sender.vrPerson,
                            "vrOrganization": $scope.incomingLetter.sender.vrOrganization,
                        }
                    }

                    if($scope.incomingLetter.secretAttachSet){
                        out.incomingLetter.secretAttachSet = $scope.incomingLetter.secretAttachSet;
                    }
                }

                function convertToTimestamp(date){
                    console.log(new JDate(date).getTime());
                    return new JDate(date).getTime();
                }

                for(var i = 0; i < $scope.letter.relatedLetter.length; i++){
                    out.letter.relatedLetter.push({
                        "letter": {
                            "id":$scope.letter.relatedLetter[i].letter.id,
                            "letterNo": $scope.letter.relatedLetter[i].letter.letterNo,
                            "subject": $scope.letter.relatedLetter[i].letter.subject
                        },
                        "objectHashCode": ""
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
                        "vrPostId": $scope.ccPersonSet[i].xjob_id || $scope.ccPersonSet[i].role_id || null
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
                        "vrPostId": $scope.bccPersonSet[i].xjob_id || $scope.bccPersonSet[i].role_id || null
                    });
                }

                if($scope.actionType == "SEND"){
                    out.letterFlow.toFlowPersonSet = [];
                    for(var i = 0; i < $scope.receiverReferralSet.length; i++){
                        out.letterFlow.toFlowPersonSet.push({
                            "deadline": $scope.receiverReferralSet[i].deadline ? convertToTimestamp($scope.receiverReferralSet[i].deadline) : null,
                            "description": $scope.receiverReferralSet[i].description || null,
                            "personName": $scope.receiverReferralSet[i].vrPersonValue || $scope.receiverReferralSet[i].title || $scope.receiverReferralSet[i].first_name +" "+ $scope.receiverReferralSet[i].last_name,
                            "vrPerson": $scope.receiverReferralSet[i].id,
                            "vrPost": $scope.receiverReferralSet[i].job_title || $scope.receiverReferralSet[i].role_title || null,
                            "vrTitle": $scope.receiverReferralSet[i].prefix,
                            "vrOrganization": $scope.receiverReferralSet[i].ou_title || null,
                            "firstname": $scope.receiverReferralSet[i].first_name,
                            "lastname": $scope.receiverReferralSet[i].last_name,
                            "labor": (($scope.receiverReferralSet[i].rlid!==null)&&($scope.receiverReferralSet[i].rlid!==undefined)) ? $scope.receiverReferralSet[i].rlid.toString() : null,
                            "vrOrganizationId": $scope.receiverReferralSet[i].ou_id || null,
                            "vrPostId": $scope.receiverReferralSet[i].xjob_id || $scope.receiverReferralSet[i].role_id || null,
                        });
                    }
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
                        "vrPostId": $scope.toPersonSet[i].xjob_id || $scope.toPersonSet[i].role_id || null
                    });
                }

                for(var i = 0; i < $scope.toOrganizationSet.length; i++){
                    out.letter.toOrgSet.push({
                        "vrTitle": $scope.toOrganizationSet[i].title,
                        "vrOrganization": $scope.toOrganizationSet[i].id,
                        "vrPost": null
                    });
                }

                for(var i = 0; i < $scope.letterFlowDTOs.length; i++){
                    out.letterFlowDTOs.unshift($scope.letterFlowDTOs[i]);
                }

                if(!out.letter.toPersonSet.length) 
                    delete out.letter.toPersonSet;

                if(!out.letter.ccPersonSet.length) 
                    delete out.letter.ccPersonSet;

                if(!out.letter.bccPersonSet.length) 
                    delete out.letter.bccPersonSet;

                if(!out.letter.relatedLetter.length) 
                    delete out.letter.relatedLetter;

                // if(out.letter.letterType.id == null) 
                //     delete out.letter.letterType;

                if(out.letter.body == null) 
                    delete out.letter.body;
                
                if(out.letter.bodyFile == null) 
                    delete out.letter.bodyFile;

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
                        notificationService.showAlert("خطا در دریافت امضا", BundleService.getKeyValueFromBundle("ALERT"), "fa fa-minus-circle red");
                        deferred.reject();
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
                if(parseInt(timestamp) > 0)
                    return new JDate(parseInt(timestamp)).toLocaleStringWithTime();
                else
                    console.error("ERROR: Bad input to convertTimestampToDateTime()!");
            }

            $scope.convertTimestampToDate = function(timestamp){
                console.log("converting date...");
                if(parseInt(timestamp) > 0)
                    return new JDate(parseInt(timestamp)).toLocaleString();
                else
                    console.error("ERROR: Bad input to convertTimestampToDate()!");
            }

            $scope.sortPersonSet = function(array){
                array.sort(function(a, b){
                    if(a.order < b.order)
                        return -1;
                    else if(a.order > b.order)
                        return 1;
                    else if(a.order == b.order)
                        return 0;
                });
            }

            var restoreForm = function (formData) {
                console.log("formData: ", formData);
                function getSubsection(formDataArray, subsectionName){
                    var result = formDataArray.find(function(value){
                        if(value.name == subsectionName)
                            return true;
                    });
                    return result ? result.objectSentToUI : undefined;
                }

                $scope.letterFlowDTOs = getSubsection(formData, "letterFlowDTOs");
                $scope.previousLetFlowDTO = getSubsection(formData, "previousLetFlowDTO");
                $scope.letter = getSubsection(formData, "letter");
                $scope.incomingLetter = getSubsection(formData, "incomingLetter") || getSubsection(formData, "SecretariatInfoLetter");
                if(getSubsection(formData, "incomingLetter"))
                    $scope.isIncomingLetter = true;
                if($scope.incomingLetter)
                    $scope.incomingLetter.deliveryDate_persian = $scope.convertTimestampToDate($scope.incomingLetter.deliveryDate);
                if($scope.letter){
                    $scope.letter.insertTime_persian = $scope.convertTimestampToDate($scope.letter.insertTime);
                    $scope.letter.date_persian = $scope.convertTimestampToDate($scope.letter.date);   
                    if($scope.letter.bodyFile){
                        var key;
                        try {
                            key = JSON.parse($scope.letter.bodyFile)[0].key;
                        } catch (exception) {
                            console.log("bodyFile is not JSON, using as key string. It is probably using a template.");
                            key = $scope.letter.bodyFile;
                        }
                        $scope.letter.bodyFile_trusted = $sce.trustAsResourceUrl(config.fileServerUrl + 'fileServer/download?key=' + key);
                    }                    
                }
                setTimeout(function(){
                    $scope.$applyAsync(function(){
                        $scope.pdfjsViewerDelayPassed = true;
                    });
                }, 2000);
                
                $scope.receiverReferralSet = [];
                $scope.rootid = null;
                $scope.isReadOnly = true;
                $scope.toOrganizationSet = $scope.letter.toOrgSet || [];
                $scope.toPersonSet = $scope.letter.toPersonSet || [];
                $scope.ccPersonSet = $scope.letter.ccPersonSet || [];
                $scope.bccPersonSet = $scope.letter.bccPersonSet || [];
                $scope.letter.relatedLetter = $scope.letter.relatedLetter || [];
                $scope.letter.attachmentSet = $scope.letter.attachmentSet || [];

                $scope.sortPersonSet($scope.toOrganizationSet);
                $scope.sortPersonSet($scope.toPersonSet);
                $scope.sortPersonSet($scope.ccPersonSet);
                $scope.sortPersonSet($scope.bccPersonSet);

                if ($scope.letterFlowDTOs) {
                    $scope.treeStructure = buildHierarchy($scope.letterFlowDTOs);
                }

                $scope.isSigned = false;
                if ($scope.letter) {
                    if ($scope.letter.isSubmit) {
                        $scope.isSigned = true;
                        $scope.signDate = new JDate(parseInt($scope.letter.date)).toLocaleString();
                        $scope.isAttachmentMutable = false;
                        uploadService($scope, $http, $rootScope);
                    }
                }

                $scope.selectedRelatedLetterIndex = 0;

                // UserPostsService.getUserCode().then(function(res){
                //     console.log("UserPostsService: ", res);
                //     if(res == $scope.letter.signer.vrPerson){
                //         $scope.$applyAsync(function () {
                //             $scope.signButtonEnabled = true;
                //         });
                //     }
                // }, function(err){
                //     console.error("Can not get UserID. Error: ", err);
                // });

                var sqlDescriptorArray = [];
                var personIdSearchArray = [];
                if($scope.letter.signer){
                    sqlDescriptorArray.push(
                        {
                            "sqlKey": "METHOD_getPerson",
                            "columnNames": ["id", "value"],
                            "params": [{ "personId": $scope.letter.signer.vrPerson }]
                        }
                    );
                }

                if($scope.incomingLetter && $scope.incomingLetter.sender && $scope.incomingLetter.sender.vrPerson){
                    sqlDescriptorArray.push(
                        {
                            "sqlKey": "METHOD_getPerson",
                            "columnNames": ["id", "value"],
                            "params": [{ "personId": $scope.incomingLetter.sender.vrPerson }]
                        }
                    );
                } else if($scope.incomingLetter && $scope.incomingLetter.sender && $scope.incomingLetter.sender.vrOrganization){
                    sqlDescriptorArray.push(
                        {
                            "sqlKey": "METHOD_getOrganization",
                            "columnNames": ["id", "value"],
                            "params": [{ "orgId": $scope.incomingLetter.sender.vrOrganization }]
                        }
                    );
                }

                if($scope.letter.vrCreator || $scope.letter.fromPerson){
                    sqlDescriptorArray.push(
                        {
                            "sqlKey": "METHOD_getPerson",
                            "columnNames": ["id", "value"],
                            "params": [{ "personId": $scope.letter.vrCreator || $scope.letter.fromPerson.vrPerson }]
                        }
                    );
                }

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
                        "params": [{ "catCode": "PATForAction" }]
                    },
                    {
                        "sqlKey": "METHOD_getCategoryElementsByCatCode",
                        "columnNames": ["id", "value", "code"],
                        "params": [{ "catCode": "PATRelatedLetterType" }]
                    },
                    {
                        "sqlKey": "METHOD_getCategoryElementsByCatCode",
                        "columnNames": ["id", "value", "code"],
                        "params": [{ "catCode": "PATDeliveryType" }]
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

                for (var i = 0; i < $scope.toPersonSet.length; i++) {
                    sqlDescriptorArray.push(
                        {
                            "sqlKey": "METHOD_getPerson",
                            "columnNames": ["id", "value"],
                            "params": [{ "personId": $scope.letter.toPersonSet[i].vrPerson }]
                        }
                    )
                }

                for (var i = 0; i < $scope.ccPersonSet.length; i++) {
                    sqlDescriptorArray.push(
                        {
                            "sqlKey": "METHOD_getPerson",
                            "columnNames": ["id", "value"],
                            "params": [{ "personId": $scope.letter.ccPersonSet[i].vrPerson }]
                        }
                    )
                }

                for (var i = 0; i < $scope.bccPersonSet.length; i++) {
                    sqlDescriptorArray.push(
                        {
                            "sqlKey": "METHOD_getPerson",
                            "columnNames": ["id", "value"],
                            "params": [{ "personId": $scope.letter.bccPersonSet[i].vrPerson }]
                        }
                    )
                }

                for (var i = 0; i < $scope.letter.relatedLetter.length; i++) {
                    sqlDescriptorArray.push(
                        {
                            "sqlKey": "METHOD_getRelatedLetterByLetId",
                            "columnNames": ["subject", "date", "letterNo"],
                            "params": [{ "letId": $scope.letter.relatedLetter[i].letter.id }]
                        }
                    )
                }

                

                _that.batchSqlLoad(sqlDescriptorArray, $scope).then(function (res) {
                    console.log("batchSqlLoad_unitChange Result: ", res);
                    var j = 0;
                    if($scope.letter.signer){
                        $scope.signer = [$scope.letter.signer];
                        $scope.signer[0].vrPersonValue = res[j++][0].value;
                        $scope.signer[0].prefix = $scope.signer[0].vrTitle;
                        $scope.signer[0].role_title = $scope.signer[0].vrPost;
                        $scope.signer[0].ou_title = $scope.signer[0].vrOrganization;
                        $scope.signer[0].rlid = $scope.signer[0].labor;
                        $scope.signer[0].ou_id = $scope.signer[0].vrOrganizationId;
                        $scope.signer[0].role_id = $scope.signer[0].vrPostId;
                        $scope.signer[0].id = $scope.signer[0].vrPerson;
                        personIdSearchArray.push($scope.signer[0].id);
                    }

                    if($scope.incomingLetter && $scope.incomingLetter.sender && $scope.incomingLetter.sender.vrPerson){
                        $scope.incomingLetter.sender.vrPersonValue = res[j++][0].value;
                        $scope.incomingLetter.sender.prefix = $scope.incomingLetter.sender.vrTitle;
                        $scope.incomingLetter.sender.role_title = $scope.incomingLetter.sender.vrPost;
                        $scope.incomingLetter.sender.ou_title = $scope.incomingLetter.sender.vrOrganization;
                        $scope.incomingLetter.sender.rlid = $scope.incomingLetter.sender.labor;
                        $scope.incomingLetter.sender.ou_id = $scope.incomingLetter.sender.vrOrganizationId;
                        $scope.incomingLetter.sender.role_id = $scope.incomingLetter.sender.vrPostId;
                        $scope.incomingLetter.sender.id = $scope.incomingLetter.sender.vrPerson;
                        personIdSearchArray.push($scope.incomingLetter.sender.id);
                    } else if($scope.incomingLetter && $scope.incomingLetter.sender && $scope.incomingLetter.sender.vrOrganization) {
                        $scope.incomingLetter.sender.vrOrganizationValue = res[j++][0].value;
                    }

                    if($scope.letter.vrCreator || $scope.letter.fromPerson){
                        if($scope.letter.vrCreator){
                            $scope.letter.vrCreator_value = res[j++][0].value;
                        } else if($scope.letter.fromPerson) {
                            $scope.letter.fromPerson_value = res[j++][0].value;
                        }
                    }

                    $scope.PATLetterPriorityArray = res[j++];
                    $scope.PATSecurityArray = res[j++];
                    $scope.PATForActionArray = res[j++];
                    $scope.PATRelatedLetterTypeArray = res[j++];
                    $scope.PATDeliveryTypeArray = res[j++];
                    $scope.rootid = parseInt(res[j++][0].result);
                    $scope.myId = res[j++][0].id;

                    for (var i = 0; i < $scope.toOrganizationSet.length; i++) {
                        $scope.toOrganizationSet[i].title = $scope.toOrganizationSet[i].vrTitle;
                        $scope.toOrganizationSet[i].id = $scope.toOrganizationSet[i].vrOrganization;
                    }

                    // var j = 9;
                    for (var i = 0; i < $scope.toPersonSet.length; i++) {
                        $scope.toPersonSet[i].vrPersonValue = res[j + i][0].value;
                        $scope.toPersonSet[i].prefix = $scope.toPersonSet[i].vrTitle;
                        $scope.toPersonSet[i].role_title = $scope.toPersonSet[i].vrPost;
                        $scope.toPersonSet[i].ou_title = $scope.toPersonSet[i].vrOrganization;
                        $scope.toPersonSet[i].rlid = $scope.toPersonSet[i].labor;
                        $scope.toPersonSet[i].ou_id = $scope.toPersonSet[i].vrOrganizationId;
                        $scope.toPersonSet[i].role_id = $scope.toPersonSet[i].vrPostId;
                        $scope.toPersonSet[i].id = $scope.toPersonSet[i].vrPerson;
                        personIdSearchArray.push($scope.letter.toPersonSet[i].id);
                    }

                    j += $scope.toPersonSet.length;
                    for (var i = 0; i < $scope.ccPersonSet.length; i++) {
                        $scope.ccPersonSet[i].vrPersonValue = res[j + i][0].value;
                        $scope.ccPersonSet[i].prefix = $scope.ccPersonSet[i].vrTitle;
                        $scope.ccPersonSet[i].role_title = $scope.ccPersonSet[i].vrPost;
                        $scope.ccPersonSet[i].ou_title = $scope.ccPersonSet[i].vrOrganization;
                        $scope.ccPersonSet[i].rlid = $scope.ccPersonSet[i].labor;
                        $scope.ccPersonSet[i].ou_id = $scope.ccPersonSet[i].vrOrganizationId;
                        $scope.ccPersonSet[i].role_id = $scope.ccPersonSet[i].vrPostId;
                        $scope.ccPersonSet[i].id = $scope.ccPersonSet[i].vrPerson;
                        personIdSearchArray.push($scope.letter.ccPersonSet[i].id);
                    }

                    j += $scope.ccPersonSet.length;
                    for (var i = 0; i < $scope.bccPersonSet.length; i++) {
                        $scope.bccPersonSet[i].vrPersonValue = res[j + i][0].value;
                        $scope.bccPersonSet[i].prefix = $scope.bccPersonSet[i].vrTitle;
                        $scope.bccPersonSet[i].role_title = $scope.bccPersonSet[i].vrPost;
                        $scope.bccPersonSet[i].ou_title = $scope.bccPersonSet[i].vrOrganization;
                        $scope.bccPersonSet[i].rlid = $scope.bccPersonSet[i].labor;
                        $scope.bccPersonSet[i].ou_id = $scope.bccPersonSet[i].vrOrganizationId;
                        $scope.bccPersonSet[i].role_id = $scope.bccPersonSet[i].vrPostId;
                        $scope.bccPersonSet[i].id = $scope.bccPersonSet[i].vrPerson;
                        personIdSearchArray.push($scope.letter.bccPersonSet[i].id);
                    }

                    j += $scope.bccPersonSet.length;
                    for (var i = 0; i < $scope.letter.relatedLetter.length; i++) {
                        $scope.letter.relatedLetter[i].letter.letterNo = res[j + i][0].letterNo;
                        $scope.letter.relatedLetter[i].letter.date = res[j + i][0].date;
                        $scope.letter.relatedLetter[i].letter.subject = res[j + i][0].subject;
                    }


                    $scope.PATLetterPriorityArray_wait = false;
                    $scope.PATSecurityArray_wait = false;
                    $scope.PATForActionArray_wait = false;

                    for (var i = 0; i < $scope.PATLetterPriorityArray.length; i++) {
                        if ($scope.PATLetterPriorityArray[i].id == $scope.letter.priority.id) {
                            $scope.letterPriority = $scope.PATLetterPriorityArray[i];
                            break;
                        }
                    }

                    for (var i = 0; i < $scope.PATSecurityArray.length; i++) {
                        if ($scope.PATSecurityArray[i].id == $scope.letter.security.id) {
                            $scope.letterSecurity = $scope.PATSecurityArray[i];
                            break;
                        }
                    }

                    for (var i = 0; i < $scope.PATForActionArray.length; i++) {
                        if ($scope.letter.forAction && ($scope.PATForActionArray[i].id == $scope.letter.forAction.id)) {
                            $scope.forAction = $scope.PATForActionArray[i];
                            break;
                        }
                    }

                    for (var i = 0; i < $scope.PATDeliveryTypeArray.length; i++) {
                        if ($scope.incomingLetter && $scope.incomingLetter.deliveryType && ($scope.PATDeliveryTypeArray[i].id == $scope.incomingLetter.deliveryType.id)) {
                            $scope.incomingLetter.deliveryType = $scope.PATDeliveryTypeArray[i];
                            break;
                        }
                    }

                    for (var j = 0; j < $scope.letter.relatedLetter.length; j++) {
                        for (var i = 0; i < $scope.PATRelatedLetterTypeArray.length; i++) {
                            if ($scope.letter.relatedLetter && ($scope.PATRelatedLetterTypeArray[i].id == $scope.letter.relatedLetter[j].relatedLetterType.id)) {
                                $scope.letter.relatedLetter[j].relatedLetterType.meta = $scope.PATRelatedLetterTypeArray[i];
                                break;
                            }
                        }
                    }

                    $scope.searchNewPersonByIdAndAutoAssign(personIdSearchArray);
                    $scope.isLoading = false;
                    $scope.$applyAsync();
                    setTimeout(function(){
                        $scope.$applyAsync(function () {
                            $scope.loaderDestroyed = true;
                        });
                    }, 1000);
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

                for(var i = 0; i < $scope.incomingLetter.secretAttachSet.length; i++){
                    if($scope.incomingLetter.secretAttachSet[i].vrAttachmentDocument)
                        sqlDescriptorArray.push(
                            {
                                "sqlKey": "METHOD_getCreatedAttachmentPack",
                                "columnNames": ["attachPack", "displayMode", "categorySet", "directorySet"],
                                "serviceName": "LoaderService",
                                "loaderType": "Service",
                                "params": [{ "param1": JSON.stringify({
                                    attachPack: {
                                        id: $scope.incomingLetter.secretAttachSet[i].vrAttachmentDocument.toString()
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

                        for(var i = 0; i < $scope.incomingLetter.secretAttachSet.length; i++){
                            try {
                                $scope.incomingLetter.secretAttachSet[i].title = JSON.parse(res[i][0].attachPack).title;
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