FormManager.forms.PAT_TP_GenerateAndUpdateGroup = function (formKey, angularModule) {

    if (!(this instanceof FormManager.forms.PAT_TP_GenerateAndUpdateGroup))
        return new FormManager.forms.PAT_TP_GenerateAndUpdateGroup(formKey);

    BaseFormModule.call(this, formKey, "PAT_TP_GenerateAndUpdateGroup", angularModule);

    var _that = this;

    this.getClassName_ = function () {
        // return "com.fanap.fanrp.pat.business.dto.LetterFlowDTO";
        return "com.fanap.midhco.pat.process.PAT_TP_GenerateAndUpdateGroup_1";
    }

    this.getTemplateURL = function () {
        return "js/plugins/PAT/forms/PAT_TP_GenerateAndUpdateGroup/PAT_TP_GenerateAndUpdateGroup.html";
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
                        // if($scope) 
                        //     $scope.formHasError = true;
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

    this.defineController = function () {
        var controllerName = _that.getControllerName();
        console.log('getFormKey ', _that.getFormKey());

        _that.getAngularModule().register.controller(controllerName, function ($scope, $q, $rootScope, $state, $http, notificationService, attachmentService, pluginRendererService, pluginManagerService, searchService) {
            $scope.isLoading = true;

            $scope.toolbarTitle = BundleService.getKeyValueFromBundle(_that.getProcessObject().processName);

            $scope.backButton = function () {
                $rootScope.loadingNew = null;
                $state.go('base.CartableDisplayState');
            }

            if (!$scope.toolbarTitle) {
                $scope.toolbarTitle = _that.getProcessObject().processName;
            }

            $scope.removePersonTag = function (index, scope) {
                $scope.$applyAsync(function () {
                    $scope[scope].splice(index, 1);
                })
            }

            $scope.searchNewPersonById = function (query, loaderName) {
                $scope.$applyAsync(function () {
                    $scope.loaders[loaderName] = true;
                });

                var params = { 
                    "connectionName": _that.getProcessObject().engineName,
                    searchName: "NewPersonSearch",
                    filters: [
                        {
                            name: "id",
                            value: query,
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
                        selectedArray = $scope.group.memberSet;
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
                if( !$scope.group.memberSet.length ||
                    !$scope.group.title || 
                    !$scope.group.title.trim().length){
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
                    "group": {
                        "title": $scope.group.title,
                        "memberSet": [
                            // WILL BE FILLED ON LOOP
                        ],
                        "className_": "com.fanap.fanrp.pat.datamodel.GroupsUser"
                    }
                }

                for(var i = 0; i < $scope.group.memberSet.length; i++){
                    out.group.memberSet.push({
                        "personName": $scope.group.memberSet[i].vrPersonValue || $scope.group.memberSet[i].title || $scope.group.memberSet[i].first_name +" "+ $scope.group.memberSet[i].last_name,
                        "vrPerson": $scope.group.memberSet[i].id,
                        "vrPost": $scope.group.memberSet[i].role_title || null,
                        "vrTitle": $scope.group.memberSet[i].prefix,
                        "vrOrganization": $scope.group.memberSet[i].ou_title || null,
                        "lastname": $scope.group.memberSet[i].last_name,
                        "firstname": $scope.group.memberSet[i].first_name,
                        "labor": (($scope.group.memberSet[i].rlid!==null)&&($scope.group.memberSet[i].rlid!==undefined)) ? $scope.group.memberSet[i].rlid.toString() : null,
                        "vrOrganizationId": $scope.group.memberSet[i].ou_id || null,
                        "vrPostId": $scope.group.memberSet[i].role_id || null
                    });
                }

                deferred.resolve(out);                
                return deferred.promise;
            }

            var serializeEventKey = _that.getFormKey() + "_serialize";
            $scope.$on(serializeEventKey, function (event, listener) {
                serializeForm().then(function (serializedData) {
                    console.log('_that.getFormKey() ', _that.getFormKey());
                    listener.notify(serializedData);
                });
            });

            var restoreForm = function (formData) {
                console.log("formData: ", formData);
                $scope.loaders = {};
                $scope.group = formData[0].objectSentToUI;
                $scope.group.title = $scope.group.title || "";
                $scope.group.memberSet = $scope.group.memberSet || [];

                var sqlDescriptorArray = [];
                for (var i = 0; i < $scope.group.memberSet.length; i++) {
                    sqlDescriptorArray.push(
                        {
                            "sqlKey": "METHOD_getPerson",
                            "columnNames": ["id", "value"],
                            "params": [{ "personId": $scope.group.memberSet.vrPerson }]
                        }
                    )
                }

                _that.batchSqlLoad(sqlDescriptorArray, $scope).then(function (res) {
                    console.log("batchSqlLoad_unitChange Result: ", res);
                    for (var i = 0; i < $scope.group.memberSet.length; i++) {
                        $scope.group.memberSet[i].vrPersonValue = res[i][0].value;
                        $scope.group.memberSet[i].prefix = $scope.group.memberSet[i].vrTitle;
                        $scope.group.memberSet[i].role_title = $scope.group.memberSet[i].vrPost;
                        $scope.group.memberSet[i].ou_title = $scope.group.memberSet[i].vrOrganization;
                        $scope.group.memberSet[i].rlid = $scope.group.memberSet[i].labor;
                        $scope.group.memberSet[i].ou_id = $scope.group.memberSet[i].vrOrganizationId;
                        $scope.group.memberSet[i].role_id = $scope.group.memberSet[i].vrPostId;
                        $scope.group.memberSet[i].id = $scope.group.memberSet[i].vrPerson;
                        (function(){
                            var z = i;
                            $scope.searchNewPersonById($scope.group.memberSet[z].id).then(function(res){
                                for(var person of $scope.group.memberSet){
                                    if(person.id == res[0].id){
                                        console.log("XProcessing: " + z + ". Assigning: " + person.id + " to " + res[0].id);
                                        person.first_name = res[0].first_name;
                                        person.last_name = res[0].last_name;
                                    }
                                }
                            }, function(err){
                                console.log("Error in search: ", err);
                                $scope.formHasError = true;
                            });
                        })();
                    }
                    $scope.isLoading = false;
                    setTimeout(function(){
                        $scope.$applyAsync(function () {
                            $scope.loaderDestroyed = true;
                        });
                    }, 1000);
                    $scope.$applyAsync();
                });

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

            $scope.sendForm = function (actionType) {
                $scope.actionType = actionType;
                $rootScope.sendForm(_that, $scope);
            }

        });


    }

}