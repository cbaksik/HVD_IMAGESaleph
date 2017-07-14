/**
 * Created by samsan on 7/10/17.
 */

angular.module('viewCustom')
    .controller('prmSearchHistoryAfterController', [ 'prmSearchService','$window', function (prmSearchService,$window) {

        var sv=prmSearchService;
        var vm = this;
        vm.itemlist=[];

        // open database connection, dbName=lf, dbVersion=2
        var db;
        var request=$window.indexedDB.open('lf',2);
        request.onerror=function (err) {
            console.log('*** error ***');
            console.log(err);
        };

        request.onsuccess=function(e) {
            db=request.result;
            console.log('*** success ***');
            console.log(db);
        };

        // for update or create new record
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
            //anonymous-0712_145554_SearchHistoryQeuriesKey

            var query=db.transaction(['keyvaluepairs'],"readwrite").objectStore('keyvaluepairs').get('anonymous-0712_145554_SearchHistoryQeuriesKey');

            console.log(query);

            query.onerror=function (err) {
                console.log('*** error ***');
                console.log(err);
            };

            query.onsuccess=function(e) {
                var result=query.result;
                console.log('* success result ***');
                console.log(result);
                console.log('*** id ***');
                console.log(id);
            };

        }


    }]);


angular.module('viewCustom')
    .component('prmSearchHistoryAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmSearchHistoryAfterController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-search-history-after.html'
    });
