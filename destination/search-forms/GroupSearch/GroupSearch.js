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

SearchTemplates.GroupSearch = function(searchParameters) {
	if (!(this instanceof SearchTemplates.GroupSearch))
        return new SearchTemplates.GroupSearch(searchParameters);

    BaseSearchTemplate.call(this, searchParameters);
    var _that = this;

    this.getTemplateURL = function() {
        return "js/plugins/PAT/search-forms/GroupSearch/GroupSearch.html";
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
        var controllerName = "SearchAndViewLetter_" + (new Date().getTime());
        _that.setControllerName(controllerName);

        angular.module('myApp').register.controller(controllerName, function ($scope, $rootScope, $state, $http, $q, notificationService) {

            $scope.selectedLettypes = [];
            $scope.selectedSecList = [];

            $scope.startProcess = function(letter, $event) {
                if($scope["continueProcessInProgress"] == letter.gid)
                    return;

                $scope["continueProcessInProgress"] = letter.gid;
                $scope.$applyAsync(function() {
                    $scope["continueProcessInProgress"] = letter.gid;
                });

                setTimeout(function() {
                    $scope.$applyAsync(function() {
                       $scope["continueProcessInProgress"] = null;
                    });
                }, 5000);

                var params = {};

                params.processCode = "PAT_BP_DefineBasicInfo";
                params.nodeId = "_75";
                params.engineName = _that.getProcessObject().engineName;

                params.fromSearch = "true";
                params.processDataContent = [];

                // SAMPLE: [{"key":"21","value":"گروه IT","row":{"gid":"21","gutitle":"گروه IT"}}]
                var tempJson = {};
                tempJson.key = letter.gid;
                tempJson.value = letter.gutitle;
                tempJson.row = {
                    gid: letter.gid,
                    gutitle: letter.gutitle
                }

                params.processDataContent.push(tempJson)
                params.processDataContent = JSON.stringify(params.processDataContent);

                $rootScope.getSelectedUserPostId(function(userPostId) {
                    params.userPostId = userPostId;
                    adapterService.startProcess(params);
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

                var params = {
                    searchName: "GroupSearch",
                    filters: [
                        {
                            name: "gutitle",
                            value: $scope.subject,
                            type: "Edm.String",
                            operator: "substringof"
                        }
                    ]
                }
                params.from = loadMore ? $scope.lastFetchedIndex : 0;
                params.to = loadMore ? $scope.lastFetchedIndex + 10 : 10;
                params.connectionName = _that.getProcessObject().engineName;
                if(!loadMore)
                    $scope.searchLetterData = [];

                adapterService.universalSearch(params).then(function(searchLetterData) {
                    $scope.lastFetchedIndex += searchLetterData.length;

                    stateObserver.notifySubscribers('collapsed');
                    setTimeout(function() {
                        var _thatElem = $('#searchBarChevron')[0];
                        $(_thatElem).find('i').css('transform', 'rotate(180deg)');

                    }, 500);

                    displayLetterSearchList(searchLetterData);
                    $scope.$applyAsync(function() {
                        $scope.searchLetterLoad = false;
                    });
                }, function(err){
                    console.log("An error occured fetching data from search. Error: ", err);
                    $scope.$applyAsync(function() {
                        $scope.searchLetterLoad = false;
                    });
                });

            }

            $scope.toolbarTitle = "گروه ها";
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
