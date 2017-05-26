/**
 * Created by samsan on 5/25/17.
 */

angular.module('viewCustom')
    .controller('prmAuthenticationAfterController', [ 'angularLoad','prmSearchService', function (angularLoad,prmSearchService) {
        let vm=this;
        // initialize custom service search
        let sv=prmSearchService;


        console.log('*** prm authentication after ***');
        console.log(vm);

        // check if a user login
        vm.$doCheck=function(){
            let loginID=vm.parentCtrl.isLoggedIn;
            sv.setLogInID(loginID);
        };

    }]);



angular.module('viewCustom')
    .component('prmAuthenticationAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmAuthenticationAfterController'
    });

