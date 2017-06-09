/**
 * Created by samsan on 6/9/17.
 */

angular.module('viewCustom')
    .controller('customSingleImageController', [ '$sce', 'angularLoad','prmSearchService','$timeout', function ($sce, angularLoad, prmSearchService, $timeout) {

        let sv=prmSearchService;
        let vm = this;
        vm.item=vm.parentCtrl;

        vm.$onChanges=function() {
            vm.item=vm.parentCtrl;

            console.log('*** vm ***');
            console.log(vm);

        }


    }]);


angular.module('viewCustom')
    .component('prmFullViewAfter2', {
        bindings: {parentCtrl: '='},
        controller: 'customSingleImageController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-single-image.html'
    });

