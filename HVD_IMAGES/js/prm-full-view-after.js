/**
 * Created by samsan on 5/17/17.
 */
angular.module('viewCustom')
    .controller('FullViewAfterController', [ '$sce', 'angularLoad','prmSearchService', function ($sce, angularLoad, prmSearchService) {


        let vm = this;

        console.log('*** full view after ***');
        console.log(vm.parentCtrl);


    }]);


angular.module('viewCustom')
    .component('prmFullViewAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmFullViewAfterController',
        'template':`<h1>Full View After Template</h1>`
    });





