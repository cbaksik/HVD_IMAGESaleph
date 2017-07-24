/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom')
    .component('customThumbnail', {
        templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-thumbnail.html',
        bindings: {
            itemdata:'<',
            searchdata: '<'
        },
        controllerAs:'vm',
        controller:['$element','$timeout','prmSearchService',function ($element,$timeout,prmSearchService) {
            var vm=this;
            var sv=prmSearchService;
            vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false};
            vm.imageUrl='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
            vm.src='';
            vm.imageCaption='';
            vm.restricted=false;
            vm.imageFlag=false;


            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                vm.localScope={'imgclass':'','hideLockIcon':false};
                if(vm.itemdata.image) {
                    vm.imageFlag=true;
                    if(vm.itemdata.image.length===1) {
                        vm.src=vm.itemdata.image[0].thumbnail[0]._attr.href._value + '?width=150&height=150';
                        vm.restricted=vm.itemdata.image[0]._attr.restrictedImage._value;
                        if(vm.itemdata.image[0].caption) {
                            vm.imageCaption = vm.itemdata.image[0].caption[0]._text;
                        }
                    }
                }

                if(vm.src && vm.imageFlag) {
                    vm.imageUrl=sv.getHttps(vm.src);
                    $timeout(function () {
                        var img=$element.find('img')[0];
                        // use default image if it is a broken link image
                        var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                        if(pattern.test(vm.src)) {
                            img.src='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                        }
                        img.onload = vm.callback;
                        if(img.clientWidth > 50) {
                            vm.callback();
                        }

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
            

            $element.bind('contextmenu',function (e) {
                e.preventDefault();
                return false;
            });


        }]
    });
