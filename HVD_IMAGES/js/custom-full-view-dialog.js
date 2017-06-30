/**
 * Created by samsan on 5/17/17.
 * A custom modal dialog when a user click on thumbnail on search result list page
 */
angular.module('viewCustom')
    .controller('customFullViewDialogController', [ '$sce', 'angularLoad','items','$mdDialog','prmSearchService', function ($sce, angularLoad, items, $mdDialog,prmSearchService) {
        // local variables
        let vm = this;
        let sv=prmSearchService;
        vm.item = items.item;
        vm.searchData = items.searchData;

        sv.setItem(items);
        vm.closeDialog=function() {
            $mdDialog.hide();
        };


    }]);




