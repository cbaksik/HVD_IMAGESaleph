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
        controller:['$element','$timeout',function ($element,$timeout) {
            var vm=this;
            vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false};

            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false};
                if(vm.src) {
                    $timeout(function () {
                        var img=$element.find('img')[0];
                        // use default image if it is a broken link image
                        var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                        if(pattern.test(vm.src)) {
                            img.src='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                        }
                        img.onload=vm.callback;
                        // show lock up icon
                        if(vm.restricted) {
                            vm.localScope.hideLockIcon = true;
                        }
                    },200);
                }

            };
            vm.callback=function () {
                var image=$element.find('img')[0];
                if(image.height > 150){
                    vm.localScope.imgclass='responsivePhoto';
                    image.className='md-card-image '+ vm.localScope.imgclass;
                }

            };
            
            vm.showToolTip=function (e) {
                vm.localScope.hideTooltip=true;
            };

            vm.hideToolTip=function (e) {
                vm.localScope.hideTooltip=false;
            };


        }]
    });
