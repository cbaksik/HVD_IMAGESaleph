/**
 * Created by samsan on 5/30/17.
 */

angular.module('viewCustom')
    .controller('prmFacetAfterController', [ 'angularLoad','prmSearchService','$location','$element', function (angularLoad, prmSearchService, $location, $element) {
        let vm=this;
        vm.params=$location.search();
        let sv=prmSearchService;
        // get page object
        var pageObj=sv.getPage();

        vm.$onChanges=function() {
            // change the width of facet column
            var el=$element[0].parentNode.parentNode;
            el.classList.value='sidebar flex-md-30 flex-lg-25';

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

