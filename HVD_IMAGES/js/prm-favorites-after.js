/**
 * Created by samsan on 7/7/17.
 * This component is for favorite section when a user pin his or her favorite image.
 */

angular.module('viewCustom')
    .controller('prmFavoritesAfterController', [ '$sce', 'angularLoad','$element', function ($sce, angularLoad, $element) {

        let vm = this;

        vm.$onChanges=function() {
            console.log('*** not implement yet prm-favorites-after ***');
            console.log(vm.parentCtrl);

        };



    }]);


angular.module('viewCustom')
    .component('prmFavoritesAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmFavoritesAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-favorites-after.html'
    });

