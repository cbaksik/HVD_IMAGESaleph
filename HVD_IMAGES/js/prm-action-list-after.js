/**
 * Created by samsan on 8/15/17.
 * Overwrite the print default . It must turn on print from back end first before it can overwrite.
 */


angular.module('viewCustom')
    .controller('prmActionListAfterCtrl',['$element','$compile','$scope','$timeout','customService',function ($element,$compile,$scope,$timeout, customService) {
        var vm=this;
        var cisv=customService;

        vm.$onChanges=function() {
            $timeout(function () {

                // print
                var printEl=document.getElementById('Print');
                if(printEl) {
                    printEl.children[0].remove();
                    var printTag=document.createElement('custom-print');
                    printTag.setAttribute('parent-ctrl','vm.parentCtrl.item');
                    printEl.appendChild(printTag);
                    $compile(printEl.children[0])($scope);
                }

            },2000);
        };

        vm.$doCheck=function(){
            // pass active action to prm-action-container-after
            if(vm.parentCtrl.activeAction) {
                cisv.setActionName(vm.parentCtrl.activeAction);
            }

        };
    }]);

angular.module('viewCustom')
    .component('prmActionListAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmActionListAfterCtrl',
        controllerAs:'vm'
    });

