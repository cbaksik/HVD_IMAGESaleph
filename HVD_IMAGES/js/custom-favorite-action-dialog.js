/**
 * Created by samsan on 7/26/17.
 */

angular.module('viewCustom')
    .controller('customFavoriteActionDialogController', ['items','position','flexsize','$mdDialog', function (items,position, flexsize, $mdDialog) {
        // local variables
        let vm = this;
        vm.imageUrl='/primo-explore/custom/HVD_IMAGES/img/ajax-loader.gif';
        vm.item = items;
        vm.position=position;
        vm.flexSize=flexsize;
        //vm.position.top=0;
        vm.position.width=vm.position.width + 40;
        vm.selectedAction=position.action;
        vm.activeAction=position.action;
        vm.displayCloseIcon=false;

        console.log('**** vm.item ***');
        console.log(vm.item);

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

            console.log('**** position ***');
            console.log(vm.position);

            $mdDialog.hide();
        };

        vm.closeDialog=function() {
            $mdDialog.hide();
        };
    }]);
