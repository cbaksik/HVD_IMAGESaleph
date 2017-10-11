/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section
 */
angular.module('viewCustom')
    .controller('prmViewOnlineAfterController', ['prmSearchService','$mdDialog','$timeout','$window','$location', function (prmSearchService, $mdDialog, $timeout,$window,$location) {

        var vm = this;
        var sv=prmSearchService;
        var itemData=sv.getItem();
        vm.item=itemData.item;
        vm.searchData=itemData.searchData;
        vm.params=$location.search();
        vm.zoomButtonFlag=false;
        vm.viewAllComponetMetadataFlag=false;
        vm.singleImageFlag=false;
        vm.photo = {}; // single imae
        vm.jp2 = false;
        vm.imageTitle = '';
        vm.auth = sv.getAuth();

        vm.$onInit=function() {

            vm.isLoggedIn=sv.getLogInID();
           // get item data from service
           itemData=sv.getItem();
           vm.item=itemData.item;
           if(vm.item.pnx.addata) {
               vm.item.mis1Data=sv.getXMLdata(vm.item.pnx.addata.mis1[0]);
           }
           vm.searchData=itemData.searchData;
           vm.searchData.sortby=vm.params.sortby;
           vm.pageInfo=sv.getPage();

           if(vm.item.mis1Data) {
               if(Array.isArray(vm.item.mis1Data)===false) {
                   if (vm.item.mis1Data.image) {
                       vm.singleImageFlag=true;
                       vm.photo=vm.item.mis1Data.image[0];
                       vm.jp2=sv.findJP2(vm.photo); // check to see if the image is jp2 or not
                       if(vm.item.mis1Data.title) {
                           vm.imageTitle = vm.item.mis1Data.title[0].textElement[0]._text;
                       }
                   }
               } else {
                   vm.viewAllComponetMetadataFlag=true;
                   vm.singleImageFlag=false;
                   vm.zoomButtonFlag=true;
               }
           }


        };

        // view all component metadata
        vm.viewAllComponentMetaData=function () {
            var url='/primo-explore/viewallcomponentmetadata/'+vm.item.context+'/'+vm.item.pnx.control.recordid[0]+'?vid='+vm.params.vid;
            url+='&tab='+vm.params.tab+'&search_scope='+vm.params.search_scope;
            url+='&adaptor='+vm.item.adaptor;
            $window.open(url,'_blank');

        };


        // show the pop up image
        vm.gotoFullPhoto=function ($event, item, index) {
            var filename='';
            if(item.image) {
                var urlList=item.image[0]._attr.href._value;
                urlList = urlList.split('/');
                if(urlList.length >=3) {
                    filename=urlList[3];
                }
            } else if(item._attr.componentID) {
                filename = item._attr.componentID._value;
            }
            // go to full display page
            var url='/primo-explore/viewcomponent/'+vm.item.context+'/'+vm.item.pnx.control.recordid[0]+'/'+filename+'?vid='+vm.searchData.vid+'&lang='+vm.searchData.lang;
            if(vm.item.adaptor) {
                url+='&adaptor='+vm.item.adaptor;
            } else {
                url+='&adaptor='+(vm.searchData.adaptor?vm.searchData.adaptor:'');
            }
            $window.open(url,'_blank');
        }

    }]);


angular.module('viewCustom')
    .config(function ($stateProvider) {
        $stateProvider
            .state('exploreMain.viewallcomponentdata', {
                    url: '/viewallcomponentmetadata/:context/:docid',
                    views:{
                        '': {
                            template: `<custom-view-all-component-metadata parent-ctrl="$ctrl"></custom-view-all-component-metadata>`
                        }
                    }
                }

            )
            .state('exploreMain.viewcomponent', {
                    url:'/viewcomponent/:context/:docid/:filename',
                    views:{
                        '':{
                           template:`<custom-view-component parent-ctrl="$ctrl" item="$ctrl.item" services="$ctrl.services" params="$ctrl.params"></custom-view-component>`
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





