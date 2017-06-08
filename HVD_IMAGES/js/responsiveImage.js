/**
 * Created by samsan on 5/23/17.
 * If image width is greater than 600pixel, it will resize base on responsive css.
 * It use to show a single image on the page. If the image does not exist, it use icon_image.png
 */

angular.module('viewCustom')
    .component('responsiveImage', {
        templateUrl:'/primo-explore/custom/HVD_IMAGES/html/responsiveImage.html',
        bindings: {
          src:'<',
          imgtitle: '<',
          restricted:'<'
        },
        controllerAs:'vm',
        controller:['$element',function ($element) {
            var vm=this;
            // set up local scope variables
            vm.localScope={'imgClass':'','loading':true,'hideLockIcon':false};

            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                vm.localScope={'imgClass':'','loading':true,'hideLockIcon':false};
                if(vm.src) {
                    var img=$element[0].firstChild.children[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if(pattern.test(vm.src)) {
                        img.src='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                    }
                    img.onload=vm.callback;
                }
            };
            vm.callback=function () {
                var image=$element[0].firstChild.children[0];
                // resize the image if it is larger than 600 pixel
                if(image.width > 600){
                    vm.localScope.imgClass='responsiveImage';
                    image.className='md-card-image '+vm.localScope.imgClass;
                }
                // force to hide ajax loader icon
                vm.localScope.loading=false;
                var span=$element[0].firstChild.children[1];
                span.hidden=true;

                // force to show lock icon
                if(vm.restricted) {
                    vm.localScope.hideLockIcon=true;
                }
                
            }

        }]
    });
