/**
 * Created by samsan on 6/9/17.
 */

angular.module('viewCustom')
    .controller('customSingleImageController', [ '$sce', 'angularLoad','$window', function ($sce, angularLoad,$window) {

        let vm = this;
        vm.photo={};
        let index=vm.params.index;
        vm.breadcrumbs={'title':'Home','url':''};


        if(vm.item.mis1Data.length===1) {
            vm.photo=vm.item.mis1Data[0].image[index];
        }

        console.log('*** custom single Image  ***');
        console.log(vm);

        vm.$onChanges=function() {
            if(vm.params.index && vm.params.singleimage) {
                var doc = document.getElementById('fullView');
                var div = doc.getElementsByClassName('full-view-inner-container');
                div[0].style.display = 'none';
                vm.breadcrumbs.url='/primo-explore/fulldisplay?docid='+vm.params.docid+'&context='+vm.params.context+'&lang='+vm.params.lang+'&vid='+vm.params.vid+'&adaptor='+vm.params.adaptor+'&search_scope='+vm.params.scope;
                vm.breadcrumbs.title=vm.item.pnx.display.title[0];
            }
        };

        vm.goBack=function () {
          $window.location.href=vm.breadcrumbs.url;
        };

    }]);


angular.module('viewCustom')
    .component('customSingleImage', {
        bindings: {item: '<',services:'<',params:'<'},
        controller: 'customSingleImageController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-single-image.html'
    });

