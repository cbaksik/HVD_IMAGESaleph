/**
 * Created by samsan on 7/7/17.
 * This component is for favorite section when a user pin his or her favorite image.
 */

angular.module('viewCustom')
    .controller('prmFavoritesAfterController', ['prmSearchService',function (prmSearchService) {

        var sv=prmSearchService;
        var vm = this;
        vm.dataList = vm.parentCtrl;

        vm.$doCheck=function() {
            vm.dataList = vm.parentCtrl;
            vm.isFavorites=true;
            vm.isSearchHistory=true;
            vm.isSavedQuery=true;
            if(vm.dataList.favoritesService) {
                vm.savedQueryItems = vm.dataList.favoritesService.searchService.searchHistoryService.savedQueriesService.items;
                vm.historyItem = vm.dataList.favoritesService.searchService.searchHistoryService.items;
            }

        };






    }]);


angular.module('viewCustom')
    .component('prmFavoritesAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmFavoritesAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-favorites-after.html'
    });

