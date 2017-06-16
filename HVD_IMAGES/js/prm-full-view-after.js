/**
 * Created by samsan on 5/17/17.
 * This template is for direct access full view display link when a user send email to someone
 */
angular.module('viewCustom')
    .controller('prmFullViewAfterController', [ '$sce', 'angularLoad','prmSearchService','$timeout','$location', function ($sce, angularLoad, prmSearchService, $timeout, $location) {

        let sv=prmSearchService;
        let vm = this;
        vm.item=vm.parentCtrl.item;
        vm.params=$location.search();
        vm.services=[];

        vm.showFullViewPage=function () {
            // remove virtual browse shelf and more link
            for(var i=0; i < vm.parentCtrl.services.length; i++) {
                if (vm.parentCtrl.services[i].serviceName === 'virtualBrowse') {
                    vm.parentCtrl.services.splice(i);
                } else if (vm.parentCtrl.services[i].scrollId === 'getit_link2') {
                    vm.parentCtrl.services.splice(i);
                }
            }
        };

        vm.showSingImagePage=function () {
            // remove virtual browse shelf and more link
            var k=0;
            for(var i=0; i < vm.parentCtrl.services.length; i++) {
                if (vm.parentCtrl.services[i].serviceName === 'details') {
                    vm.services[k]=vm.parentCtrl.services[i];
                    k++;
                } else if(vm.parentCtrl.services[i].scrollId==='getit_link1_0') {
                    vm.services[k]=vm.parentCtrl.services[i];
                    k++;
                }
            }

            for(var i=0; i < vm.parentCtrl.services.length; i++) {
                vm.parentCtrl.services.splice(i);
            };
            sv.setData(vm);

        };

        vm.$onChanges=function() {

           console.log('*** prm-full-view-after ***');
           console.log(vm);

           if(!vm.parentCtrl.searchService.query) {
               vm.parentCtrl.searchService.query=vm.params.query;
               vm.parentCtrl.searchService.$stateParams.query=vm.params.query;
               vm.parentCtrl.mainSearchField=vm.params.searchString;
           }


           if(vm.item.pnx) {
               // when a user access full view detail page, it has no mis1Data so it need to convert xml to json data
               if(!vm.item.mis1Data) {
                   var item = [];
                   item[0] = vm.item;
                   item = sv.convertData(item);
                   vm.item = item[0];
               }

               // set data to build full display page
               var itemData={'item':'','searchData':''};
               itemData.item=vm.item;
               if(vm.parentCtrl.searchService.cheetah.searchData) {
                   // this data is available from over layer slide page
                   itemData.searchData = vm.parentCtrl.searchService.cheetah.searchData;
               } else {
                   // this data is available only from fulldisplay url
                   itemData.searchData = vm.params;
                   itemData.searchData.scope=vm.params.search_scope;
               }
               sv.setItem(itemData);

               var logID=sv.getLogInID();
               if(vm.item.restrictedImage===true && logID===false) {
                   // if image is restricted and user is not login, trigger click event on user login button through dom
                   var doc=document.getElementsByClassName('user-menu-button')[0];
                   $timeout(function (e) {
                       doc.click();
                       var prmTag=document.getElementsByTagName('prm-authentication')[1];
                       var button = prmTag.getElementsByTagName('button');
                       button[0].click();
                   },500);
               }
           }


        };

        vm.$onInit=function() {
            vm.params=$location.search();
            // remove virtual browse shelf and more link
            if(vm.params.singleimage && vm.params.index) {
                vm.showSingImagePage();
            } else {
                vm.showFullViewPage();
            }
        }


    }]);


angular.module('viewCustom')
    .component('prmFullViewAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmFullViewAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-full-view-after.html'
    });





