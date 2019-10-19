var backButton = function(el) {
	angular.element(el).scope().backButton();
}

var stateObserver =(function() {
	var eventSubscriberMap = {};

	return {
		subscribe: function(stateName, f) {
			if(!eventSubscriberMap[stateName])
				eventSubscriberMap[stateName] = [];
			eventSubscriberMap[stateName].push(f);
		},
		notifySubscribers : function(stateName) {
			var subscribers = eventSubscriberMap[stateName];
			for(var i = 0; i < subscribers.length; i++) {
				subscribers[i].call();
			}
		}
	}
})();

SearchTemplates.LetterSearchBySecretary = function(searchParameters) {
	if (!(this instanceof SearchTemplates.LetterSearchBySecretary))
        return new SearchTemplates.LetterSearchBySecretary(searchParameters);

    BaseSearchTemplate.call(this, searchParameters);
    var _that = this;

    this.getTemplateURL = function() {
        return "js/plugins/PAT/search-forms/LetterSearchBySecretary/LetterSearchBySecretary.html";
    }

    stateObserver.subscribe('collapsed', function() {
        var _thatElem = $('#searchBarChevron')[0];
        _thatElem.state = "collapsed";
        var height = $("#searchParent").height() - $(_thatElem).height();

        $(_thatElem).find('i').css('transition', 'rotate 1s');
        $("#searchParent").css('position', 'absolute');
        $("#searchParent").css('width','100%');
        $("#searchParent").css('top', '-1px');
        setTimeout(function() {
            var func = function() {
                $(_thatElem).find('i').css('transform', 'rotate(180deg)');
                _thatElem.removeEventListener('transitionend', func);
            }
            _thatElem.addEventListener("transitionend", func);
            $("#searchParent").css('top', -1 * height + 'px');
        }, 10);
    });

    stateObserver.subscribe('uncollapsed', function() {
        var _thatElem = $('#searchBarChevron')[0];
        _thatElem.state = null;
        $("#searchParent").css('position', 'absolute');
        $("#searchParent").css('width','100%');
        $("#searchParent").css('top', '0px');
        var func = function()  {
            $(_thatElem).find('i').css('transform', '');
            _thatElem.removeEventListener('transitionend', func);
        }
        _thatElem.addEventListener("transitionend", func);
    });

    this.defineController = function() {
        var controllerName = "LetterSearchBySecretary_" + (new Date().getTime());
        _that.setControllerName(controllerName);

        angular.module('myApp').register.controller(controllerName, function ($scope, $rootScope, $state, $http, $q, notificationService) {

            $scope.selectedLettypes = [];
            $scope.selectedSecList = [];

            $scope.startProcess = function(letter, $event) {
                if($scope["continueProcessInProgress"] == letter.letid)
                    return;

                $scope["continueProcessInProgress"] = letter.letid;
                $scope.$applyAsync(function() {
                    $scope["continueProcessInProgress"] = letter.letid;
                });

                setTimeout(function() {
                    $scope.$applyAsync(function() {
                       $scope["continueProcessInProgress"] = null;
                    });
                }, 5000);

                var params = {};

                params.processCode = "PAT_BP_SearchAndViewLetters";
                params.nodeId = "_29";
                params.engineName = _that.getProcessObject().engineName;

                params.fromSearch = "true";
                params.processDataContent = [];

                var tempJson = {};
                tempJson.key = letter.flowid;
                tempJson.value = letter.subj;
                tempJson.row = letter;

                params.processDataContent.push(tempJson)
                params.processDataContent = JSON.stringify(params.processDataContent);

                $rootScope.getSelectedUserPostId(function(userPostId) {
                    params.userPostId = userPostId;
                    adapterService.startProcess(params);
                });
            }

            var lettypeList = [];
            lettypeList.push({id: "INT_OUT_LETTER", name: "نامه داخلی - صادره"});
            lettypeList.push({id: "INCOMING_LETTER", name: "نامه وارده"});
            lettypeList.push({id: "OUTGOING_LETTER", name: "نامه صادره"});
            lettypeList.push({id: "INTERNAL_LETTER", name: "نامه داخلی"});
            $scope.lettypeList = lettypeList;

            var securityList = [];
            securityList.push({id: "HIGH_SECURE", name: "سری"});
            securityList.push({id: "NORMAL", name: "عادی"});
            securityList.push({id: "CONFIDENTIAL", name: "محرمانه"});
            securityList.push({id: "HIGH_CONFIDENTIAL", name: "خیلی محرمانه"});
            $scope.securityList = securityList;

            var priorityList = [];
            priorityList.push({id: "VERY_HIGH", name: "فوری"});
            priorityList.push({id: "HIGH", name: "بالا"});
            priorityList.push({id: "MODERATE", name: "عادی"});
            priorityList.push({id: "LOW", name: "پایین"});
            $scope.priorityList = priorityList;

            $scope.showCalendarDateFrom = function(destination) {
                var actionArray = {"date": "today"};
                cordova.plugins.adaptercall.getPersianDate(actionArray, function (message) {
                    $scope.$applyAsync(function() {
                        switch(destination){
                            case "cdate":
                                $scope.cdateFromTimeStamp = new JDate(message.date).getTime();
                                $scope.cdateFromAsPersian = message.date;
                                break;
                            case "verifydate":
                                $scope.verifydateFromTimeStamp = new JDate(message.date).getTime();
                                $scope.verifydateFromAsPersian = message.date;
                                break;
                        }
                    });
                });
            }

            $scope.showCalendarDateTo = function(destination) {
                var actionArray = {"date": "today"};
                cordova.plugins.adaptercall.getPersianDate(actionArray, function (message) {
                    $scope.$applyAsync(function() {
                        switch(destination){
                            case "cdate":
                                $scope.cdateToTimeStamp = new JDate(message.date).getTime();
                                $scope.cdateToAsPersian = message.date;
                                break;
                            case "verifydate":
                                $scope.verifydateToTimeStamp = new JDate(message.date).getTime();
                                $scope.verifydateToAsPersian = message.date;
                                break;
                        }
                    });
                });
            }

            $("#searchBarChevron").click(function() {
                if(!(this.state)) {
                    this.state = "collapsed";
                    stateObserver.notifySubscribers('collapsed');
                } else {
                    this.state = null;
                    stateObserver.notifySubscribers('uncollapsed');
                }
            });

            var displayLetterSearchList = function(searchLetterData) {
                if(searchLetterData) {
                    for(var i = 0; i < searchLetterData.length; i++) {
                        if(searchLetterData[i].cdate)
                            searchLetterData[i].cdateAsPersian = new JDate(searchLetterData[i].cdate).toLocaleString();
                    }
                }

                $scope.$applyAsync(function() {
                    if(!$scope.searchLetterData)
                        $scope.searchLetterData = searchLetterData;
                    else
                        Array.prototype.push.apply($scope.searchLetterData, searchLetterData);
                });
            }

            $scope.lastFetchedIndex = 0;
            $scope.searchAndViewLetters = function($event, loadMore) {
                if($scope.searchLetterLoad)
                    return;

                $scope.searchLetterLoad = true;
                setTimeout(function() {
                    $scope.$applyAsync(function() {
                        $scope.searchLetterLoad = false;
                    });
                }, 100000);


                var dates = {};
                if($scope.cdateFromTimeStamp) {
                    var d = new Date($scope.cdateFromTimeStamp);
                    dates.cdateFrom = {};
                    dates.cdateFrom.year = d.getFullYear();
                    dates.cdateFrom.month = d.getMonth() + 1;
                    dates.cdateFrom.day = d.getDate();
                    dates.cdateFrom = JSON.stringify(dates.cdateFrom);
                }

                if($scope.cdateToTimeStamp) {
                    var d = new Date($scope.cdateToTimeStamp);
                    dates.cdateTo = {};
                    dates.cdateTo.year = d.getFullYear();
                    dates.cdateTo.month = d.getMonth() + 1;
                    dates.cdateTo.day = d.getDate();
                    dates.cdateTo = JSON.stringify(dates.cdateTo);
                }

                if($scope.verifydateFromTimeStamp) {
                    var d = new Date($scope.verifydateFromTimeStamp);
                    dates.verifydateFrom = {};
                    dates.verifydateFrom.year = d.getFullYear();
                    dates.verifydateFrom.month = d.getMonth() + 1;
                    dates.verifydateFrom.day = d.getDate();
                    dates.verifydateFrom = JSON.stringify(dates.verifydateFrom);
                }

                if($scope.verifydateToTimeStamp) {
                    var d = new Date($scope.verifydateToTimeStamp);
                    dates.verifydateTo = {};
                    dates.verifydateTo.year = d.getFullYear();
                    dates.verifydateTo.month = d.getMonth() + 1;
                    dates.verifydateTo.day = d.getDate();
                    dates.verifydateTo = JSON.stringify(dates.verifydateTo);
                }

                var multiselectlists = {};
                if($scope.selectedSecList != null) {
                    multiselectlists.securitycodes = [];
                    for(var i = 0; i < $scope.selectedSecList.length; i++) {
                        multiselectlists.securitycodes.push($scope.selectedSecList[i]);
                    }
                }

                if($scope.selectedPrioList != null) {
                    multiselectlists.prioritycodes = [];
                    for(var i = 0; i < $scope.selectedPrioList.length; i++) {
                        multiselectlists.prioritycodes.push($scope.selectedPrioList[i]);
                    }
                }

                var params = {
                    "connectionName": _that.getProcessObject ? _that.getProcessObject().engineName : "pattest.ow",
                    "searchName": "LetterSearchBySecretary",
                    "filters": [
                        {
                            name: "subj",
                            value: $scope.subject,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "no",
                            value: $scope.no,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "lettypeid",
                            value: $scope.lettypeid,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "cdate",
                            value: dates.cdateFrom,
                            type: "Edm.DateTime",
                            operator: "ge"
                        },
                        {
                            name: "cdate",
                            value: dates.cdateTo,
                            type: "Edm.DateTime",
                            operator: "le"
                        },
                        {
                            name: "verifydate",
                            value: dates.verifydateFrom,
                            type: "Edm.DateTime",
                            operator: "ge"
                        },
                        {
                            name: "verifydate",
                            value: dates.verifydateTo,
                            type: "Edm.DateTime",
                            operator: "le"
                        },
                        {
                            name: "fromtitle",
                            value: $scope.fromPerson,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "orgtitle",
                            value: $scope.fromOrg,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "topersontitle",
                            value: $scope.toPerson,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "toorgtitle",
                            value: $scope.toOrg,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "taskno",
                            value: $scope.taskNo,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "keywords",
                            value: $scope.keywords,
                            type: "Edm.String",
                            operator: "substringof"
                        },
                        {
                            name: "securitycode",
                            value: multiselectlists.securitycodes,
                            type: "Edm.String",
                            operator: "eq"
                        },
                        {
                            name: "prioritycode",
                            value: multiselectlists.prioritycodes,
                            type: "Edm.String",
                            operator: "eq"
                        },
                        {
                            name: "vrperson",
                            value: searchParameters.vrPerson,
                            type: "Edm.String",
                            operator: "eq"
                        }
                    ]
                };

                params.from = loadMore ? $scope.lastFetchedIndex : 0;
                params.to = loadMore ? $scope.lastFetchedIndex + 10 : 10;
                if(!loadMore)
                    $scope.searchLetterData = [];

                adapterService.universalSearch(params).then(function(searchLetterData) {
                    $scope.lastFetchedIndex += 10;

                    stateObserver.notifySubscribers('collapsed');
                    setTimeout(function() {
                        var _thatElem = $('#searchBarChevron')[0];
                        $(_thatElem).find('i').css('transform', 'rotate(180deg)');

                    }, 500);

                    displayLetterSearchList(searchLetterData);
                    $scope.$applyAsync(function() {
                        $scope.searchLetterLoad = false;
                    });
                });

            }

            $scope.toolbarTitle = BundleService.getKeyValueFromBundle("PAT_Secretary");
            setTimeout(function() {
                $('#toolbarTitle').text($scope.toolbarTitle);
            }, 500);

            $scope.backButton = function () {
                $state.go('base.CartableDisplayState');
            };

            setTimeout(function() {
              $('.mobileSelect').mobileSelect({
                    animation: 'zoom',
                    buttonSave: 'انتخاب',
                    buttonClear: 'پاک کردن',
                    buttonCancel: 'انصراف'
              });
            }, 1000);

            $scope.continueProcessInProgress = true;

        });

    }
}
