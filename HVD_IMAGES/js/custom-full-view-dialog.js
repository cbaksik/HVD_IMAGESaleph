/**
 * Created by samsan on 5/17/17.
 */
angular.module('viewCustom')
    .controller('customFullViewDialogController', [ '$sce', 'angularLoad','items', function ($sce, angularLoad, items) {
        // local variables
        let vm = this;
        vm.item = items;

    }]);




