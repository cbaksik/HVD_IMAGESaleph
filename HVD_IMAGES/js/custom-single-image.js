/**
 * Created by samsan on 6/9/17.
 * This component is for a single image full display when a user click on thumbnail from a full display page
 */

angular.module('viewCustom')
    .controller('customSingleImageController', [ '$sce', 'angularLoad','$window','$mdMedia','prmSearchService', function ($sce, angularLoad,$window,$mdMedia,prmSearchService) {

        let vm = this;
        var sv=prmSearchService;
        vm.photo={};
        vm.flexsize=70;
        let index=vm.params.index;
        vm.breadcrumbs={'title':'Home','url':''};

        console.log('***** custom single Image *******');
        console.log(vm);

        vm.$onChanges=function() {

            // if the smaller screen size, make the flex size to 100.
            if($mdMedia('sm')) {
                vm.flexsize=100;
            } else if($mdMedia('xs')) {
                vm.flexsize=100;
            }

            // if there is index and singleimage in parameter, then execute this statement.
            if(vm.params.index && vm.params.singleimage) {
                // the xml has different format nodes
                if(vm.item.mis1Data) {
                    if (vm.item.mis1Data.length === 1) {
                        vm.photo = vm.item.mis1Data[0].image[index];
                    } else if(vm.item.mis1Data.length > 1) {
                        vm.photo = vm.item.mis1Data[index].image[0];
                    }
                    sv.setPhoto(vm.item);
                }
                // hide previous page
                var doc = document.getElementById('fullView');
                var div = doc.getElementsByClassName('full-view-inner-container');
                div[0].style.display = 'none';
                vm.breadcrumbs.url='/primo-explore/fulldisplay?docid='+vm.params.docid+'&context='+vm.params.context+'&lang='+vm.params.lang+'&vid='+vm.params.vid+'&adaptor='+vm.params.adaptor+'&search_scope='+vm.params.scope;
                vm.breadcrumbs.url+='&searchString='+vm.params.searchString+'&q='+vm.params.query;
                vm.breadcrumbs.title=vm.item.pnx.display.title[0];
            }
        };

        // when a user click on breadcrumbs navigator
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

