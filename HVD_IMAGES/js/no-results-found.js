/**
 * Created by samsan on 6/22/17.
 */

angular.module('viewCustom')
    .component('noResultsFound', {
        templateUrl:'/primo-explore/custom/HVD_IMAGES/html/no-results-found.html',
        bindings: {
            itemlength:'<',
        },
        controllerAs:'vm',
        controller:[function () {
            var vm=this;
            vm.localScope={'showFlag':false};

            vm.$onChanges=function () {
                if(vm.itemlength===0) {
                    vm.localScope.showFlag=true;
                }
            };


        }]
    });
