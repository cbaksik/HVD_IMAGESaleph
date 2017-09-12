/**
 * Created by samsan on 9/5/17.
 */

angular.module('viewCustom')
    .controller('customPrintCtrl',['$window','$stateParams',function ($window,$stateParams) {
        var vm=this;
        var params=$stateParams;

        vm.print=function () {
            var url='/primo-explore/printPage/'+vm.parentCtrl.context+'/'+vm.parentCtrl.pnx.control.recordid;
            url+='?vid='+params.vid;
            $window.open(url,'_blank');
        }

    }]);

angular.module('viewCustom')
    .config(function ($stateProvider) {
        $stateProvider
            .state('exploreMain.printPage', {
                    url: '/printPage/:context/:docid',
                    views:{
                        '': {
                            template: `<custom-print-page parent-ctrl="$ctrl"></custom-print-page>`
                        }
                    }
                }

            )
    })
    .component('customPrint',{
        bindings:{parentCtrl:'<'},
        controller: 'customPrintCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/custom-print.html'
    });

