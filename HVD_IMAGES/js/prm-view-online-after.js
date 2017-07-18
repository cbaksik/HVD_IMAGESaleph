/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section
 */
angular.module('viewCustom')
    .controller('prmViewOnlineAfterController', ['prmSearchService','$mdDialog','$timeout','$window','$location','$state', function (prmSearchService, $mdDialog, $timeout,$window,$location,$state) {

        var vm = this;
        var sv=prmSearchService;
        var itemData=sv.getItem();
        vm.item=itemData.item;
        vm.searchData=itemData.searchData;
        vm.params=$location.search();
        vm.zoomButtonFlag=true;
        vm.viewAllComponetMetadataFlag=false;
        vm.singleImageFlag=false;

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
           if(vm.item.mis1Data) {
               if(vm.item.mis1Data[0].image) {
                   if(vm.item.mis1Data.length===1 && vm.item.mis1Data[0].image.length===1) {
                       vm.singleImageFlag = true;
                   } else {
                       vm.viewAllComponetMetadataFlag=true;
                   }
               } else if(vm.item.mis1Data.length===1) {
                   vm.singleImageFlag=true;
               } else if(vm.item.mis1Data.length > 1) {
                   vm.viewAllComponetMetadataFlag=true;
               }
           }


        };

        // view all component metadata
        vm.viewAllComponentMetaData=function () {

            console.log('***** view all component metadata ***');
            console.log(vm);

            var url='/primo-explore/viewallcomponentmetadata?vid='+vm.params.vid+'&docid='+vm.item.pnx.control.recordid[0];
            url+='&query='+vm.params.query+'&sortby='+vm.params.sortby+'&tab='+vm.params.tab+'&search_scope='+vm.params.search_scope;
            url+='&offset='+vm.params.offset+'&lang='+vm.params.lang;
            url+='&context='+vm.item.context+'&adaptor='+vm.item.adaptor;
            $window.open(url,'_blank');

        };


        // show the pop up image
        vm.gotoFullPhoto=function ($event, item, index) {
            // go to full display page
            var url='/primo-explore/fulldisplay?docid='+vm.item.pnx.control.recordid[0]+'&vid='+vm.searchData.vid+'&context='+vm.item.context+'&lang='+vm.searchData.lang;
            if(vm.item.adaptor) {
                url+='&adaptor='+vm.item.adaptor;
            } else {
                url+='&adaptor='+(vm.searchData.adaptor?vm.searchData.adaptor:'');
            }
            if(vm.searchData.searchString) {
                url += '&searchString=' + (vm.searchData.searchString?vm.searchData.searchString:'');
            } else {
                url += '&searchString=';
            }
            url+='&sortby='+(vm.searchData.sortby?vm.searchData.sortby:'rank');
            url += '&q=' + (vm.searchData.q?vm.searchData.q:'') + '&tab='+(vm.searchData.tab?vm.searchData.tab:'');
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

            url += '&offset=' + (offset?offset:0);
            $window.open(url,'_blank');
        }

    }]);


angular.module('viewCustom')
    .config(function ($stateProvider) {
        $stateProvider
            .state('exploreMain.viewallcomponentdata', {
                    url: '/viewallcomponentmetadata',
                    views:{
                        '': {
                            template: `<custom-view-all-component-metadata parent-ctrl="$ctrl"></custom-view-all-component-metadata>`
                        }
                    }
                }

            )
    })
    .component('prmViewOnlineAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmViewOnlineAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-view-online-after.html'
    });





