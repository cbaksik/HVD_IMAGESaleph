/**
 * Created by samsan on 6/9/17.
 * This component is for a single image full display when a user click on thumbnail from a full display page
 */

angular.module('viewCustom')
    .controller('customViewComponentController', [ '$sce','$mdMedia','prmSearchService','$location','$stateParams', '$element','$timeout', function ($sce,$mdMedia,prmSearchService,$location,$stateParams, $element, $timeout) {

        let vm = this;
        var sv=prmSearchService;
        // get location parameter
        vm.params=$location.search();
        // get parameter from angular ui-router
        vm.context=$stateParams.context;
        vm.docid=$stateParams.docid;
        vm.index=parseInt($stateParams.index);

        vm.photo={};
        vm.flexsize=80;
        vm.total=0;
        vm.itemData={};
        vm.imageNav=true;
        vm.xmldata={};
        vm.imageTitle='';
        vm.jp2=false;

        // ajax call to get data
        vm.getData=function () {
            var url=vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL+'/'+vm.context+'/'+vm.docid;
            var params={'vid':'','lang':'','search_scope':'','adaptor':''};
            params.vid=vm.params.vid;
            params.lang=vm.params.lang;
            params.search_scope=vm.params.search_scope;
            params.adaptor=vm.params.adaptor;
            sv.getAjax(url,params,'get')
                .then(function (result) {
                    vm.item=result.data;
                    // convert xml to json
                    if(vm.item.pnx.addata) {
                        vm.xmldata = sv.getXMLdata(vm.item.pnx.addata.mis1[0]);

                    }
                    // show total of image
                    if(vm.xmldata.surrogate) {
                        vm.total=vm.xmldata.surrogate.length;
                    } else if(vm.xmldata.image) {
                        vm.total=vm.xmldata.image.length;
                    } else if(vm.xmldata.length) {
                        vm.total=vm.xmldata.length;
                    }
                    // display photo
                    vm.displayPhoto();

                },function (error) {
                        console.log(error);
                    }

                );

        };


        vm.displayPhoto=function () {
            vm.isLoggedIn=sv.getLogInID();
            if (vm.xmldata.surrogate && !vm.xmldata.image) {
                if(vm.xmldata.surrogate[vm.index].image) {
                    vm.photo = vm.xmldata.surrogate[vm.index].image[0];
                    // find out if the image is jp2 or not
                    vm.jp2=sv.findJP2(vm.photo);

                } else {
                    vm.photo = vm.xmldata.surrogate[vm.index];
                    vm.jp2=sv.findJP2(vm.photo);
                }
                if(vm.xmldata.surrogate[vm.index].title) {
                    vm.imageTitle = vm.xmldata.surrogate[vm.index].title[0].textElement[0]._text;
                }
            } else if(vm.xmldata.image) {
                vm.photo=vm.xmldata.image[vm.index];
                vm.jp2=sv.findJP2(vm.photo);
            } else {
                vm.photo=vm.xmldata[vm.index];
            }

            if(vm.photo._attr && vm.photo._attr.restrictedImage) {
                if(vm.photo._attr.restrictedImage._value && vm.isLoggedIn===false) {
                    vm.imageNav=false;
                }
            }


        };

        vm.$onChanges=function() {

            // if the smaller screen size, make the flex size to 100.
            if($mdMedia('sm')) {
                vm.flexsize=100;
            } else if($mdMedia('xs')) {
                vm.flexsize=100;
            }
            // call ajax and display data
            vm.getData();
            // hide search bar
            var el=$element[0].parentNode.parentNode.children[0].children[2];
            if(el) {
                el.style.display = 'none';
            }


            // insert a header into black topbar
            $timeout(function (e) {
                var topbar = $element[0].parentNode.parentNode.children[0].children[0].children[1];
                if(topbar) {
                    var divNode=document.createElement('div');
                    divNode.setAttribute('class','metadataHeader');
                    var textNode=document.createTextNode('FULL IMAGE DETAIL');
                    divNode.appendChild(textNode);
                    topbar.insertBefore(divNode,topbar.children[2]);
                    // remove pin and bookmark
                    topbar.children[3].remove();
                    // remove user login message
                    topbar.children[3].remove();
                }


            },300);

        };


        // next photo
        vm.nextPhoto=function () {
            vm.index++;
            if(vm.index < vm.total && vm.index >=0) {
                vm.displayPhoto();
            } else {
                vm.index=0;
                vm.displayPhoto();
            }
        };
        // prev photo
        vm.prevPhoto=function () {
            vm.index--;
            if(vm.index >= 0 && vm.index < vm.total) {
                vm.displayPhoto();
            } else {
                vm.index=vm.total - 1;
                vm.displayPhoto();
            }
        };

        // check if the item is array or not
        vm.isArray=function (obj) {
            if(Array.isArray(obj)) {
                return true;
            } else {
                return false;
            }
        }

    }]);

angular.module('viewCustom')
    .component('customViewComponent', {
        bindings: {item: '<',services:'<',params:'<',parentCtrl:'<'},
        controller: 'customViewComponentController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-view-component.html'
    });

