/**
 * Created by samsan on 5/17/17.
 */
angular.module('viewCustom')
    .controller('prmFullViewAfterController', [ '$sce', 'angularLoad','prmSearchService', function ($sce, angularLoad, prmSearchService) {


        let vm = this;
        let sv=prmSearchService;
        vm.item=sv.getItem();

        vm.$onChanges=function() {
           console.log('**** online item ***');
           console.log(vm.item);
        }


    }]);


angular.module('viewCustom')
    .component('prmFullViewAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmFullViewAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-full-view-after.html'
    });





