/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section
 */
angular.module('viewCustom')
    .controller('prmViewOnlineAfterController', [ '$sce', 'angularLoad','prmSearchService','$mdDialog','$timeout','$window','$location', function ($sce, angularLoad, prmSearchService, $mdDialog, $timeout,$window,$location) {

        let vm = this;
        let sv=prmSearchService;
        let itemData=sv.getItem();
        vm.item=itemData.item;
        vm.searchData=itemData.searchData;
        vm.params=$location.search();

        vm.$onChanges=function() {
           // get item data from service
           itemData=sv.getItem();
           vm.item=itemData.item;
           vm.searchData=itemData.searchData;
           vm.searchData.sortby=vm.params.sortby;

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
                var url='/primo-explore/fulldisplay?docid='+vm.item.pnx.control.recordid[0]+'&vid='+vm.searchData.vid+'&context='+vm.item.context+'&lang='+vm.searchData.lang;
                if(vm.item.adaptor) {
                    url+='&adaptor='+vm.item.adaptor;
                } else {
                    url+='&adaptor='+vm.searchData.adaptor;
                }
                url+='&searchString='+vm.searchData.searchString+'&sortby='+vm.searchData.sortby;
                url += '&q=' + vm.searchData.q + '&tab='+vm.searchData.tab;
                url+='&search_scope='+vm.searchData.scope+'&singleimage=true&index='+index;
                if(vm.params.facet) {
                    url+='&facet=' + vm.params.facet;
                }

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





