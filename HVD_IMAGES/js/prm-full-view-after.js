/**
 * Created by samsan on 5/17/17.
 */
angular.module('viewCustom')
    .controller('FullViewAfterController', [ '$sce', 'angularLoad','$http','prmSearchService','$window', function ($sce, angularLoad, $http, prmSearchService, $window) {
        // local variables

        let vm = this;
        this.item = vm.parentCtrl.item;

        console.log('*** full view after ***');
        console.log(vm.parentCtrl);



        vm.$onInit = function () {
            vm.parentCtrl.$scope.$watch(()=>vm.parentCtrl.searchResults, (newVal, oldVal)=>{

                console.log('*** searchInfo ***');
                console.log(vm.parentCtrl);

                if(oldVal !== newVal){

                    console.log('*** searchInfo ***');
                    console.log(vm.parentCtrl);

                    vm.items = newVal;


                }


            });
        };



    }]);



angular.module('viewCustom')
    .component('prmFullViewAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'FullViewAfterController',
        templateUrl: '/primo-explore/custom/HVD_IMAGES/html/prm-full-view-after.html'
    });


