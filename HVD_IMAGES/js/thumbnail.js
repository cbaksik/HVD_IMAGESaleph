/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom')
    .component('thumbnail', {
        template:`<img src="{{$ctrl.src}}" class="{{$ctrl.imgClass}}" alt="{{$ctrl.title}}"/><div ng-if="$ctrl.restricted" class="lockIcon"><img src="custom/HVD_IMAGES/img/icon_lock.png"/></div>`,
        bindings: {
          src:'<',
          title: '<',
          restricted:'<'
        },
        controller:function ($element) {
            var vm=this;
            vm.imgClass='';
            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$doCheck=function () {
                if(vm.src) {
                    var img=$element[0].firstChild;
                    if(img.height > 150){
                        vm.imgClass='responsivePhoto';
                    }

                }
            };

        }
    });
