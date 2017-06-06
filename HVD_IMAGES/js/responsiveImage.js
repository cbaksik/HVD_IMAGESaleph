/**
 * Created by samsan on 5/23/17.
 * If image width is greater than 600pixel, it will resize base on responsive css.
 * It use to show a single image on the page. If the image does not exist, it use icon_image.png
 */

angular.module('viewCustom')
    .component('responsiveImage', {
        template:`<img [ngSrc]="$ctrl.src" [ngClass]="$ctrl.imgClass" alt="{{$ctrl.imgtitle}}" title="{{$ctrl.imgtitle}}"/><div ng-if="$ctrl.restricted" class="lockIcon"><img ng-hide="$ctrl.hideLockIcon" src="custom/HVD_IMAGES/img/lock_small.png" alt="Lock"/></div>`,
        bindings: {
          src:'<',
          imgtitle: '<',
          restricted:'<'
        },
        controller:['$element',function ($element) {
            var vm=this;
            vm.imgClass='';
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
                if(image.width > 600){
                    vm.imgClass='responsiveImage';
                    image.className=vm.imgClass;
                }
                vm.hideLockIcon=false;
            }

        }]
    });