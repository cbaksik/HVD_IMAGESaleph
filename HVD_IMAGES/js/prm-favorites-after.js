/**
 * Created by samsan on 7/7/17.
 * This component is for favorite section when a user pin his or her favorite image.
 */

angular.module('viewCustom')
    .controller('prmFavoritesAfterController', ['prmSearchService','$element','$mdMedia',function (prmSearchService,$element,$mdMedia) {

        var sv=prmSearchService;
        var vm = this;
        vm.dataList = vm.parentCtrl;
        vm.flexSize={'col1':80,'col2':20}; // set up grid size for different screen
        vm.logInID=sv.getLogInID();
        vm.selectedIndex=0;

        vm.selectTab=function (tab) {
           if(sv.getLogInID()) {

           }
        };

        // access ajax data from search component list of primo
        vm.$doCheck=function() {
            vm.logInID=sv.getLogInID();
            vm.dataList = vm.parentCtrl;
            vm.isFavorites=true;
            vm.isSearchHistory=true;
            vm.isSavedQuery=true;
            if(vm.dataList.favoritesService) {
                if(sv.getLogInID()) {
                    vm.savedQueryItems = vm.dataList.favoritesService.searchService.searchHistoryService.savedQueriesService.items;
                    vm.historyItem = vm.dataList.favoritesService.searchService.searchHistoryService.items;
                } else {
                    vm.savedQueryItems = [];
                    vm.historyItem = vm.dataList.favoritesService.searchService.searchHistoryService.items;
                }
            }

        };

        vm.$onChanges=function() {
            // remove the above element
            var el=$element[0].parentNode.children[1].children[1].children[1];
            if(el) {
                el.remove();
            }
            // remove the old tab menu
            var el2=$element[0].parentNode.children[1];
            if(el2) {
                el2.remove();
            }

            if($mdMedia('xs')){
                vm.flexSize.col1=100;
                vm.flexSize.col2=100;
            }
        }




    }]);


angular.module('viewCustom')
    .component('prmFavoritesAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmFavoritesAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-favorites-after.html'
    });

