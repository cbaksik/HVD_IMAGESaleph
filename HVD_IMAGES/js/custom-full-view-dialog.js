/**
 * Created by samsan on 5/17/17.
 */
angular.module('viewCustom')
    .controller('customFullViewDialogController', [ '$sce', 'angularLoad','prmSearchService','items', function ($sce, angularLoad, prmSearchService, items) {
        // local variables
        let vm = this;
        vm.item = items;
        // hide virtual browse shelf section on the page
        if(vm.item.enrichment.virtualBrowseObject) {
            vm.item.enrichment.virtualBrowseObject.isVirtualBrowseEnabled = false;
        }
        // hide online
        console.log(vm.item.delivery.GetIt1[0].links[0].isLinktoOnline);
        vm.item.delivery.GetIt1[0].links[0].isLinktoOnline=false;

        console.log('*** vm.item of dialog ***');
        console.log(vm.item);


    }]);




