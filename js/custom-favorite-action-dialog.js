/**
 * Created by samsan on 7/26/17.
 */

angular.module('viewCustom')
    .controller('customFavoriteActionDialogController', ['items','position','flexsize','record','$mdDialog','$location','prmSearchService', function (items,position, flexsize, record, $mdDialog, $location, prmSearchService) {
        // local variables
        var vm = this;
        var sv=prmSearchService;
        vm.imageUrl='/primo-explore/custom/HVD_IMAGES/img/ajax-loader.gif';
        vm.item = items;
        vm.position=position;
        vm.flexSize=flexsize;
        vm.selectedAction=position.action;
        vm.activeAction=position.action;
        vm.displayCloseIcon=false;
        vm.searchdata=$location.search();

        if(vm.item.pnx.links.thumbnail) {
            vm.imageUrl=vm.item.pnx.links.thumbnail[0];
        }

        vm.openTab=function ($event,action) {
          vm.selectedAction=action;
          vm.activeAction=action;
        };

        vm.unpin=function (index,recordid) {
            vm.position.pin=true;
            vm.position.recordId=recordid;
            $mdDialog.hide();
        };

        // open modal dialog when click on thumbnail image
        vm.openDialog=function ($event,item) {
            // set data to build full display page
            var itemData={'item':'','searchData':''};
            itemData.item=item;
            itemData.searchData=vm.searchdata;
            sv.setItem(itemData);

            // modal dialog pop up here
            $mdDialog.show({
                title:'Full View Details',
                target:$event,
                clickOutsideToClose: true,
                focusOnOpen:true,
                escapeToClose: true,
                bindToController:true,
                templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-full-view-dialog.html',
                controller:'customFullViewDialogController',
                controllerAs:'vm',
                fullscreen:true,
                multiple:true,
                openFrom:{left:0},
                locals: {
                    items:itemData
                },
                onComplete:function (scope, element) {
                    sv.setDialogFlag(true);
                },
                onRemoving:function (element,removePromise) {
                    sv.setDialogFlag(false);
                }
            });
            return false;
        };

        // When a user press enter by using tab key
        vm.openDialog2=function(e,item){
            if(e.which===13||e.which===1){
                vm.openDialog(e,item);
            }

        };

        vm.closeDialog=function() {
            $mdDialog.hide();
        };
    }]);
