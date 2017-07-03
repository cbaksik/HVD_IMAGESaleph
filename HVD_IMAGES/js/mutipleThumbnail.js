/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom')
    .component('multipleThumbnail', {
        templateUrl:'/primo-explore/custom/HVD_IMAGES/html/multipleThumbnail.html',
        bindings: {
            src:'<',
            imgtitle: '<',
            restricted:'<'
        },
        controllerAs:'vm',
        controller:['$element','$timeout','prmSearchService',function ($element,$timeout,prmSearchService) {
            var vm=this;
            var sv=prmSearchService;
            vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false};
            vm.imageUrl='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';


            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false};
                if(vm.src) {
                    vm.imageUrl=sv.getHttps(vm.src);
                    $timeout(function () {
                        var img=$element.find('img')[0];
                        // use default image if it is a broken link image
                        var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                        if(pattern.test(vm.src)) {
                            img.src='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                        }
                        img.onload=vm.callback;

                    },300);

                }

            };
            vm.callback=function () {
                var image=$element.find('img')[0];
                if(image.height > 150){
                    vm.localScope.imgclass='responsivePhoto';
                    image.className='md-card-image '+ vm.localScope.imgclass;
                }
                // show lock up icon
                if(vm.restricted) {
                    vm.localScope.hideLockIcon = true;
                }
            };
            
            vm.showToolTip=function (e) {
                vm.localScope.hideTooltip=true;
            };

            vm.hideToolTip=function (e) {
                vm.localScope.hideTooltip=false;
            };

            $element.bind('contextmenu',function (e) {
                e.preventDefault();
                return false;
            });


        }]
    });
