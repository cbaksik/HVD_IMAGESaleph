/**
 * Created by samsan on 6/9/17.
 * This component is for a single image full display when a user click on thumbnail from a full display page
 */

angular.module('viewCustom')
    .controller('customSingleImageController', [ '$sce', 'angularLoad','$window','$mdMedia','prmSearchService', function ($sce, angularLoad,$window,$mdMedia,prmSearchService) {

        let vm = this;
        var sv=prmSearchService;
        vm.photo={};
        vm.flexsize=80;
        vm.index=parseInt(vm.params.index);
        vm.total=0;
        vm.itemData={};
        vm.imageNav=true;
        vm.xmldata={};

        vm.displayPhoto=function () {
            vm.isLoggedIn=sv.getLogInID();
            if(vm.params.index && vm.params.singleimage) {
                if(vm.item.pnx.addata.mis1) {
                    vm.xmldata = sv.parseXml(vm.item.pnx.addata.mis1[0]);
                    if(vm.xmldata.work) {
                        vm.xmldata=vm.xmldata.work[0];
                    }
                    console.log('*** vm.xmldata 2 ****');
                    console.log(vm.xmldata);
                }
                // the xml has different format nodes
                if (vm.item.mis1Data) {
                    if (vm.item.mis1Data.length === 1) {
                        vm.photo = vm.item.mis1Data[0].image[vm.index];
                        vm.total = vm.item.mis1Data[0].image.length;
                        vm.itemData = vm.item.mis1Data[0];
                    } else if (vm.item.mis1Data.length > 1) {
                        if(vm.item.mis1Data[vm.index].image) {
                            vm.photo = vm.item.mis1Data[vm.index].image[0];
                        }
                        vm.total = vm.item.mis1Data.length;
                        vm.itemData = vm.item.mis1Data[vm.index];
                    }

                    // pass this data to use in prm-back-to-search-result-button-after
                    sv.setPhoto(vm.item);
                }

                if(vm.item.restrictedImage && vm.isLoggedIn===false) {
                    vm.imageNav=false;
                }

                // hide previous page
                var doc = document.getElementById('fullView');
                var div = doc.getElementsByClassName('full-view-inner-container');
                div[0].style.display = 'none';
            }
        };

        vm.$onChanges=function() {

            // if the smaller screen size, make the flex size to 100.
            if($mdMedia('sm')) {
                vm.flexsize=100;
            } else if($mdMedia('xs')) {
                vm.flexsize=100;
            }

            vm.displayPhoto();

        };

        // when a user click on breadcrumbs navigator
        vm.goBack=function () {
          $window.location.href=vm.breadcrumbs.url;
        };

        // next photo
        vm.nextPhoto=function () {
            vm.index++;
            if(vm.index < vm.total && vm.index >=0) {
                vm.displayPhoto();
            } else {
                vm.index=0;
                vm.displayPhoto();
            }
        };
        // prev photo
        vm.prevPhoto=function () {
            vm.index--;
            if(vm.index >= 0 && vm.index < vm.total) {
                vm.displayPhoto();
            } else {
                vm.index=vm.total - 1;
                vm.displayPhoto();
            }
        };

        // check if the item is array or not
        vm.isArray=function (obj) {
            if(Array.isArray(obj)) {
                return true;
            } else {
                return false;
            }
        }

    }]);

angular.module('viewCustom')
    .component('customSingleImage', {
        bindings: {item: '<',services:'<',params:'<'},
        controller: 'customSingleImageController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-single-image.html'
    });

