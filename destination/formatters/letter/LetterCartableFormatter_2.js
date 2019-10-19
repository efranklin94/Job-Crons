
CartableFormatters.LetterCartableFormatter = function(angularModule) {
    if(!(this instanceof CartableFormatters.LetterCartableFormatter))
        return new CartableFormatters.LetterCartableFormatter(angularModule);

    BaseCartableFormatter.call(this, 'LetterCartableFormatter', angularModule);
    var _that = this;

    this.getTemplateURL = function() {
        return "js/plugins/PAT/formatters/letter/LetterCartableFormatter_2.html";
    }

    this.defineController = function() {
        var controllerName = _that.getControllerName();

        _that.getAngularModule().register.controller(controllerName, function ($scope,$rootScope,notificationService) {
            $scope.myPop;
            ons.ready(function() {
                ons.createPopover('LetterTypepopover.html').then(function(popover) {
                    $scope.myPop = popover;
                    $rootScope.popTest = popover;
                });
            });

            


            $rootScope.subProcessList = [];



            var cartableItems = _that.getCartableData();
            if(!cartableItems.bundledProcessName)
                cartableItems.bundledProcessName = cartableItems.name;

                cartableItems.JstartTime = convertJalali(cartableItems.startTime)

                

                ProcessStatusArray.forEach(function(value, index){
                    
                    if(value.name == cartableItems.processStatus)
                        $scope.sideColor = value.color;

                });
                    
                    




            $scope.cartableItems = cartableItems;
        });
    }
}


