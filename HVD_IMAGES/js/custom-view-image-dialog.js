/**
 * Created by samsan on 6/5/17.
 * A modal dialog pop up the image when a user click on thumbnail image in view full detail page
 */

angular.module('viewCustom')
    .controller('customViewImageDialogController', [ '$sce', 'angularLoad','items','$mdDialog', function ($sce, angularLoad, items, $mdDialog) {
        // local variables
        let vm = this;
        vm.item = items;

        // close modal dialog when a user click on x icon
        vm.closeImage=function () {
            $mdDialog.hide();
        }

    }]);
