/**
 * Created by samsan on 6/5/17.
 */

angular.module('viewCustom')
    .controller('customViewImageDialogController', [ '$sce', 'angularLoad','items','$mdDialog', function ($sce, angularLoad, items, $mdDialog) {
        // local variables
        let vm = this;
        vm.item = items;

        vm.closeImage=function () {
            $mdDialog.hide();
        }

    }]);
