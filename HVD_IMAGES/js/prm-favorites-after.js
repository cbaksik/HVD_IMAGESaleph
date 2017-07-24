/**
 * Created by samsan on 7/7/17.
 * This component is for favorite section when a user pin his or her favorite image.
 */

angular.module('viewCustom')
    .controller('prmFavoritesAfterController', ['prmSearchService',function (prmSearchService) {

        var sv=prmSearchService;
        let vm = this;
        vm.favoriteItems=[];
        vm.pinList=[];
        vm.searchData={};
        vm.selectitem=null;
        vm.isOpenSideNav=false;

        vm.getDataList=function () {
            var url=vm.parentCtrl.favoritesService.restBaseURLs.pnxBaseURL+'/U';
            var param={'recordIds':'','vid':''};
            param.vid=vm.parentCtrl.vid;
            param.recordIds=vm.parentCtrl.favoritesService.fullList.join();
            sv.getAjax(url,param,'get')
                .then(function (result) {
                        vm.favoriteItems=sv.convertData(result.data);
                        console.log('**** result list ***');
                        console.log(vm.favoriteItems);
                    },
                    function (err) {
                        console.log('*** response error ****');
                        console.log(err);
                    }
                )
        };

        // get favorite list
        vm.getFavoriteList=function () {
          var url=vm.parentCtrl.favoritesService.restBaseURLs.favoritesBaseURL;
          var param={};
          sv.getAjax(url,param,'get')
              .then(function (result) {
                  vm.pinList=result.data;
                      console.log('*** pin list ***');
                      console.log(vm.pinList);
              },
                function (err) {
                    console.log('*** response error ****');
                    console.log(err);
                }
              )

        };


        vm.$onChanges=function() {
            // get data from parent controller
            vm.getDataList();

            console.log('**** prm-favorites-after ****');
            console.log(vm);



        };






    }]);


angular.module('viewCustom')
    .component('prmFavoritesAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmFavoritesAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-favorites-after.html'
    });

