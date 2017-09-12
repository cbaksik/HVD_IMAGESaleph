/**
 * Created by samsan on 8/15/17.
 * This component will insert textsms and its icon into the action list
 */


angular.module('viewCustom')
    .controller('prmActionListAfterCtrl',['$element','$compile','$scope','$timeout','customService',function ($element,$compile,$scope,$timeout, customService) {
        var vm=this;
        var cisv=customService;
        vm.$onInit=function () {
            // if holding location is existed, then insert Text call # into action list
            if(vm.parentCtrl.item.delivery.holding.length > 0) {
                // insert  textsms into existing action list
                vm.parentCtrl.actionLabelNamesMap.textsms = 'Text call #';
                vm.parentCtrl.actionListService.actionsToIndex.textsms = vm.parentCtrl.requiredActionsList.length + 1;
                if (vm.parentCtrl.actionListService.requiredActionsList.indexOf('textsms') === -1) {
                    vm.parentCtrl.actionListService.requiredActionsList.push('textsms');
                }
            }
        };

        vm.$onChanges=function() {
            $timeout(function () {
                // if holding location is existed, then insert sms text call icon
                if(vm.parentCtrl.item.delivery.holding.length > 0) {
                    var el = document.getElementById('textsms');
                    if (el) {
                        //remove prm-icon
                        var prmIcon = el.children[0].children[0].children[0].children[0];
                        prmIcon.remove();
                        // insert new icon
                        var childNode = el.children[0].children[0].children[0];
                        var mdIcon = document.createElement('md-icon');
                        mdIcon.setAttribute('md-svg-src', '/primo-explore/custom/HVD2/img/ic_textsms_black_24px.svg');
                        childNode.prepend(mdIcon);
                        $compile(childNode)($scope); // refresh the dom
                    }
                } else {
                    var el = document.getElementById('textsms');
                    if(el) {
                        el.remove();
                    }
                }

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

