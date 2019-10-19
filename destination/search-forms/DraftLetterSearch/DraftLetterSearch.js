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

var ellipsisClicked = function(element) {
	var parentA = $(element).closest('.A')[0];
	if(!parentA.state || parentA.state == 'closed') {
		parentA.state = 'opened';

		$(element).closest('ons-list').find('.A').each(function(i, a) {

			if(a != parentA) {
				a.state = "closed";
				$(a).css('transform', 'translate3d(0%,0,0)');
				$(a).siblings(".B").css('transform', 'translate3d(0%,0,0)');
				var func = function() {
					$(a).find('i').css('transform', 'rotate(0deg)');
					a.removeEventListener('transitionend', func);
				}
				a.addEventListener("transitionend", func);
			}

		});

		var func = function() {
			$(element).find('i').css('transform', 'rotate(180deg)');
			$(element).closest(".A")[0].removeEventListener('transitionend', func);
		}
		$(element).closest(".A")[0].addEventListener("transitionend", func);

		$(element).closest(".A").first().css('transform', 'translate3d(20%,0,0)');
		$(element).closest(".A").siblings(".B").first().css('transform', 'translate3d(120%,0,0)');

	}  else {
		parentA.state = 'closed';

		var func = function() {
			$(element).find('i').css('transform', 'rotate(0deg)');
			$(element).closest(".A")[0].removeEventListener('transitionend', func);
		}
		$(element).closest(".A")[0].addEventListener("transitionend", func);

		$(element).closest(".A").first().css('transform', 'translate3d(0%,0,0)');
		$(element).closest(".A").siblings(".B").css('transform', 'translate3d(0%,0,0)');
	}
}

SearchTemplates.DraftLetterSearch = function(searchParameters) {
	if (!(this instanceof SearchTemplates.DraftLetterSearch))
        return new SearchTemplates.DraftLetterSearch(searchParameters);

    BaseSearchTemplate.call(this, searchParameters);
    var _that = this;

    this.getTemplateURL = function() {
        return "js/plugins/PAT/search-forms/DraftLetterSearch/DraftLetterSearch.html";
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
    	 var controllerName = "DraftLetterSearchController_" + (new Date().getTime());
    	 _that.setControllerName(controllerName);

        angular.module('myApp').register.controller(controllerName, function ($scope, $rootScope, $state, $http, $q, notificationService) {
        	var transitionEndHandle;

        	$scope.startProcess = function(draftLetter, $event) {
                if($scope["continueProcessInProgress"] == draftLetter.letid)
                    return;

                $scope.$applyAsync(function() {
                    $scope["continueProcessInProgress"] = draftLetter.letid;
                });

                setTimeout(function() {
                    $scope.$applyAsync(function() {
                       $scope["continueProcessInProgress"] = null;
                    });
                }, 5000);

    			var params = {};

			    if(searchParameters.directionCode.indexOf("OUTGOING") != -1) {
					params.processCode = "OutgoingLetterFlow";
					params.nodeId = "_15";
				} else {
			    	params.processCode = "LetterFlowProcess";
			    	params.nodeId = "_14";
				}
                params.engineName = _that.getProcessObject().engineName;				
		        params.fromSearch = "true";
		        params.processDataContent = [];

		        var tempJson = {};
		        tempJson.key = draftLetter.letid;
		        tempJson.value = draftLetter.no;
		        tempJson.row = draftLetter;

		        params.processDataContent.push(tempJson)
		        params.processDataContent = JSON.stringify(params.processDataContent);

			    $rootScope.getSelectedUserPostId(function(userPostId) {
			    	params.userPostId = userPostId;
		    		adapterService.startProcess(params);
			    });
        	}

        	$scope.showCalendarDateFrom = function() {
                var actionArray = {"date": "today"};
                cordova.plugins.adaptercall.getPersianDate(actionArray, function (message) {
                    $scope.$applyAsync(function() {
                   		$scope.cdateFromTimeStamp = new JDate(message.date).getTime();
                        $scope.cdateFromAsPersian = message.date;
                    });
                });
            }

            $scope.showCalendarDateTo = function() {
		        var actionArray = {"date": "today"};
		        cordova.plugins.adaptercall.getPersianDate(actionArray, function (message) {
		            $scope.$applyAsync(function() {
		               	$scope.cdateToTimeStamp = new JDate(message.date).getTime();
                        $scope.cdateToAsPersian = message.date;
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

			var displayDraftLetterList = function(draftLetterData) {
				if(draftLetterData) {
					for(var i = 0; i < draftLetterData.length; i++) {
						draftLetterData[i].cdateAsPersian = new JDate(draftLetterData[i].cdate).toLocaleString();         
					}
				}

				$scope.$applyAsync(function(data) {
					$scope.draftLetters = draftLetterData;
				});
			}

			$scope.searchDraftLetters = function($event) {
				if($scope.searchDraftLoad)
					return;
				$scope.searchDraftLoad = true;
				setTimeout(function() {
					$scope.$applyAsync(function() {
						$scope.searchDraftLoad = false;
					});
				}, 4000);

				var params = {};
				params.directioncode= searchParameters.directionCode;
				params.subj = $scope.subject;
				params.no = $scope.no;
				params.oldno = $scope.oldno;

				if($scope.cdateFromTimeStamp) {
					var d = new Date($scope.cdateFromTimeStamp);
					params.cdateFrom = {};
					params.cdateFrom.year = d.getFullYear();
					params.cdateFrom.month = d.getMonth() + 1;
					params.cdateFrom.day = d.getDate();

					params.cdateFrom = JSON.stringify(params.cdateFrom);

				}

				if($scope.cdateToTimeStamp) {
					var d = new Date($scope.cdateToTimeStamp);
					params.cdateTo = {};
					params.cdateTo.year = d.getFullYear();
					params.cdateTo.month = d.getMonth() + 1;
					params.cdateTo.day = d.getDate();

					params.cdateTo = JSON.stringify(params.cdateTo);
				}

				adapterService.searchDraftLetter(params).then(function(draftLetterData) {
					$scope.$applyAsync(function() {
						$scope.searchDraftLoad = false;
					});

					stateObserver.notifySubscribers('collapsed');
					setTimeout(function() {
						var _thatElem = $('#searchBarChevron')[0];
						$(_thatElem).find('i').css('transform', 'rotate(180deg)');
						
					}, 500);
					
					displayDraftLetterList(draftLetterData);
				});
			}

    		$scope.toolbarTitle = AssetManager.getMessage(config.locale.locale, "DRAFT_LETTER_SEARCH");
        	setTimeout(function() {
                $('#toolbarTitle').text($scope.toolbarTitle);
            }, 500);

            $scope.backButton = function () {
	            $rootScope.loadingNew = null;
	            $state.go('base.CartableDisplayState');
	        };	

        });
    }
}