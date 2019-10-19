CartableFormatters.LetterCartableFormatter = function(angularModule) {
    if(!(this instanceof CartableFormatters.LetterCartableFormatter))
        return new CartableFormatters.LetterCartableFormatter(angularModule);

    BaseCartableFormatter.call(this, 'LetterCartableFormatter', angularModule);
    var _that = this;

    this.getTemplateURL = function() {
        return "js/plugins/PAT/formatters/letter/LetterCartableFormatter.html";
    }

    this.defineController = function() {
        var controllerName = _that.getControllerName();

        _that.getAngularModule().register.controller(controllerName, function ($scope,$rootScope,notificationService,errorHandler) {

            $scope.state = {};

            $scope.checkHavePlugin = null;
            var check = PluginManager.plugins[_that.getCartableData().processCode];


            if(check)
                $scope.checkHavePlugin = true;
            else{
                $scope.checkHavePlugin = false;
            }

            var cartableItems = _that.getCartableData();

            if(cartableItems.parentProcessVo && cartableItems.parentProcessVo.taskActions){
                $scope.taskActions = cartableItems.parentProcessVo.taskActions;
            }

            setTimeout(function() {

                if(cartableItems.parentProcessVo && cartableItems.parentProcessVo.subProcessList){
                    $scope.state.subprocess = cartableItems.parentProcessVo.subProcessList;
                    $scope.state.subprocess.forEach(function(value,index){

                        $scope.state.subprocess[index].bundledProcessName =  BundleService.getKeyValueFromBundle(value.processName);
                        if(!$scope.state.subprocess[index].bundledProcessName)
                            $scope.state.subprocess[index].bundledProcessName = value.processName

                    });

                }

                ons.createPopover('popoverList.html',{parentScope: $scope}).then(function(popover) {
                    $scope.popoverList = popover;
                });
            }, 1000);

            
            $scope.slidetoggle = false;
            $scope.commentList = [];
            $scope.getComment = function ($event){
                $scope.slidetoggle = true;

                if(!spinnerManager.scheduleProcessSpinner(cartableItems.processInstanceId, $event))
                    return;

                adapterService.getComment({processInstanceId : cartableItems.processInstanceId, engineName: cartableItems.engineName}).then(function(data){
                    console.log(data);
                    spinnerManager.removeProcessSpinner(cartableItems.processInstanceId);
                    $scope.$applyAsync(function () {
                        data.commentList.forEach(function(value,index) {
                            data.commentList[index].timeago = jQuery.timeago(new Date( data.commentList[index].insertTime)).toPersianDigits();
                        });
                        $scope.commentList = data.commentList;
                    })
                    
                    
                }).catch(function (e) {
                    console.log(e);
                });
                
                

            };

            $scope.addComment = function (){

                $scope.loadingaddcomment = true;
                var params = {
                    processInstanceId : cartableItems.processInstanceId,
                    comment_content: $scope.textComment,
                    threadIndex: 0,
                    engineName: cartableItems.engineName
                };
                if(!$scope.textComment || $scope.textComment == ""){
                    notificationService.showAlert("متن دیدگاه نباید خالی باشد", "هشدار", "fa fa-minus-circle red");
                    $scope.$applyAsync(function () {
                        $scope.loadingaddcomment = false;
                    });
                    return false;
                }else{
                    adapterService.postComment(params).then(function(data){

                        console.log(data);
                        $scope.$applyAsync(function () {
                            $scope.commentList.push(JSON.parse(data));
                            $scope.loadingaddcomment = false;
                        });
    
                    }).catch(function (e) {
    
                        $scope.$applyAsync(function () {
                            $scope.loadingaddcomment = false;
                        });
                        notificationService.showAlert("خطا در ایجاد دیدگاه", "هشدار", "fa fa-minus-circle red");
                    });
                }
                    
            }


            

            $scope.getPostchange = function(){
                $scope.$applyAsync(function () {
                    if($scope.slidetoggle){
                        $scope.slidetoggle = false;;
                    }
                });

            }

            $scope.showPopover = function(target){
                document.getElementById('onspopover').show(target);
            }

            cartableItems.JstartTime = convertJalaliWithTime(cartableItems.startTime);


            ProcessStatusArray.forEach(function(value, index){

                if(value.name == cartableItems.processStatus)
                    $scope.sideColor = value.color;
            });


            var searchableFieldsCount = 0;
            if(cartableItems.cardtableDataVoList) {
                 cartableItems.searchableMap = {};
                 for(var i = 0; i < cartableItems.cardtableDataVoList.length; i++) {
                     if(cartableItems.cardtableDataVoList[i].content) {
                        searchableFieldsCount++;
                         if(cartableItems.cardtableDataVoList[i].key == "date") {
                            var d = new Date(parseInt(cartableItems.cardtableDataVoList[i].content));
                            var year = d.getFullYear();
                            var month = d.getMonth() + 1;
                            var day = d.getDate();

                            var persianDateArray = jd_to_persian(gregorian_to_jd(year, month, day));
                            var persianDateString = persianDateArray[0] + "/" + dateDigitToString(persianDateArray[1]) + "/" + dateDigitToString(persianDateArray[2]);

                            cartableItems.searchableMap["formattedDate"] = persianDateString;
                         } else if(cartableItems.cardtableDataVoList[i].key == "letterSubject") {
                            cartableItems.searchableMap["letterSubject"] = cartableItems.cardtableDataVoList[i].content;
                         } else if(cartableItems.cardtableDataVoList[i].key == "fromPerson") {
                            cartableItems.searchableMap["fromPerson"] = cartableItems.cardtableDataVoList[i].content;
                         } else if(cartableItems.cardtableDataVoList[i].key == "letterType") {
                            cartableItems.searchableMap["letterType"] = cartableItems.cardtableDataVoList[i].content;
                         } else if(cartableItems.cardtableDataVoList[i].key == "letterNo") {
                            cartableItems.searchableMap["letterNo"] = cartableItems.cardtableDataVoList[i].content;
                         } else if(cartableItems.cardtableDataVoList[i].key == "Referrer") {
                            cartableItems.searchableMap["Referrer"] = cartableItems.cardtableDataVoList[i].content;
                         }
                     }
                 }
            }

            cartableItems.style = { height:  (9 + searchableFieldsCount * 1.5) + 'rem' };
            cartableItems.engineNameLocalised = AssetManager.getMessage(config.locale.locale, "abr_" + cartableItems.engineName);

            $scope.cartableItems = cartableItems;


            $scope.abortProcess = function(){


                var params = _that.getCartableData();
                adapterService.abortProcess(params).then(function(data){

                    console.log(data);


                }).catch(function(e){
                    alert(e);
                    console.log(e);
                });
            }

            $scope.continueProcessBTN = function ($event) {
                var tmpCart = _that.getCartableData();

                $rootScope.continueProcessInProgress[cartableItems.processInstanceId] = $scope;

                $scope.$apply(function() {
                    $scope.continueProcessInProgress = true;

                    setTimeout(function() {
                        $scope.$applyAsync(function() {
                            $scope.continueProcessInProgress = false;
                            delete $rootScope.continueProcessInProgress[cartableItems.processInstanceId];
                        });
                    }, 20000);
                });

                $rootScope.NotifyfromApplication = true;

                if(tmpCart.category != 'ENDED'){

                    $rootScope.loadingNew = true;

                    adapterService.continueProcess(tmpCart, $rootScope, notificationService, $scope, $event, function (message) {
                        $rootScope.loadingNew = null;
                    }, $scope).catch(function (e) {
                        $rootScope.$applyAsync(function () {
                            $rootScope.loadingNew = null;
                        });
                        errorHandler.returnError(e,true);
                    });

                }
            }

//            $rootScope.createRelatedLetter = function (item) {
//
//
//
//
//                var menuExtras = [];
//
//                var obj = {};
//                obj.processDataContent = null;
//                obj.fromSearch = true;
//                obj.nodeId = item.nodeId;
//                obj.processCode = item.processCode;
//                obj.parentProcessInstanceId = _that.getCartableData().parentProcessInstanceId;
//
//                $scope.$applyAsync(function () {
//                    //$scope.myPop.hide();
//                });
//
//                menuExtras.push(obj.nodeId,obj.processCode,obj.fromSearch,obj.processDataContent,obj.parentProcessInstanceId);
//                $rootScope.arrayVar = {tempPluginObject:null , index:null , menuExtras:menuExtras , menuType:MenuTypes.START_PROCESS}
//                UserPostsService.getUserPosts().then(function (userPostData) {
//
//                    $rootScope.$applyAsync(function () {
//                        var arr = [];
//                        userPostData.forEach(function(value) {
//                            var obj = {};
//                            obj.id = value.id;
//                            obj.value = value.roleName;
//                            arr.push(obj);
//                        });
//                        $rootScope.roleOption = arr;
//                        $rootScope.getRoleOption = {status: $rootScope.roleOption[0].id};
//                        if($rootScope.roleOption.length < 2){
//                            $rootScope.loadingNew = true;
//                            var extras = $rootScope.arrayVar.menuExtras;
//                            extras.push($rootScope.getRoleOption.status);
//                            $rootScope.arrayVar.menuType.actionManager.apply(null, extras);
//                        }
//                        else{
//                            ons.createDialog('myDialogRole.html').then(function(dialog) {
//                                $scope.dialogRole = dialog;
//                                dialog.show();
//                            });
//                        }
//
//                    })
//                }).catch(function (e) {
//                    console.log("create letter error is : " , e)
//                    $rootScope.loadingNew = null;
//                });
//            }

            
            $scope.state.processHistory = null;
            $scope.state.getProcessHistory = function(){
                $("#historyDialog").remove();

                ons.createDialog('dialogHistory.html',{parentScope: $scope}).then(function(dialog) {
                    $scope.dialogHistory = dialog;
                    dialog.show();
                    $scope.popoverList.hide();
                });

                var params = {};
                params.processInstanceId = $scope.cartableItems.processInstanceId;
                params.engineName = $scope.cartableItems.engineName;

                adapterService.getProcessHistory(params).then(function(data){
                    
                    console.log(data);

                    $scope.$applyAsync(function(){
                        data = JSON.parse(data.content); 
                        
                        data.forEach(function(v,i){

                            v.processNameBundle = v.processName;

                            var bundle = BundleService.getKeyValueFromBundle(v.processName);
                            if(bundle)
                                v.processNameBundle = bundle;

                            var statusTime = parseInt(v.statusTime);
                            var statusTimeAsDate = new Date(statusTime);

                            var year = statusTimeAsDate.getFullYear();
                            var month = statusTimeAsDate.getMonth() + 1;
                            var day = statusTimeAsDate.getDay();

                            var persianDateArray = jd_to_persian(gregorian_to_jd(year, month, day));

                            v.persianStatusTime =
                                persianDateArray[0] + "/" + dateDigitToString(persianDateArray[1]) + "/" + persianDateArray[2];
                        });
                        
                        $scope.state.processHistory = data;
                    });

                }).catch(function(e){
                    console.log(e);
                })
            }

            $scope.state.showSlide = function (item) {
                $scope.$applyAsync(function () {
                    try{

                        if(item.histories[0].slide)
                            item.histories[0].slide = false;
                        else
                            item.histories[0].slide = true;

                    }catch(e) {

                    }
                })
            }

            $scope.state.getStartProcess = function(item){
                console.log(item);
                var lanelist = JSON.parse(item.dataContent)
                MenuTypes.START_PROCESS.actionManager(item.nodeId , item.processCode, true,null,item.parentProcessInstanceId,lanelist.laneList[0].postsCode[0]);
                
            }


            // $scope.myPop;

            
            // var cartableItems = _that.getCartableData();
            // $scope.mycartableItems = _that.getCartableData();
            // $scope.mycartableItems.JstartTime = convertJalali(cartableItems.startTime)


            // $scope.getPostchange = function(){
            //     $scope.$applyAsync(function () {
            //         if($scope.slidetoggle){
            //             $scope.slidetoggle = false;;
            //         }
            //     });
                
            // }


            // $scope.$applyAsync(function(){
            //     $scope.subProcessList = [];
            //     if(cartableItems.parentProcessVo && cartableItems.parentProcessVo.subProcessList){
            //         $scope.subProcessList  = cartableItems.parentProcessVo.subProcessList;
            //         $scope.subProcessList.forEach(function(value,i) {
            //             $scope.subProcessList[i].bundleNodeName = BundleService.getKeyValueFromBundle(value.nodeName);
            //         });
            //     }
            // });

            // $scope.showPopover = function(target){
            //     document.getElementById('onspopover').show(target);
            // }
            // $scope.showDialog = function(target){
            //     document.getElementById('mydialog').show(target);
            // }

            // $scope.slidetoggle = false;
            // $scope.commentList = [];
            // $scope.getComment = function (){
                
            //     $scope.slidetoggle = true;
            
            //     adapterService.getComment({processInstanceId : cartableItems.processInstanceId}).then(function(data){
            //         console.log(data);
            //         $scope.$applyAsync(function () {
            //             data.commentList.forEach(function(value,index) {
            //                 data.commentList[index].timeago = jQuery.timeago(new Date( data.commentList[index].insertTime)).toPersianDigits();
            //             });
            //             $scope.commentList = data.commentList;
            //         })
                    
                    
            //     }).catch(function (e) {
            //         console.log(e);
            //     });
               
               

            // };

            // $scope.addComment = function (){

            //     var params = {
            //         processInstanceId : cartableItems.processInstanceId,
            //         comment_content: $scope.textComment,
            //         threadIndex: 0
            //     };
            //     adapterService.postComment(params).then(function(data){
            //         console.log(data);
                    
            //     }).catch(function (e) {
            //         notificationService.showAlert("خطا در ایجاد دیدگاه", "هشدار", "fa fa-minus-circle red");
            //     });
                    
            // }

            // $scope.continueProcessBTN = function (tmpCart) {
            //     $rootScope.NotifyfromApplication = true;
            //     var tmpCart = _that.getCartableData();
            //     if(tmpCart.processName == 'PAT.TP.GenerateLetter'){
            //     }
            //     else{
            //         $rootScope.$applyAsync(function () {
            //             $rootScope.loadingNew = true;
            //             $rootScope.parentobj.CartableDatas.forEach(function (val,i) {
            //                 if(tmpCart.customID == val.customID){

            //                     if($rootScope.parentobj.CartableDatas[i].read == false){
            //                         $rootScope.$applyAsync(function () {
            //                             $rootScope.unreadCount--;
            //                         })
            //                     }
            //                     $rootScope.parentobj.CartableDatas[i].read = true;
            //                     $rootScope.parentobj.CartableDatas[i].parentProcessVo.cardtableDataVoList.read = true;
            //                 }
            //             })

            //         })
            //         adapterService.continueProcess(tmpCart,$rootScope,notificationService, function (message) {
            //             console.log(message);
            //         }).catch(function () {
            //             $rootScope.$applyAsync(function () {
            //                 $rootScope.loadingNew = null;
            //             })

            //             notificationService.showAlert("خطای نامشخص", "هشدار", "fa fa-minus-circle red");
            //         });
            //     }
            // }



            // $rootScope.createRelatedLetter = function (item) {
            //     var menuExtras = [];

            //     var obj = {};
            //     obj.processDataContent = null;
            //     obj.fromSearch = true;
            //     obj.nodeId = item.nodeId;
            //     obj.processCode = item.processCode;
            //     obj.parentProcessInstanceId = _that.getCartableData().parentProcessInstanceId;

            //     $scope.$applyAsync(function () {
            //         $scope.myPop.hide();
            //     })

            //     menuExtras.push(obj.nodeId,obj.processCode,obj.fromSearch,obj.processDataContent,obj.parentProcessInstanceId);
            //     $rootScope.arrayVar = {tempPluginObject:null , index:null , menuExtras:menuExtras , menuType:MenuTypes.START_PROCESS}
            //     UserPostsService.getUserPosts().then(function (userPostData) {

            //         $rootScope.$applyAsync(function () {
            //             var arr = [];
            //             userPostData.forEach(function(value) {
            //                 var obj = {};
            //                 obj.id = value.id;
            //                 obj.value = value.roleName;
            //                 arr.push(obj);
            //             });
            //             $rootScope.roleOption = arr;
            //             $rootScope.getRoleOption = {status: $rootScope.roleOption[0].id};
            //             if($rootScope.roleOption.length < 2){
            //                 $rootScope.loadingNew = true;
            //                 var extras = $rootScope.arrayVar.menuExtras;
            //                 extras.push($rootScope.getRoleOption.status);
            //                 $rootScope.arrayVar.menuType.actionManager.apply(null, extras);
            //             }
            //             else{
            //                 ons.createDialog('myDialogRole.html').then(function(dialog) {
            //                     $scope.dialogRole = dialog;
            //                     dialog.show();
            //                 });
            //             }

            //         })
            //     }).catch(function (e) {
            //         console.log("create letter error is : " , e)
            //         $rootScope.loadingNew = null;
            //     });
            // }
            





            
            // $rootScope.$applyAsync(function(){
            //     if(cartableItems.parentProcessVo && cartableItems.parentProcessVo.subProcessList){
            //         $rootScope.subProcessList  = cartableItems.parentProcessVo.subProcessList;
            //         $rootScope.subProcessList.forEach(function(value,i) {
            //             $rootScope.subProcessList[i].bundleNodeName = BundleService.getKeyValueFromBundle(value.nodeName);
            //         });
            //     }
            // });


            

            



            // var cartableItemsScope = _that.getCartableData();


            // var dlist = null;
            // if(cartableItems.parentProcessVo && cartableItems.parentProcessVo.cardtableDataVoList){
            //     dlist = cartableItems.parentProcessVo.cardtableDataVoList;
            // }
            // else{
            //     dlist = cartableItems.cardtableDataVoList;
            // }

            // cartableItemsScope = dlist;

            // $rootScope.$applyAsync(function () {
            //     if( _that.getCartableData().read == false){
            //         $rootScope.unreadCount++;
            //     }
            // })

            // $scope.$applyAsync(function () {
            //     var isnull = false;


            //     if(_that.getCartableData().parentProcessVo && _that.getCartableData().parentProcessVo.processCode && _that.getCartableData().parentProcessVo.processCode == "ApproveLetterProcess"){
            //         $scope.isApprove = true;
            //     }


            //     $scope.read = cartableItemsScope.read;
            

            //     $scope.startTimeCartable = cartableItemsScope.startTimeCartable;



            //     cartableItemsScope.forEach(function(entry) {

            //         if(entry.key == 'letterNo' && !entry.content)
            //             isnull = true;

            //         if(entry.key == 'letterNo' && entry.content)
            //             isnull = false;

            //         $scope[entry.key] = entry.content;

            //     });

            //     if(!isnull){
            //         $scope.cartableItems = cartableItemsScope;
            //         isnull = false;
            //     }
            //     else
            //         $scope.cartableItems = [];

            // })



            // $scope.$applyAsync(function () {


            //     if($scope.letterNo){
            //         var s = $scope.letterNo;
            //         s = s.split("OUT")
            //         if(s.length > 1){
            //             $scope.isApprove = true;
            //         }
            //     }
            //     else{
            //         $scope.isApprove = true;
            //     }



            //     if($scope.body){

            //         var rex = /(<([^>]+)>)/ig;
            //         $scope.body = $scope.body.replace(rex , "");
            //         $scope.body = truncate($scope.body);

            //     }
            //     else


            //     if($scope.date){
            //         if(!$scope.startTimeCartable){

            //             $scope.date = new Date($scope.date).getTime();

            //             var d = new Date(parseInt($scope.date));
            //             var j = new JDate(d);
            //             $scope.letterDatePersian = j.toLocaleString();
                       
            //             $scope.date = jQuery.timeago(new Date($scope.date)).toPersianDigits()
            //         }
            //         else{

            //             var d = new Date(parseInt($scope.startTimeCartable));
            //             var j = new JDate(d);
            //             $scope.letterDatePersian = j.toLocaleString();

            //             $scope.date = jQuery.timeago($scope.startTimeCartable).toPersianDigits()
            //         }
            //     }else{
            //         var j = new JDate(cartableItems.startTime);
            //         $scope.letterDatePersian = j.toLocaleString();
            //     }


            //     if($scope.toPerson){

            //         if(Array.isArray($scope.toPerson)){
            //             $scope.toPerson.toString();

            //         }
            //         else{
            //             if($scope.toPerson.includes("[")){
            //                 $scope.toPerson = $scope.toPerson.replace("[", "");
            //                 $scope.toPerson = $scope.toPerson.replace("]", "");
            //             }
            //         }


                

            //         $scope.toPerson = BundleService.getKeyValueFromBundle("TO_PERSON") + $scope.toPerson;
            //     }
            //     else{
            //         $scope.toPerson = BundleService.getKeyValueFromBundle("TO_PERSON") + BundleService.getKeyValueFromBundle("NULL")
            //     }


            //     $scope.fromPerson = $scope.fromPerson ? BundleService.getKeyValueFromBundle("FROM_PERSON") + $scope.fromPerson
            //         : BundleService.getKeyValueFromBundle("FROM_PERSON") + BundleService.getKeyValueFromBundle("NULL");


            //     if($scope.ccPersonSet){

            //         if(Array.isArray($scope.ccPersonSet)){
            //             $scope.ccPersonSet.toString();
            //         }
            //         else{
            //             if($scope.ccPersonSet.includes("[")){
            //                 $scope.ccPersonSet = $scope.ccPersonSet.replace("[", "");
            //                 $scope.ccPersonSet = $scope.ccPersonSet.replace("]", "");
            //             }
            //         }

            //         $scope.ccPersonSet = BundleService.getKeyValueFromBundle("CC_PERSON") + $scope.ccPersonSet;
            //     }

            // })

        });
    }
}


