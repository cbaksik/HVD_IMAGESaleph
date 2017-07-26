/**
 * Created by samsan on 7/25/17.
 */

angular.module('viewCustom')
    .controller('customFavoriteListController', ['prmSearchService',function (prmSearchService) {

        var sv=prmSearchService;
        let vm = this;
        vm.searchdata={};
        vm.chooseAll=false;

        vm.unpin=function (index, item) {
            console.log(index);
            console.log(item);


        };

        vm.checkAll=function () {
            if(vm.chooseAll===false) {
                for(var i=0; i < vm.itemList.length; i++) {
                    vm.itemList[i].checked=true;
                }
            } else {
                vm.unCheckAll();
            }
        };

        vm.unCheckAll=function () {
            for(var i=0; i < vm.itemList.length; i++) {
               vm.itemList[i].checked=false;
            }
        };

        vm.$doCheck=function() {
            vm.itemList=vm.parentCtrl.favoritesService.items;
        };

        vm.$onChanges=function() {
            vm.unCheckAll();
            console.log('**** custom-favorite-list ****');
            console.log(vm);

        }


    }]);


angular.module('viewCustom')
    .component('customFavoriteList', {
        bindings: {parentCtrl:'<'},
        controller: 'customFavoriteListController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-favorite-list.html'
    });

