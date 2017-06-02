/**
 * Created by samsan on 5/22/17.
 * Access search box json data. Then change the number item per page. See prm-search-service.js file
 */
angular.module('viewCustom')
    .controller('prmSearchBarAfterController', [ 'angularLoad','prmSearchService', function (angularLoad,prmSearchService) {
        let vm=this;
        // initialize custom service search
        let sv=prmSearchService;
        // get page object
        let pageObj=sv.getPage();
        // remove local storage
        sv.removePageInfo();

        vm.$onChanges=function() {
            // number items per page to display from search box, updated the limit size in http request
            vm.parentCtrl.searchService.searchStateService.resultsBulkSize = pageObj.pageSize;
            pageObj.currentPage = 1;
            pageObj.totalItems = 0;
            pageObj.totalPages = 0;
            sv.setPage(pageObj);

        }

    }]);



angular.module('viewCustom')
    .component('prmSearchBarAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmSearchBarAfterController',
        'template':`<div id="searchResultList"></div>`
    });


