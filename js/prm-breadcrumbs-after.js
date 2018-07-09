/**
 * Created by samsan on 6/13/17.
 */

angular.module('viewCustom')
    .controller('prmBreadcrumbsAfterController', ['prmSearchService', function (prmSearchService) {
        let vm=this;
        // initialize custom service search
        let sv=prmSearchService;
        // get page object


        vm.$onChanges=function() {
            // capture user select facets
            sv.setFacets(vm.parentCtrl.selectedFacets);
            // reset the current page to beginning when a user select new facets
            var pageObj=sv.getPage();
            pageObj.currentPage=1;
            sv.setPage(pageObj);
        }



    }]);



angular.module('viewCustom')
    .component('prmBreadcrumbsAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmBreadcrumbsAfterController'
    });

