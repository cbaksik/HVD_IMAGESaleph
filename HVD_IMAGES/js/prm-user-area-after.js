/**
 * Created by samsan on 5/25/17.
 * This component is to capture if user login or not
 */

angular.module('viewCustom')
    .controller('prmUserAreaAfterController', [ 'angularLoad','prmSearchService', function (angularLoad,prmSearchService) {
        let vm=this;
        // initialize custom service search
        let sv=prmSearchService;

        // check if a user login
        vm.$doCheck=function(){
            let loginID=vm.parentCtrl.userSessionManagerService;
            if(loginID.areaName) {
                // capture user id and store into the service to use with restrict image validation
                //sv.setLogInID(loginID.areaName);
            }
        };

    }]);



angular.module('viewCustom')
    .component('prmUserAreaAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmUserAreaAfterController'
    });