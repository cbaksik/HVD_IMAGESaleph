/**
 * Created by samsan on 5/22/17.
 * Access search box json data. Then change the number item per page. See prm-search-service.js file
 */
angular.module('viewCustom')
    .controller('prmSearchBarAfterController', [ 'angularLoad','prmSearchService','$location', function (angularLoad,prmSearchService,$location) {
        let vm=this;
        // initialize custom service search
        let sv=prmSearchService;
        // get page object
        let pageObj=sv.getPage();
        // remove local storage
        sv.removePageInfo();

        vm.$onChanges=function() {
            pageObj.currentPage = 1;
            pageObj.totalItems = 0;
            pageObj.totalPages = 0;
            sv.setPage(pageObj);

            // show text in search box
            if(!vm.parentCtrl.mainSearchField) {
                var params=$location.search();
                vm.parentCtrl.mainSearchField=params.searchString;
            }

        };

    }]);



angular.module('viewCustom')
    .component('prmSearchBarAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmSearchBarAfterController',
        'template':`<div id="searchResultList"></div>`
    });


// override the limit=10 when a user refresh page at search result list
angular.module('viewCustom').config(['$httpProvider',function ($httpProvider) {

    $httpProvider.interceptors.push(function() {
        return {
            'request': function (config) {
                if(config.params) {
                    if(config.params.limit===10 && config.params.offset===0) {
                        config.params.limit = 50;
                    }
                }
                return config;
            },

            'response': function (response) {
                return response;
            }
        };

    });


}]);