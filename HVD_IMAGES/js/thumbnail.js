/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom')
    .component('thumbnail', {
        templateUrl:'/primo-explore/custom/HVD_IMAGES/html/thumbnail.html',
        bindings: {
            dataitem:'<',
            searchdata:'<'
        },
        controllerAs:'vm',
        controller:['$element','$timeout','$window','$mdDialog','prmSearchService',function ($element,$timeout,$window,$mdDialog,prmSearchService) {
            var vm=this;
            var sv=prmSearchService;
            vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false,'contextFlag':false};
            vm.modalDialogFlag=false;

            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false,'contextFlag':false};
                if(vm.dataitem.pnx.links.thumbnail[0]) {
                    $timeout(function () {
                        var img=$element.find('img')[0];
                        // use default image if it is a broken link image
                        var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                        if(pattern.test(vm.src)) {
                            img.src='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                        }
                        img.onload=vm.callback;
                        // show lock up icon
                        if(vm.dataitem.restrictedImage) {
                            vm.localScope.hideLockIcon = true;
                        }

                    },200);

                }

            };

            vm.$doCheck=function() {
                vm.modalDialogFlag=sv.getDialogFlag();
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

            $element.bind('contextmenu',function (e) {
                vm.localScope.contextFlag=true;
                e.preventDefault();
                return false;
            });


            vm.closePopUp=function (e) {
                vm.localScope.contextFlag = false;
            };

            vm.openWindow=function () {
                var url='/primo-explore/fulldisplay?vid=HVD_IMAGES&docid='+vm.dataitem.pnx.control.recordid[0];
                $window.open(url,'_blank');
                vm.localScope.contextFlag=false;
            };

            // open modal dialog when click on thumbnail image
            vm.openDialog=function ($event) {
                // set data to build full display page
                var itemData={'item':'','searchData':''};
                itemData.item=vm.dataitem;
                itemData.searchData=vm.searchdata;
                sv.setItem(itemData);

                // modal dialog pop up here
                $mdDialog.show({
                    title:'Full View Details',
                    target:$event,
                    clickOutsideToClose: true,
                    focusOnOpen:true,
                    escapeToClose: true,
                    bindToController:true,
                    templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-full-view-dialog.html',
                    controller:'customFullViewDialogController',
                    controllerAs:'vm',
                    fullscreen:true,
                    multiple:false,
                    openFrom:{left:0},
                    locals: {
                        items:itemData
                    },
                    onComplete:function (scope, element) {
                       sv.setDialogFlag(true);
                    },
                    onRemoving:function (element,removePromise) {
                        sv.setDialogFlag(false);
                    }
                });

            };

            // When a user press enter by using tab key
            vm.openDialog2=function(e){
                if(e.which===13||e.which===1){
                    vm.openDialog(e);
                }

            };


        }]
    });
