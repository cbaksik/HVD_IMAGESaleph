/**
 * Created by samsan on 7/10/17.
 */

angular.module('viewCustom')
    .controller('prmSearchHistoryAfterController', [ 'prmSearchService','$window', function (prmSearchService,$window) {

        var sv=prmSearchService;
        var vm = this;
        vm.itemlist=[];

        vm.$doCheck=function() {
            vm.itemlist=vm.parentCtrl.searchHistoryService.items;
            console.log('***** prm-search-history-after ****');
            console.log(vm);
        };

        vm.removeSearchHistoryItem=function (id) {
            var indexedDB=$window.indexedDB;
            console.log(id);
            console.log(indexedDB);


        }


    }]);


angular.module('viewCustom')
    .component('prmSearchHistoryAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmSearchHistoryAfterController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-search-history-after.html'
    });
