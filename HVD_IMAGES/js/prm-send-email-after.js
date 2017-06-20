/**
 * Created by samsan on 6/20/17.
 */

angular.module('viewCustom')
    .controller('prmSendEmailAfterController', [ '$sce', 'angularLoad', function ($sce, angularLoad) {

        let vm = this;

        vm.$onChanges=function() {
            console.log('** prm send email after ***');
            console.log(vm);

        };



    }]);


angular.module('viewCustom')
    .component('prmSendEmailAfter', {
        bindings: {parentCtrl: '='},
        controller: 'prmSendEmailAfterController'
    });

