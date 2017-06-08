/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom')
    .component('thumbnail', {
        templateUrl:'/primo-explore/custom/HVD_IMAGES/html/thumbnail.html',
        bindings: {
          src:'<',
          imgtitle: '<',
          restricted:'<',
        },
        controllerAs:'vm',
        controller:['$element',function ($element) {
            var vm=this;
            vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false};

            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false};
                if(vm.src) {
                    var img=$element[0].firstChild.children[0].children[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if(pattern.test(vm.src)) {
                        img.src='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                    }
                    img.onload=vm.callback;
                }

            };
            vm.callback=function () {
                var image=$element[0].firstChild.children[0].children[0];

                if(image.height > 150){
                    vm.localScope.imgclass='responsivePhoto';
                    image.className='md-card-image '+ vm.localScope.imgclass;
                }

                // show lock up icon
                if(vm.restricted) {
                    vm.localScope.hideLockIcon = true;
                }
            };


        }]
    });
