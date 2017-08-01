/**
 * Created by samsan on 6/15/17.
 */

angular.module('viewCustom')
    .controller('prmBackToSearchResultsButtonAfterController', [ '$sce', 'angularLoad','$window','prmSearchService','$location', function ($sce, angularLoad, $window, prmSearchService, $location) {

        let vm = this;
        let sv=prmSearchService;
        vm.params=$location.search();

        // get items from custom single image component
        vm.$doCheck=function () {
            vm.photo=sv.getPhoto();
        };

        // go back to search result list
        vm.goToSearch=function () {
            var url='/primo-explore/search?query='+vm.params.q+'&vid='+vm.parentCtrl.$stateParams.vid;
            url+='&sortby='+vm.parentCtrl.$stateParams.sortby+'&lang='+vm.parentCtrl.$stateParams.lang;
            url+='&=search_scope='+vm.parentCtrl.$stateParams.search_scope;
            url+='&searchString='+vm.params.searchString;
            if(vm.parentCtrl.$stateParams.tab) {
                url += '&tab=' + vm.parentCtrl.$stateParams.tab;
            }
            if(vm.params.facet) {
                if(Array.isArray(vm.params.facet)) {
                    for(var i=0; i < vm.params.facet.length; i++) {
                        url += '&facet=' + vm.params.facet[i];
                    }
                } else {
                    url += '&facet=' + vm.params.facet;
                }
            }
            if(vm.params.offset) {
                url+='&offset='+vm.params.offset;
            }
            $window.location.href=url;
        };

        // go back to full display page of thumbnail images
        vm.goToImages=function () {
            var url='/primo-explore/fulldisplay?docid='+vm.parentCtrl.$stateParams.docid+'&q='+vm.params.q+'&vid='+vm.parentCtrl.$stateParams.vid;
            url+='&sortby='+vm.parentCtrl.$stateParams.sortby+'&lang='+vm.parentCtrl.$stateParams.lang;
            url+='&context='+vm.parentCtrl.$stateParams.context+'&adaptor='+vm.parentCtrl.$stateParams.adaptor;
            url+='&tab='+vm.parentCtrl.$stateParams.tab+'&search_scope='+vm.parentCtrl.$stateParams.search_scope;
            url+='&searchString='+vm.params.searchString;
            if(vm.params.facet) {
                if(Array.isArray(vm.params.facet)) {
                    for(var i=0; i < vm.params.facet.length; i++) {
                        url += '&facet=' + vm.params.facet[i];
                    }
                } else {
                    url += '&facet=' + vm.params.facet;
                }
            }
            if(vm.params.offset) {
                url += '&offset=' + vm.params.offset;
            }
            $window.location.href=url;
        };

    }]);


angular.module('viewCustom')
    .component('prmBackToSearchResultsButtonAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmBackToSearchResultsButtonAfterController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-back-to-search-results-button-after.html'
    });

