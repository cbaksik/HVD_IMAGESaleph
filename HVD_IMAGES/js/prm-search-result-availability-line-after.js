/**
 * Created by samsan on 6/30/17.
 */

angular.module('viewCustom')
    .controller('prmSearchResultAvailabilityAfterController', ['$element','$timeout', function ($element,$timeout) {
        let vm = this;
        vm.$onChanges=function() {
            // remove  access online and icon
            $timeout(function () {
                var el=$element[0].parentNode.childNodes[1].children;
                if(el) {
                    el[0].remove();
                    el[0].remove();
                }

            },200);

        };



    }]);


angular.module('viewCustom')
    .component('prmSearchResultAvailabilityLineAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmSearchResultAvailabilityAfterController'
    });
