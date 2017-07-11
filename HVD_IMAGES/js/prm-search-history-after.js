/**
 * Created by samsan on 7/10/17.
 */

angular.module('viewCustom')
    .controller('prmSearchHistoryAfterController', [ 'prmSearchService','$window', function (prmSearchService,$window) {

        var sv=prmSearchService;
        var vm = this;
        vm.itemlist=[];

        var db;
        var request=$window.indexedDB.open('If',2);
        request.onerror=function (err) {
            console.log('*** error ***');
            console.log(err);
        };

        request.onsuccess=function(e) {
            db=request.result;
            console.log('*** success ***');
            console.log(db);
        };

        request.onupgradeneeded=function (e) {
            console.log('*** upgrade needed ****');
            console.log(e);
        };


        vm.$doCheck=function() {
            vm.itemlist=vm.parentCtrl.searchHistoryService.items;
            //console.log('*** prm-search-history-after ****');
            //console.log(vm);
        };

        vm.removeSearchHistoryItem=function (id) {
            console.log(request);
            console.log(db);

        }


    }]);


angular.module('viewCustom')
    .component('prmSearchHistoryAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmSearchHistoryAfterController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-search-history-after.html'
    });
