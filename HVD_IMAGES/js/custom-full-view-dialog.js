/**
 * Created by samsan on 5/17/17.
 */
angular.module('viewCustom')
    .controller('customFullViewDialogController', [ '$sce', 'angularLoad','$http','prmSearchService','$window','items', function ($sce, angularLoad, $http, prmSearchService, $window, items) {
        // local variables
        console.log('*** local items from dialog ***');
        console.log(items);

        let vm = this;
        vm.item = items;

        console.log('*** full view after ***');
        console.log(vm.item);




    }]);




