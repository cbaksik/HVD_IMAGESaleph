/**
 * Created by samsan on 7/26/17.
 */

angular.module('viewCustom')
    .controller('customFavoriteActionDialogController', ['items','position','$mdDialog', function (items,position, $mdDialog) {
        // local variables
        let vm = this;
        vm.item = items;
        vm.position=position;
        //vm.position.top=0;
        vm.position.width=vm.position.width + 40;
        vm.selectedAction=position.action;
        vm.activeAction=position.action;
        vm.displayCloseIcon=false;

        vm.openTab=function ($event,action) {
          vm.selectedAction=action;
          vm.activeAction=action;
        };

        vm.closeDialog=function() {
            $mdDialog.hide();
        };
    }]);
