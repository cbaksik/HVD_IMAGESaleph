/**
 * Created by samsan on 5/17/17.
 * This template is for direct access full view display link when a user send email to someone
 */
angular.module('viewCustom')
    .controller('prmFullViewAfterController', [ '$sce', 'angularLoad','prmSearchService','$timeout', function ($sce, angularLoad, prmSearchService, $timeout) {

        let sv=prmSearchService;
        let vm = this;
        vm.item=vm.parentCtrl.item;

        vm.$onChanges=function() {
           vm.item=vm.parentCtrl.item;
           if(vm.item.pnx) {
               // when a user access full view detail page, it has no mis1Data so it need to convert xml to json data
               if(!vm.item.mis1Data) {
                   var item = [];
                   item[0] = vm.item;
                   item = sv.convertData(item);
                   vm.item = item[0];
               }
               sv.setItem(vm.item);
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
           // remove virtual browse shelf and more link
           for(var i=0; i < vm.parentCtrl.services.length; i++) {
               if (vm.parentCtrl.services[i].serviceName === 'virtualBrowse') {
                   vm.parentCtrl.services.splice(i);
               } else if (vm.parentCtrl.services[i].scrollId === 'getit_link2') {
                   vm.parentCtrl.services.splice(i);
                }
           }

        }


    }]);


angular.module('viewCustom')
    .component('prmFullViewAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmFullViewAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-full-view-after.html'
    });





