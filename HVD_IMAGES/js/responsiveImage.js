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
        controller:['$element','$window','$location','prmSearchService','$timeout',function ($element,$window,$location,prmSearchService, $timeout) {
            var vm=this;
            var sv=prmSearchService;
            // set up local scope variables
            vm.showImage=true;
            vm.params=$location.search();
            vm.localScope={'imgClass':'','loading':true,'hideLockIcon':false};
            vm.isLoggedIn=sv.getLogInID();

            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                vm.isLoggedIn=sv.getLogInID();
                if(vm.restricted && !vm.isLoggedIn) {
                    vm.showImage=false;
                }
                vm.localScope={'imgClass':'','loading':true,'hideLockIcon':false};
                if(vm.src && vm.showImage) {
                    $timeout(function () {
                        var img=$element.find('img')[0];
                        // use default image if it is a broken link image
                        var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                        if(pattern.test(vm.src)) {
                            img.src='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                        }
                        img.onload=vm.callback;
                        if(img.width > 50) {
                            vm.callback();
                        }
                    },200);

                }

                vm.localScope.loading=false;

            };
            vm.callback=function () {
                var image=$element.find('img')[0];
                // resize the image if it is larger than 600 pixel
                if(image.width > 600){
                    vm.localScope.imgClass='responsiveImage';
                    image.className='md-card-image '+vm.localScope.imgClass;
                }
                
                // force to show lock icon
                if(vm.restricted) {
                    vm.localScope.hideLockIcon=true;
                }
            };
            // login
            vm.signIn=function () {
                var auth=sv.getAuth();
                var params={'vid':'','targetURL':''};
                params.vid=vm.params.vid;
                params.targetURL=$window.location.href;
                var url='/primo-explore/login?from-new-ui=1&authenticationProfile='+auth.authenticationMethods[0].profileName+'&search_scope=default_scope&tab=default_tab';
                url+='&Institute='+auth.authenticationService.userSessionManagerService.userInstitution+'&vid='+params.vid;
                if(vm.params.offset) {
                    url+='&offset='+vm.params.offset;
                }
                url+='&targetURL='+encodeURIComponent(params.targetURL);
                $window.location.href=url;
            };

        }]
    });
