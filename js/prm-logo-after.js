/**
 * Created by samsan on 6/8/17.
 * This component add customize logo and Hollis Images text
 */
angular.module('viewCustom')
    .controller('prmLogoAfterController', [ '$sce','$element', function ($sce, $element) {

        var vm = this;

        vm.$onChanges=function() {
            // remove flex top bar and also remove tab menus
            var el=$element[0].parentNode.parentNode;
            el.children[2].remove();
            el.children[2].remove();

            // remove logo div
            var el2=$element[0].parentNode;
            el2.children[0].remove();

            // remove prm-skip-to
            var el3=$element[0].parentNode.parentNode;
            if(el3) {
                el3.children[0].remove();
            }

        };



    }]);


angular.module('viewCustom')
    .component('prmLogoAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmLogoAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-logo-after.html'
    });
