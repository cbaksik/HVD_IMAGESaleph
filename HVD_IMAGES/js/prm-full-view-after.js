/**
 * Created by samsan on 5/17/17.
 * This template is for direct access full view display link when a user send email to someone
 */
angular.module('viewCustom')
    .controller('prmFullViewAfterController', [ '$sce','prmSearchService','$timeout','$location','$element', function ($sce, prmSearchService, $timeout, $location,$element) {

        var sv=prmSearchService;
        var vm = this;
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


           }

        };

        vm.$onInit=function() {

            vm.params=$location.search();
            // remove virtual browse shelf and more link
            if(vm.params.singleimage && vm.params.index) {
                vm.showSingImagePage();
                // remove search box
                var el=$element[0].parentNode.parentNode.parentNode.parentNode;
                var children=el.children[0].children;
                children[1].remove();

                // remove back button breadcrumbs
                var el2=$element[0].parentNode.parentNode.parentNode.parentNode;
                var children2=el2.children;
                var children1=children2[0].children[0].children[1];
                //remove bookmark
                children1.children[2].remove();
                // remove login
                children1.children[2].remove();

                // insert full image detail text
                var span=document.createElement('div');
                span.setAttribute('class','fullImageDetail');
                var text=document.createTextNode('FULL IMAGE DETAIL');
                span.appendChild(text);
                children1.appendChild(span);

                // remove breadcrumb
                children2[1].remove();

            } else {
                vm.showFullViewPage();
            }
        }


    }]);


angular.module('viewCustom')
    .component('prmFullViewAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmFullViewAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-full-view-after.html'
    });





