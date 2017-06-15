/**
 * Created by samsan on 6/15/17.
 */

angular.module('viewCustom')
    .controller('prmBackToSearchResultsButtonAfterController', [ '$sce', 'angularLoad','$window','prmSearchService', function ($sce, angularLoad,$window,prmSearchService) {

        let vm = this;
        var sv=prmSearchService;

        vm.$doCheck=function () {
            vm.photo=sv.getPhoto();
            console.log('**** prm back to search result after ***');
            console.log(vm);
        };

        vm.goToSearch=function () {

        };

        vm.goToImages=function () {

        };

    }]);


angular.module('viewCustom')
    .component('prmBackToSearchResultsButtonAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmBackToSearchResultsButtonAfterController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-back-to-search-results-button-after.html'
    });

