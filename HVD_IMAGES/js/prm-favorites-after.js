/**
 * Created by samsan on 7/7/17.
 * This component is for favorite section when a user pin his or her favorite image.
 */

angular.module('viewCustom')
    .controller('prmFavoritesAfterController', ['prmSearchService', function (prmSearchService) {

        var sv=prmSearchService;
        let vm = this;
        vm.favoriteItems=[];
        vm.searchData={};

        vm.$doCheck=function() {
            vm.favoriteItems=vm.parentCtrl.favoritesService.items;
            if(vm.favoriteItems.length > 0) {
                vm.favoriteItems = sv.convertData(vm.favoriteItems);
                vm.searchData.vid=vm.parentCtrl.vid;

            }

        };


    }]);


angular.module('viewCustom')
    .component('prmFavoritesAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmFavoritesAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-favorites-after.html'
    });

