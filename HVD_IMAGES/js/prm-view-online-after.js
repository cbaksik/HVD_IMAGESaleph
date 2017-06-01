/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section
 */
angular.module('viewCustom')
    .controller('prmViewOnlineAfterController', [ '$sce', 'angularLoad','prmSearchService', function ($sce, angularLoad, prmSearchService) {

        let vm = this;
        let sv=prmSearchService;
        vm.item=sv.getItem();

        vm.$onChanges=function() {
           // hide more section to avoid display twice
           var link2=document.getElementById('getit_link2');
           link2.style.display='none';

        }

    }]);


angular.module('viewCustom')
    .component('prmViewOnlineAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmViewOnlineAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-view-online-after.html'
    });





