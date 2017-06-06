/**
 * Created by samsan on 5/17/17.
 * A custom modal dialog when a user click on thumbnail on search result list page
 */
angular.module('viewCustom')
    .controller('customFullViewDialogController', [ '$sce', 'angularLoad','items', function ($sce, angularLoad, items) {
        // local variables
        let vm = this;
        vm.item = items;

        console.log('**** vm.item ***');
        console.log(vm.item);

    }]);




