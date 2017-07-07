/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom')
    .component('favoriteThumbnail', {
        templateUrl:'/primo-explore/custom/HVD_IMAGES/html/favoriteThumbnail.html',
        bindings: {
            dataitem:'<',
            searchdata:'<'
        },
        controllerAs:'vm',
        controller:['$element','$timeout','$window','$mdDialog','prmSearchService','$location',function ($element,$timeout,$window,$mdDialog,prmSearchService,$location) {
            var vm=this;
            var sv=prmSearchService;
            vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false,'contextFlag':false};
            vm.modalDialogFlag=false;
            vm.imageUrl='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
            vm.linkUrl='';
            vm.params=$location.search();

            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                vm.localScope={'imgclass':'','hideLockIcon':false,'hideTooltip':false,'contextFlag':false};
                if(vm.dataitem.pnx.links.thumbnail) {
                    vm.imageUrl=sv.getHttps(vm.dataitem.pnx.links.thumbnail[0]);
                    $timeout(function () {
                        var img=$element.find('img')[0];
                        // use default image if it is a broken link image
                        var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                        if(pattern.test(vm.dataitem.pnx.links.thumbnail[0])) {
                            img.src='/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                        }
                        img.onload = vm.callback;

                        if(img.clientWidth > 50) {
                            vm.callback();
                        }

                    },300);

                }

                var vid='HVD_IMAGES';
                var searchString='';
                var q='';
                var sort='rank';
                var offset=0;
                var tab='';
                var scope='';
                if(vm.searchdata) {
                    vid=vm.searchdata.vid;
                    searchString=vm.searchdata.searchString;
                    q=vm.searchdata.q;
                    sort=vm.searchdata.sort;
                    offset=vm.searchdata.offset;
                    tab=vm.searchdata.tab;
                    scope=vm.searchdata.scope;
                } else if(vm.params) {
                    vid=vm.params.vid;
                }


                vm.linkUrl='/primo-explore/fulldisplay?vid='+vid+'&docid='+vm.dataitem.pnx.control.recordid[0]+'&sortby='+sort;
                vm.linkUrl+='&q='+q+'&searchString='+searchString+'&offset='+offset;
                vm.linkUrl+='&tab='+tab+'&search_scope='+scope;
                if(vm.params.facet) {
                    if(Array.isArray(vm.params.facet)) {
                        for(var i=0; i < vm.params.facet.length; i++) {
                            vm.linkUrl+='&facet='+vm.params.facet[i];
                        }
                    } else {
                        vm.linkUrl += '&facet=' + vm.params.facet;
                    }
                }

            };

            vm.callback=function () {
                var image=$element.find('img')[0];
                if(image.height > 150){
                    vm.localScope.imgclass='responsivePhoto';
                    image.className='md-card-image '+ vm.localScope.imgclass;
                }
                if(vm.dataitem.restrictedImage) {
                    vm.localScope.hideLockIcon = true;
                }

                var divs=$element[0].children[0].children[0].children[0];
                if(divs) {
                    divs.style.marginLeft = (image.clientWidth - 20) + 'px';
                }

            };


            vm.openWindow=function () {
                var url='/primo-explore/fulldisplay?vid=HVD_IMAGES&docid='+vm.dataitem.pnx.control.recordid[0];
                $window.open(url,'_blank');
            };


        }]
    });

