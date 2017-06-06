/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom')
    .component('thumbnail', {
        template:`<img [ngSrc]="$ctrl.src"  [ng-class]="$ctrl.imgclass" alt="{{$ctrl.imgtitle}}"/><div ng-if="$ctrl.restricted" class="lockIcon"><img ng-hide="$ctrl.hideLockIcon" src="custom/HVD_IMAGES/img/lock_small.png"  alt="Lock"/></div>`,
        bindings: {
          src:'<',
          imgtitle: '<',
          restricted:'<',
        },
        controller:['$element',function ($element) {
            var vm=this;
            vm.imgclass='responsivePhoto';
            vm.hideLockIcon=true;
            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                if(vm.src) {
                    var img=$element[0].firstChild;
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if(pattern.test(vm.src)) {
                        img.src='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                    } else {
                        img.src = vm.src;
                    }
                    img.onload=vm.callback;
                }
            };
            vm.callback=function () {
                var image=$element[0].firstChild;
                if(image.height > 150){
                    vm.imgclass='responsivePhoto';
                    image.className=vm.imgclass;
                } else {
                    vm.imgclass='';
                }

                vm.hideLockIcon=false;
            }

        }]
    });
