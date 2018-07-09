/**
 * Created by samsan on 7/7/17.
 * This component is for pin favorite and search icon on the top right menu tab
 */

angular.module('viewCustom')
    .controller('prmSearchBookmarkFilterAfterController', [ '$sce','$element', function ($sce, $element) {

        let vm = this;

        vm.$onChanges=function() {

            if(vm.parentCtrl.isFavorites) {
                // remove search magnify glass icon on the top left menu tab
                //var el=$element[0].parentNode.children;
                //el[0].remove();
            }

        };



    }]);


angular.module('viewCustom')
    .component('prmSearchBookmarkFilterAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmSearchBookmarkFilterAfterController'
    });

