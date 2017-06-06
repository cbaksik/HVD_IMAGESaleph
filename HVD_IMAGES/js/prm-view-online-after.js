/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section
 */
angular.module('viewCustom')
    .controller('prmViewOnlineAfterController', [ '$sce', 'angularLoad','prmSearchService','$mdDialog','$timeout', function ($sce, angularLoad, prmSearchService, $mdDialog, $timeout) {

        let vm = this;
        let sv=prmSearchService;
        vm.item=sv.getItem();

        vm.$onChanges=function() {
           // get item data from service
           vm.item=sv.getItem();
        };

        // show the pop up image
        vm.gotoFullPhoto=function ($event, item) {
            var logID=sv.getLogInID();
            if(item._attr.restrictedImage===true && logID===false) {
                // if image is restricted and user is not login, trigger click event on user login button through dom
                var doc=document.getElementsByClassName('user-menu-button')[1];
                $timeout(function (e) {
                    doc.click();
                    var prmTag=document.getElementsByTagName('prm-authentication')[1];
                    var button = prmTag.getElementsByTagName('button');
                    button[0].click();
                },500);
            } else {

                // modal dialog pop up here
                $mdDialog.show({
                    title: 'View Image Dialog',
                    target: $event,
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    bindToController: true,
                    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/custom-view-image-dialog.html',
                    controller: 'customViewImageDialogController',
                    controllerAs: 'vm',
                    multiple:true,
                    preserveScope : true,
                    autoWrap : true,
                    skipHide : true,
                    locals: {
                        items: item
                    }
                });
            }
        }

    }]);


angular.module('viewCustom')
    .component('prmViewOnlineAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmViewOnlineAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-view-online-after.html'
    });





