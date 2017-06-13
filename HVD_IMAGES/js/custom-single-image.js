/**
 * Created by samsan on 6/9/17.
 */

angular.module('viewCustom')
    .controller('customSingleImageController', [ '$sce', 'angularLoad','prmSearchService','$timeout', function ($sce, angularLoad, prmSearchService, $timeout) {

        let sv=prmSearchService;
        let vm = this;

        vm.$onChanges=function() {
            vm=sv.getData();

            console.log('*** custom single Image ***');
            console.log(vm);

            console.log(vm.params);

        }


    }]);


angular.module('viewCustom')
    .component('customSingleImage', {
        bindings: {item: '<',services:'<',params:'<'},
        controller: 'customSingleImageController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-single-image.html'
    });

