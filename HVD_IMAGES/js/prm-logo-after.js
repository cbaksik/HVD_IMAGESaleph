/**
 * Created by samsan on 6/8/17.
 * This component add customize logo and Hollis Images text
 */
angular.module('viewCustom')
    .controller('prmLogoAfterController', [ '$sce', 'angularLoad', function ($sce, angularLoad) {

        let vm = this;

        vm.$onChanges=function() {
            // override the logo on top left corner
            console.log('*** prm logo after ***');

        };



    }]);


angular.module('viewCustom')
    .component('prmLogoAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmLogoAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-logo-after.html'
    });
