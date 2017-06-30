/**
 * Created by samsan on 6/30/17.
 */
angular.module('viewCustom')
    .controller('prmBriefResultContainerAfterController', [ '$sce', 'angularLoad', function ($sce, angularLoad) {

        let vm = this;

        vm.$onChanges=function() {
            // hide IMAGE
            vm.parentCtrl.showItemType=false;

        };



    }]);


angular.module('viewCustom')
    .component('prmBriefResultContainerAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmBriefResultContainerAfterController'
    });

