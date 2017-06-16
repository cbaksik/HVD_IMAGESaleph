/**
 * Created by samsan on 5/30/17.
 */

angular.module('viewCustom')
    .controller('prmFacetAfterController', [ 'angularLoad','prmSearchService','$location', function (angularLoad,prmSearchService,$location) {
        let vm=this;
        vm.params=$location.search();
        let sv=prmSearchService;
        // get page object
        var pageObj=sv.getPage();

        vm.$onChanges=function() {
            console.log('*** prm facet after ****');
            console.log(vm);
            // if there is no facet, remove it from service
            if(!vm.parentCtrl.$stateParams.facet) {
                // reset facet if it is empty
                pageObj.currentPage=1;
                sv.setPage(pageObj);
                sv.setFacets([]);
            }
        }

    }]);



angular.module('viewCustom')
    .component('prmFacetAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmFacetAfterController'
    });

