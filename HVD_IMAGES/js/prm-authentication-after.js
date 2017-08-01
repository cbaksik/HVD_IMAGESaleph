/**
 * Created by samsan on 5/25/17.
 */

angular.module('viewCustom')
    .controller('prmAuthenticationAfterController', ['prmSearchService', function (prmSearchService) {
        let vm=this;
        // initialize custom service search
        let sv=prmSearchService;
        // check if a user login
        vm.$onChanges=function(){
            // This flag is return true or false
            let loginID=vm.parentCtrl.isLoggedIn;
            sv.setLogInID(loginID);
            sv.setAuth(vm.parentCtrl);
        };

    }]);



angular.module('viewCustom')
    .component('prmAuthenticationAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmAuthenticationAfterController'
    });

