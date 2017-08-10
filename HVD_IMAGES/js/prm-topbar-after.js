/**
 * Created by samsan on 6/29/17.
 */

angular.module('viewCustom')
    .controller('prmTopbarAfterController', ['$element', function ($element) {

        let vm = this;
        vm.$onInit=function() {
            // hide primo tab menu
            vm.parentCtrl.showMainMenu=false;
            // create new div for the top white menu
            var el=$element[0].parentNode.parentNode.parentNode.parentNode.parentNode;
            var div=document.createElement('div');
            div.setAttribute('id','customTopMenu');
            div.setAttribute('class','topMenu');
            el.prepend(div);


        };



    }]);


angular.module('viewCustom')
    .component('prmTopbarAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmTopbarAfterController'
    });
