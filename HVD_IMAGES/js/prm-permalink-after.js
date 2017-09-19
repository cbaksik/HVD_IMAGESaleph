/**
 * Created by samsan on 9/18/17.
 */

angular.module('viewCustom')
    .controller('prmPermalinkAfterCtrl',['$scope',function ($scope) {
        var vm=this;
        vm.$onInit=function () {
            // change perm a link to correct url
            $scope.$watch('vm.parentCtrl.permalink',function () {
                if(vm.parentCtrl.item){
                    if(vm.parentCtrl.item.pnx.display.lds03[0]) {
                        vm.parentCtrl.permalink = vm.parentCtrl.item.pnx.display.lds03[0];
                    }
                }
            });
        };
    }]);

angular.module('viewCustom')
    .component('prmPermalinkAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmPermalinkAfterCtrl',
        controllerAs:'vm'
    });
