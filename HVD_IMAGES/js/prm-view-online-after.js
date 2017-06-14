/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section
 */
angular.module('viewCustom')
    .controller('prmViewOnlineAfterController', [ '$sce', 'angularLoad','prmSearchService','$mdDialog','$timeout','$window', function ($sce, angularLoad, prmSearchService, $mdDialog, $timeout,$window) {

        let vm = this;
        let sv=prmSearchService;
        let itemData=sv.getItem();
        vm.item=itemData.item;
        vm.searchData=itemData.searchData;

        vm.$onChanges=function() {
           // get item data from service
           itemData=sv.getItem();
           vm.item=itemData.item;
           vm.searchData=itemData.searchData;

        };

        // show the pop up image
        vm.gotoFullPhoto=function ($event, item, index) {
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

                // go to full display page
                console.log('*** vm.item ***');
                console.log(vm.item);

                console.log('**** vm.searchData ***');
                console.log(vm.searchData);

                var url='/primo-explore/fulldisplay?docid='+vm.item.pnx.control.recordid[0]+'&vid='+vm.searchData.vid+'&context='+vm.item.context+'&adaptor='+vm.item.adaptor+'&lang='+vm.searchData.lang;
                url+='&search_scope='+vm.searchData.scope+'&singleimage=true&index='+index;
                $window.location.href=url;

            }
        }

    }]);


angular.module('viewCustom')
    .component('prmViewOnlineAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmViewOnlineAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-view-online-after.html'
    });





