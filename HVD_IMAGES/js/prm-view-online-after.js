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
        vm.zoomButtonFlag=true;

        vm.$onChanges=function() {
            vm.isLoggedIn=sv.getLogInID();
           // get item data from service
           itemData=sv.getItem();
           vm.item=itemData.item;
           vm.searchData=itemData.searchData;
           vm.searchData.sortby=vm.params.sortby;
           vm.pageInfo=sv.getPage();

           if(vm.isLoggedIn===false && vm.item.mis1Data.length===1) {
               if(vm.item.mis1Data[0].image && vm.item.mis1Data[0].image[0]._attr.restrictedImage._value) {
                   vm.zoomButtonFlag=false;
               }
           }

        };


        // show the pop up image
        vm.gotoFullPhoto=function ($event, item, index) {
            // go to full display page
            var url='/primo-explore/fulldisplay?docid='+vm.item.pnx.control.recordid[0]+'&vid='+vm.searchData.vid+'&context='+vm.item.context+'&lang='+vm.searchData.lang;
            if(vm.item.adaptor) {
                url+='&adaptor='+vm.item.adaptor;
            } else {
                url+='&adaptor='+vm.searchData.adaptor;
            }
            if(vm.searchData.searchString) {
                url += '&searchString=' + vm.searchData.searchString;
            } else {
                url += '&searchString=';
            }
            url+='&sortby='+vm.searchData.sortby;
            url += '&q=' + vm.searchData.q + '&tab='+vm.searchData.tab;
            url+='&search_scope='+vm.searchData.scope+'&singleimage=true&index='+index;
            if(vm.params.facet) {
                if(Array.isArray(vm.params.facet)) {
                    for(var i=0; i < vm.params.facet.length; i++) {
                        url += '&facet=' + vm.params.facet[i];
                    }
                } else {
                    url += '&facet=' + vm.params.facet;
                }
            }
            var offset=vm.params.offset;
            if(vm.pageInfo.userClick) {
                offset=parseInt(vm.pageInfo.currentPage - 1) * vm.pageInfo.pageSize;
            }

            url += '&offset=' + offset;
            $window.open(url,'_blank');
        }

    }]);


angular.module('viewCustom')
    .component('prmViewOnlineAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmViewOnlineAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-view-online-after.html'
    });





