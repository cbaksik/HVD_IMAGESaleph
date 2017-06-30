/**
 * Created by samsan on 6/8/17.
 * This component add customize logo and Hollis Images text
 */
angular.module('viewCustom')
    .controller('prmLogoAfterController', [ '$sce', 'angularLoad','$element', function ($sce, angularLoad, $element) {

        let vm = this;

        vm.$onChanges=function() {
            // remove flex top bar
            var el=$element[0].parentNode.parentNode;
            el.children[2].remove();
            el.children[2].remove();

            // remove logo div
            var el2=$element[0].parentNode;
            el2.children[0].remove();

            console.log('**** prm logo after ***');
            console.log($element);

        };



    }]);


angular.module('viewCustom')
    .component('prmLogoAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmLogoAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-logo-after.html'
    });
