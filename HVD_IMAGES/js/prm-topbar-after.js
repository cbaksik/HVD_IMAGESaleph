/**
 * Created by samsan on 6/29/17.
 */

angular.module('viewCustom')
    .controller('prmTopbarAfterController', [ '$sce', 'angularLoad', function ($sce, angularLoad) {

        let vm = this;
        vm.$onChanges=function() {
            // hide primo tab menu
            vm.parentCtrl.showMainMenu=false;

        };



    }]);


angular.module('viewCustom')
    .component('prmTopbarAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmTopbarAfterController'
    });
