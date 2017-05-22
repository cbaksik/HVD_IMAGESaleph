/**
 * Created by samsan on 5/22/17.
 */
angular.module('viewCustom')
    .controller('prmSearchBarAfterController', [ 'angularLoad', function (angularLoad) {
        let vm=this;

        vm.parentCtrl.searchService.searchStateService.searchObject.bulkSize=40;
        vm.parentCtrl.bulkSize = 40;

        console.log('*** parentCtrl ***');
        console.log(vm.parentCtrl);

    }]);



angular.module('viewCustom')
    .component('prmSearchBarAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmSearchBarAfterController'
    });


