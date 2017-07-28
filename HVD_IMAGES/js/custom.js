(function(){
"use strict";
'use strict';

angular.module('viewCustom', ['angularLoad', 'cl.paging']);

/**
 * Created by samsan on 7/26/17.
 */

angular.module('viewCustom').controller('customFavoriteActionDialogController', ['items', 'position', 'flexsize', 'record', '$mdDialog', '$location', 'prmSearchService', function (items, position, flexsize, record, $mdDialog, $location, prmSearchService) {
    // local variables
    var vm = this;
    var sv = prmSearchService;
    vm.imageUrl = '/primo-explore/custom/HVD_IMAGES/img/ajax-loader.gif';
    vm.item = items;
    vm.position = position;
    vm.flexSize = flexsize;
    vm.selectedAction = position.action;
    vm.activeAction = position.action;
    vm.displayCloseIcon = false;
    vm.searchdata = $location.search();

    if (vm.item.pnx.links.thumbnail) {
        vm.imageUrl = vm.item.pnx.links.thumbnail[0];
    }

    vm.openTab = function ($event, action) {
        vm.selectedAction = action;
        vm.activeAction = action;
    };

    vm.unpin = function (index, recordid) {
        vm.position.pin = true;
        vm.position.recordId = recordid;
        $mdDialog.hide();
    };

    // open modal dialog when click on thumbnail image
    vm.openDialog = function ($event, item) {
        // set data to build full display page
        var itemData = { 'item': '', 'searchData': '' };
        itemData.item = item;
        itemData.searchData = vm.searchdata;
        sv.setItem(itemData);

        // modal dialog pop up here
        $mdDialog.show({
            title: 'Full View Details',
            target: $event,
            clickOutsideToClose: true,
            focusOnOpen: true,
            escapeToClose: true,
            bindToController: true,
            templateUrl: '/primo-explore/custom/HVD_IMAGES/html/custom-full-view-dialog.html',
            controller: 'customFullViewDialogController',
            controllerAs: 'vm',
            fullscreen: true,
            multiple: true,
            openFrom: { left: 0 },
            locals: {
                items: itemData
            },
            onComplete: function onComplete(scope, element) {
                sv.setDialogFlag(true);
            },
            onRemoving: function onRemoving(element, removePromise) {
                sv.setDialogFlag(false);
            }
        });
        return false;
    };

    // When a user press enter by using tab key
    vm.openDialog2 = function (e, item) {
        if (e.which === 13 || e.which === 1) {
            vm.openDialog(e, item);
        }
    };

    vm.closeDialog = function () {
        $mdDialog.hide();
    };
}]);

/**
 * Created by samsan on 7/25/17.
 */

angular.module('viewCustom').controller('customFavoriteListController', ['prmSearchService', '$mdDialog', '$mdMedia', '$location', function (prmSearchService, $mdDialog, $mdMedia, $location) {

    var sv = prmSearchService;
    var vm = this;
    vm.searchdata = {};
    vm.chooseAll = false;
    vm.itemList = []; // store pin favorite list
    vm.pinItems = []; // origin pin items
    vm.rightLabelClick = false;
    vm.flexSize = { 'col1': 5, 'col2': 15, 'col3': 55, 'col4': 25 };
    vm.records = [];
    vm.params = $location.search();

    // ajax call to get favorite data list
    vm.getData = function () {
        if (vm.parentCtrl.favoritesService) {
            var url = vm.parentCtrl.favoritesService.restBaseURLs.pnxBaseURL + '/U';
            var param = { 'recordIds': '' };
            param.recordIds = vm.parentCtrl.favoritesService.recordsId.join();
            vm.records = vm.parentCtrl.favoritesService.records;
            if (vm.records.length > 0) {
                sv.getAjax(url, param, 'get').then(function (result) {
                    if (result.status === 200) {
                        if (result.data.length > 0) {
                            vm.itemList = sv.convertData(result.data);
                            vm.pinItems = angular.copy(vm.itemList); // make copy data to avoid using binding data
                            vm.unCheckAll();
                        }
                    } else {
                        console.log('**** It cannot get favorite item list data because it has problem with DB server ***');
                    }
                }, function (err) {
                    console.log(err);
                });
            }
        }
    };

    //check if there is a label base on the records
    vm.isLabel = function (recordid) {
        var flag = false;
        for (var i = 0; i < vm.records.length; i++) {
            if (vm.records[i].recordId === recordid) {
                flag = true;
                i = vm.records.length;
            }
        }
        return flag;
    };

    // unpin each item
    vm.unpin = function (index, recordid) {
        var url = vm.parentCtrl.favoritesService.restBaseURLs.favoritesBaseURL;
        var param = { 'delete': { 'records': [{ 'recordId': '' }] } };
        param.delete.records[0].recordId = recordid;
        sv.postAjax(url, param).then(function (result) {
            console.log('*** unpin ****');
            console.log(result);

            if (result.status === 200) {
                vm.itemList.splice(index, 1);
                vm.pinItems.splice(index, 1);
            } else {
                console.log('*** It cannot unpin this item because it has problem with DB server ***');
            }
        }, function (err) {
            console.log(err);
        });
    };

    vm.unpinAll = function () {
        var url = vm.parentCtrl.favoritesService.restBaseURLs.favoritesBaseURL;
        var param = { 'delete': { 'records': [{ 'recordId': '' }] } };
        var recordids = [];
        var k = 0;
        // add all checked items into recordids so it can send all of them as post
        for (var i = 0; i < vm.itemList.length; i++) {
            if (vm.itemList[i].checked) {
                recordids[k] = { 'recordId': 0 };
                if (vm.itemList[i].pnx.control) {
                    recordids[k].recordId = vm.itemList[i].pnx.control.recordid[0];
                    k++;
                }
            }
        }
        param.delete.records = recordids;
        sv.postAjax(url, param).then(function (result) {
            if (result.status === 200) {
                // remove item from the list if the delete is successfully
                var unCheckItems = [];
                for (var i = 0; i < vm.itemList.length; i++) {
                    if (vm.itemList[i].checked === false) {
                        unCheckItems.push(vm.itemList[i]);
                    }
                }
                vm.itemList = unCheckItems;
                vm.pinItems = angular.copy(unCheckItems);
                vm.chooseAll = false;
            } else {
                console.log('**** It cannot unpin these items because it has problem with DB server ***');
            }
        }, function (err) {
            console.log(err);
        });
    };

    vm.checkAll = function () {
        if (vm.chooseAll === false) {
            for (var i = 0; i < vm.itemList.length; i++) {
                vm.itemList[i].checked = true;
            }
        } else {
            vm.unCheckAll();
        }
    };

    vm.unCheckAll = function () {
        for (var i = 0; i < vm.itemList.length; i++) {
            vm.itemList[i].checked = false;
        }
    };

    // open modal dialog when click on thumbnail image
    vm.openDialog = function ($event, item) {
        // set data to build full display page
        var itemData = { 'item': '', 'searchData': '' };
        itemData.item = item;
        itemData.searchData = vm.searchdata;
        sv.setItem(itemData);

        // modal dialog pop up here
        $mdDialog.show({
            title: 'Full View Details',
            target: $event,
            clickOutsideToClose: true,
            focusOnOpen: true,
            escapeToClose: true,
            bindToController: true,
            templateUrl: '/primo-explore/custom/HVD_IMAGES/html/custom-full-view-dialog.html',
            controller: 'customFullViewDialogController',
            controllerAs: 'vm',
            fullscreen: true,
            multiple: false,
            openFrom: { left: 0 },
            locals: {
                items: itemData
            },
            onComplete: function onComplete(scope, element) {
                sv.setDialogFlag(true);
            },
            onRemoving: function onRemoving(element, removePromise) {
                sv.setDialogFlag(false);
            }
        });
        return false;
    };

    // When a user press enter by using tab key
    vm.openDialog2 = function (e, item) {
        if (e.which === 13 || e.which === 1) {
            vm.openDialog(e, item);
        }
    };

    vm.openActionDialog = function ($event, item, divid, index, action) {
        var el = angular.element(document.querySelector('#' + divid));
        vm.position = { 'width': 0, 'height': 0, 'top': 0, 'left': 0, index: index, 'action': 'none', 'pin': false };
        if (el) {
            vm.position.width = el[0].clientWidth + 40 + 'px';
            vm.position.height = el[0].clientHeight + 100;
            vm.position.left = el[0].offsetLeft;
            vm.position.top = el[0].offsetTop - 40 + 'px';
        }

        vm.position.action = action;

        $mdDialog.show({
            parent: document.querySelector('#' + divid),
            title: 'Action dialog',
            target: $event,
            clickOutsideToClose: true,
            focusOnOpen: true,
            escapeToClose: true,
            bindToController: true,
            templateUrl: '/primo-explore/custom/HVD_IMAGES/html/custom-favorite-action-dialog.html',
            controller: 'customFavoriteActionDialogController',
            controllerAs: 'vm',
            fullscreen: false,
            hasBackdrop: false,
            multiple: true,
            disableParentScroll: false,
            openFrom: { left: '100px' },
            closeTo: { width: '100%' },
            locals: {
                items: item,
                position: vm.position,
                flexsize: vm.flexSize,
                record: vm.records[index]
            },
            onShowing: function onShowing(scope, element) {},
            onRemoving: function onRemoving(element, removePromise) {
                // unpin item if a user click on pin on modal dialog
                if (vm.position.pin) {
                    vm.unpin(vm.position.index, vm.position.recordId);
                }
            }
        });
        return false;
    };

    // get update records when a user add labels
    vm.$doCheck = function () {
        if (vm.parentCtrl.favoritesService) {
            vm.records = vm.parentCtrl.favoritesService.records;
            if (vm.parentCtrl.favoritesService.selectedLabels.length > 0) {
                vm.itemList = sv.convertData(vm.parentCtrl.favoritesService.items);
                vm.rightLabelClick = true;
            } else if (vm.itemList.length < vm.pinItems.length && vm.rightLabelClick) {
                vm.itemList = angular.copy(vm.pinItems);
                vm.rightLabelClick = false;
            }
        }
    };

    vm.$onChanges = function () {
        // format the size to fit smaller screen
        if ($mdMedia('xs')) {
            vm.flexSize.col1 = 100;
            vm.flexSize.col2 = 100;
            vm.flexSize.col3 = 100;
            vm.flexSize.col4 = 100;
        } else if ($mdMedia('sm')) {
            vm.flexSize.col1 = 5;
            vm.flexSize.col2 = 20;
            vm.flexSize.col3 = 50;
            vm.flexSize.col4 = 25;
        }

        vm.getData();
    };
}]);

angular.module('viewCustom').component('customFavoriteList', {
    bindings: { parentCtrl: '<' },
    controller: 'customFavoriteListController',
    controllerAs: 'vm',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/custom-favorite-list.html'
});

/**
 * Created by samsan on 5/17/17.
 * A custom modal dialog when a user click on thumbnail on search result list page
 */
angular.module('viewCustom').controller('customFullViewDialogController', ['items', '$mdDialog', 'prmSearchService', function (items, $mdDialog, prmSearchService) {
    // local variables
    var vm = this;
    var sv = prmSearchService;
    vm.item = {};
    vm.item = items.item;
    vm.searchData = items.searchData;

    sv.setItem(items);
    vm.closeDialog = function () {
        $mdDialog.hide();
    };
}]);

/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom').component('customThumbnail', {
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/custom-thumbnail.html',
    bindings: {
        itemdata: '<',
        searchdata: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$timeout', 'prmSearchService', function ($element, $timeout, prmSearchService) {
        var vm = this;
        var sv = prmSearchService;
        vm.localScope = { 'imgclass': '', 'hideLockIcon': false, 'hideTooltip': false };
        vm.imageUrl = '/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
        vm.src = '';
        vm.imageCaption = '';
        vm.restricted = false;
        vm.imageFlag = false;

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {
            vm.localScope = { 'imgclass': '', 'hideLockIcon': false };
            if (vm.itemdata.image) {
                vm.imageFlag = true;
                if (vm.itemdata.image.length === 1) {
                    vm.src = vm.itemdata.image[0].thumbnail[0]._attr.href._value + '?width=150&height=150';
                    vm.restricted = vm.itemdata.image[0]._attr.restrictedImage._value;
                    if (vm.itemdata.image[0].caption) {
                        vm.imageCaption = vm.itemdata.image[0].caption[0]._text;
                    }
                }
            }

            if (vm.src && vm.imageFlag) {
                vm.imageUrl = sv.getHttps(vm.src);
                $timeout(function () {
                    var img = $element.find('img')[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if (pattern.test(vm.src)) {
                        img.src = '/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                    }
                    img.onload = vm.callback;
                    if (img.clientWidth > 50) {
                        vm.callback();
                    }
                }, 300);
            }
        };
        vm.callback = function () {
            var image = $element.find('img')[0];
            if (image.height > 150) {
                vm.localScope.imgclass = 'responsivePhoto';
                image.className = 'md-card-image ' + vm.localScope.imgclass;
            }
            // show lock up icon
            if (vm.restricted) {
                vm.localScope.hideLockIcon = true;
            }
        };

        $element.bind('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });
    }]
});

/**
 * Created by samsan on 6/29/17.
 */

angular.module('viewCustom').component('customTopMenu', {
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/custom-top-menu.html',
    bindings: {
        parentCtrl: '<'
    },
    controllerAs: 'vm',
    controller: ['$sce', function ($sce) {
        var vm = this;

        vm.topRightMenus = [{ 'title': 'HOLLIS +', 'url': 'http://nrs.harvard.edu/urn-3:hul.ois:bannerhollis+', 'label': 'Go to Hollis plus' }, { 'title': 'Libraries / Hours', 'url': 'http://nrs.harvard.edu/urn-3:hul.ois:bannerfindlib', 'label': 'Go to Library hours' }, { 'title': 'All My Accounts', 'url': 'http://nrs.harvard.edu/urn-3:hul.ois:banneraccounts', 'label': 'Go to all my accounts' }];
    }]
});

/**
 * Created by samsan on 7/17/17.
 */

angular.module('viewCustom').controller('customViewAllComponentMetadataController', ['$sce', '$element', '$location', 'prmSearchService', '$window', '$stateParams', '$timeout', function ($sce, $element, $location, prmSearchService, $window, $stateParams, $timeout) {

    var vm = this;
    var sv = prmSearchService;
    vm.params = $location.search();
    // get ui-router parameters
    vm.context = $stateParams.context;
    vm.docid = $stateParams.docid;

    vm.xmldata = [];
    vm.items = {};
    // ajax call to get data
    vm.getData = function () {
        var restUrl = vm.parentCtrl.searchService.cheetah.restUrl + '/' + vm.context + '/' + vm.docid;
        var params = { 'vid': 'HVD_IMAGES', 'lang': 'en_US', 'search_scope': 'default_scope', 'adaptor': 'Local Search Engine' };
        params.vid = vm.params.vid;
        params.lang = vm.params.lang;
        params.search_scope = vm.params.search_scope;
        params.adaptor = vm.params.adaptor;
        sv.getAjax(restUrl, params, 'get').then(function (result) {
            vm.items = result.data;
            if (vm.items.pnx.addata) {
                vm.xmldata = sv.getXMLdata(vm.items.pnx.addata.mis1[0]);
            }
        }, function (err) {
            console.log(err);
        });
    };

    // show the pop up image
    vm.gotoFullPhoto = function (index) {
        // go to full display page
        var url = '/primo-explore/viewcomponent/' + vm.context + '/' + vm.docid + '/' + index + '?vid=' + vm.params.vid + '&lang=' + vm.params.lang;
        if (vm.params.adaptor) {
            url += '&adaptor=' + vm.params.adaptor;
        }
        $window.open(url, '_blank');
    };

    vm.$onChanges = function () {
        // hide search box
        var el = $element[0].parentNode.parentNode.children[0].children[2];
        if (el) {
            el.style.display = 'none';
        }

        // insert a header into black topbar
        $timeout(function (e) {
            var topbar = $element[0].parentNode.parentNode.children[0].children[0].children[1];
            if (topbar) {
                var divNode = document.createElement('div');
                divNode.setAttribute('class', 'metadataHeader');
                var textNode = document.createTextNode('FULL COMPONENT METADATA');
                divNode.appendChild(textNode);
                topbar.insertBefore(divNode, topbar.children[2]);
                // remove pin and bookmark
                topbar.children[3].remove();
                // remove user login message
                topbar.children[3].remove();
            }
        }, 300);

        vm.getData();
    };
}]);

angular.module('viewCustom').component('customViewAllComponentMetadata', {
    bindings: { parentCtrl: '<' },
    controller: 'customViewAllComponentMetadataController',
    controllerAs: 'vm',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/custom-view-all-component-metadata.html'
});

/**
 * Created by samsan on 6/9/17.
 * This component is for a single image full display when a user click on thumbnail from a full display page
 */

angular.module('viewCustom').controller('customViewComponentController', ['$sce', '$mdMedia', 'prmSearchService', '$location', '$stateParams', '$element', '$timeout', function ($sce, $mdMedia, prmSearchService, $location, $stateParams, $element, $timeout) {

    var vm = this;
    var sv = prmSearchService;
    // get location parameter
    vm.params = $location.search();
    // get parameter from angular ui-router
    vm.context = $stateParams.context;
    vm.docid = $stateParams.docid;
    vm.index = parseInt($stateParams.index);

    vm.photo = {};
    vm.flexsize = 80;
    vm.total = 0;
    vm.itemData = {};
    vm.imageNav = true;
    vm.xmldata = {};
    vm.imageTitle = '';
    vm.jp2 = false;

    // ajax call to get data
    vm.getData = function () {
        var url = vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL + '/' + vm.context + '/' + vm.docid;
        var params = { 'vid': '', 'lang': '', 'search_scope': '', 'adaptor': '' };
        params.vid = vm.params.vid;
        params.lang = vm.params.lang;
        params.search_scope = vm.params.search_scope;
        params.adaptor = vm.params.adaptor;
        sv.getAjax(url, params, 'get').then(function (result) {
            vm.item = result.data;
            // convert xml to json
            if (vm.item.pnx.addata) {
                vm.xmldata = sv.getXMLdata(vm.item.pnx.addata.mis1[0]);
            }

            // show total of image
            if (vm.xmldata.surrogate) {
                vm.total = vm.xmldata.surrogate.length;
            } else if (vm.xmldata.image) {
                vm.total = vm.xmldata.image.length;
            } else if (vm.xmldata.length) {
                vm.total = vm.xmldata.length;
            }
            // display photo
            vm.displayPhoto();
        }, function (error) {
            console.log(error);
        });
    };

    vm.displayPhoto = function () {
        vm.isLoggedIn = sv.getLogInID();
        if (vm.xmldata.surrogate && !vm.xmldata.image) {
            if (vm.xmldata.surrogate[vm.index].image) {
                vm.photo = vm.xmldata.surrogate[vm.index].image[0];
                // find out if the image is jp2 or not
                vm.jp2 = sv.findJP2(vm.photo);
            } else {
                vm.photo = vm.xmldata.surrogate[vm.index];
                vm.jp2 = sv.findJP2(vm.photo);
            }
            if (vm.xmldata.surrogate[vm.index].title) {
                vm.imageTitle = vm.xmldata.surrogate[vm.index].title[0].textElement[0]._text;
            }
        } else if (vm.xmldata.image) {
            vm.photo = vm.xmldata.image[vm.index];
            vm.jp2 = sv.findJP2(vm.photo);
        } else {
            vm.photo = vm.xmldata[vm.index];
        }

        if (vm.photo._attr && vm.photo._attr.restrictedImage) {
            if (vm.photo._attr.restrictedImage._value && vm.isLoggedIn === false) {
                vm.imageNav = false;
            }
        }
    };

    vm.$onChanges = function () {

        // if the smaller screen size, make the flex size to 100.
        if ($mdMedia('sm')) {
            vm.flexsize = 100;
        } else if ($mdMedia('xs')) {
            vm.flexsize = 100;
        }
        // call ajax and display data
        vm.getData();
        // hide search bar
        var el = $element[0].parentNode.parentNode.children[0].children[2];
        if (el) {
            el.style.display = 'none';
        }

        // insert a header into black topbar
        $timeout(function (e) {
            var topbar = $element[0].parentNode.parentNode.children[0].children[0].children[1];
            if (topbar) {
                var divNode = document.createElement('div');
                divNode.setAttribute('class', 'metadataHeader');
                var textNode = document.createTextNode('FULL IMAGE DETAIL');
                divNode.appendChild(textNode);
                topbar.insertBefore(divNode, topbar.children[2]);
                // remove pin and bookmark
                topbar.children[3].remove();
                // remove user login message
                topbar.children[3].remove();
            }
        }, 300);
    };

    // next photo
    vm.nextPhoto = function () {
        vm.index++;
        if (vm.index < vm.total && vm.index >= 0) {
            vm.displayPhoto();
        } else {
            vm.index = 0;
            vm.displayPhoto();
        }
    };
    // prev photo
    vm.prevPhoto = function () {
        vm.index--;
        if (vm.index >= 0 && vm.index < vm.total) {
            vm.displayPhoto();
        } else {
            vm.index = vm.total - 1;
            vm.displayPhoto();
        }
    };

    // check if the item is array or not
    vm.isArray = function (obj) {
        if (Array.isArray(obj)) {
            return true;
        } else {
            return false;
        }
    };
}]);

angular.module('viewCustom').component('customViewComponent', {
    bindings: { item: '<', services: '<', params: '<', parentCtrl: '<' },
    controller: 'customViewComponentController',
    controllerAs: 'vm',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/custom-view-component.html'
});

/**
 * Created by samsan on 6/5/17.
 * A modal dialog pop up the image when a user click on thumbnail image in view full detail page
 */

angular.module('viewCustom').controller('customViewImageDialogController', ['items', '$mdDialog', function (items, $mdDialog) {
    // local variables
    var vm = this;
    vm.item = items;

    // close modal dialog when a user click on x icon
    vm.closeImage = function () {
        $mdDialog.hide();
    };
}]);

/**
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Crawlink
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * Github - use bower install - from this url https://github.com/Crawlink/material-angular-paging
 * Modify by Sam San
 *
 */

(function () {
    'use strict';

    var app = angular.module("cl.paging", []);

    app.directive('clPaging', ClPagingDirective);

    ClPagingDirective.$inject = [];
    function ClPagingDirective() {
        return {
            restrict: 'EA',
            scope: {
                clPages: '=',
                clAlignModel: '=',
                clPageChanged: '&',
                clSteps: '=',
                clCurrentPage: '='
            },
            controller: ClPagingController,
            controllerAs: 'vm',
            template: ['<md-button class="md-icon-button md-raised md-warn" aria-label="First" ng-click="vm.gotoFirst()">{{ vm.first }}</md-button>', '<md-button class="md-icon-button md-raised" aria-label="Previous" ng-click="vm.gotoPrev()" ng-show="vm.index - 1 >= 0">&#8230;</md-button>', '<md-button class="md-icon-button md-raised" aria-label="Go to page {{i+1}}" ng-repeat="i in vm.stepInfo"', ' ng-click="vm.goto(vm.index + i)" ng-show="vm.page[vm.index + i]" ', ' ng-class="{\'md-primary\': vm.page[vm.index + i] == clCurrentPage}">', ' {{ vm.page[vm.index + i] }}', '</md-button>', '<md-button class="md-icon-button md-raised" aria-label="Next" ng-click="vm.gotoNext()" ng-show="vm.index + vm.clSteps < clPages">&#8230;</md-button>', '<md-button class="md-icon-button md-raised md-warn" aria-label="Last" ng-click="vm.gotoLast()">{{ vm.last }}</md-button>'].join('')
        };
    }

    ClPagingController.$inject = ['$scope', '$location', '$anchorScroll'];
    function ClPagingController($scope, $location, $anchorScroll) {
        var vm = this;

        vm.first = '<<';
        vm.last = '>>';

        vm.index = 0;

        vm.clSteps = $scope.clSteps;

        vm.goto = function (index) {
            $scope.clCurrentPage = vm.page[index];
            // customize scroll up
            $location.hash('searchResultList');
            $anchorScroll();
        };

        vm.gotoPrev = function () {
            $scope.clCurrentPage = vm.index;
            vm.index -= vm.clSteps;
            $location.hash('searchResultList');
            $anchorScroll();
        };

        vm.gotoNext = function () {
            vm.index += vm.clSteps;
            $scope.clCurrentPage = vm.index + 1;
            // customize to scroll up
            $location.hash('searchResultList');
            $anchorScroll();
        };

        vm.gotoFirst = function () {
            vm.index = 0;
            $scope.clCurrentPage = 1;
            // customize to scroll up
            $location.hash('searchResultList');
            $anchorScroll();
        };

        vm.gotoLast = function () {
            vm.index = parseInt($scope.clPages / vm.clSteps) * vm.clSteps;
            vm.index === $scope.clPages ? vm.index = vm.index - vm.clSteps : '';
            $scope.clCurrentPage = $scope.clPages;
            // customize to scroll up
            $location.hash('searchResultList');
            $anchorScroll();
        };

        $scope.$watch('clCurrentPage', function (value) {
            vm.index = parseInt((value - 1) / vm.clSteps) * vm.clSteps;
            $scope.clPageChanged();
        });

        $scope.$watch('clPages', function () {
            vm.init();
        });

        vm.init = function () {
            vm.stepInfo = function () {
                var result = [];
                for (var i = 0; i < vm.clSteps; i++) {
                    result.push(i);
                }
                return result;
            }();

            vm.page = function () {
                var result = [];
                for (var i = 1; i <= $scope.clPages; i++) {
                    result.push(i);
                }
                return result;
            }();
        };
    };
})();
/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom').component('multipleThumbnail', {
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/multipleThumbnail.html',
    bindings: {
        itemdata: '<',
        searchdata: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$timeout', 'prmSearchService', function ($element, $timeout, prmSearchService) {
        var vm = this;
        var sv = prmSearchService;
        vm.localScope = { 'imgclass': '', 'hideLockIcon': false, 'hideTooltip': false };
        vm.imageUrl = '/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
        vm.src = '';
        vm.imageTitle = '';
        vm.restricted = false;
        vm.imageFlag = false;

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {

            vm.localScope = { 'imgclass': '', 'hideLockIcon': false };
            if (vm.itemdata.image) {
                vm.imageFlag = true;
                if (vm.itemdata.image.length === 1) {
                    vm.src = vm.itemdata.image[0].thumbnail[0]._attr.href._value + '?width=150&height=150';
                    vm.restricted = vm.itemdata.image[0]._attr.restrictedImage._value;
                    if (vm.itemdata.image[0].caption) {
                        vm.imageTitle = vm.itemdata.image[0].caption[0]._text;
                    } else if (vm.itemdata.title) {
                        vm.imageTitle = vm.itemdata.title[0].textElement[0]._text;
                    }
                }
            } else if (vm.itemdata.title) {
                vm.imageTitle = vm.itemdata.title[0].textElement[0]._text;
            }

            if (vm.src && vm.imageFlag) {
                vm.imageUrl = sv.getHttps(vm.src);
                $timeout(function () {
                    var img = $element.find('img')[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if (pattern.test(vm.src)) {
                        img.src = '/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                    }
                    img.onload = vm.callback;
                    if (img.clientWidth > 50) {
                        vm.callback();
                    }
                }, 300);
            }
        };
        vm.callback = function () {
            var image = $element.find('img')[0];
            if (image.height > 150) {
                vm.localScope.imgclass = 'responsivePhoto';
                image.className = 'md-card-image ' + vm.localScope.imgclass;
            }
            // show lock up icon
            if (vm.restricted) {
                vm.localScope.hideLockIcon = true;
            }
        };

        $element.bind('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });
    }]
});

/**
 * Created by samsan on 6/22/17.
 */

angular.module('viewCustom').component('noResultsFound', {
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/no-results-found.html',
    bindings: {
        itemlength: '<'
    },
    controllerAs: 'vm',
    controller: [function () {
        var vm = this;
        vm.localScope = { 'showFlag': false };

        vm.$onChanges = function () {
            if (vm.itemlength === 0) {
                vm.localScope.showFlag = true;
            }
        };
    }]
});

/**
 * Created by samsan on 5/25/17.
 */

angular.module('viewCustom').controller('prmAuthenticationAfterController', ['prmSearchService', function (prmSearchService) {
    var vm = this;
    // initialize custom service search
    var sv = prmSearchService;
    // check if a user login
    vm.$onChanges = function () {
        // This flag is return true or false
        var loginID = vm.parentCtrl.isLoggedIn;
        sv.setLogInID(loginID);
        sv.setAuth(vm.parentCtrl);
    };
}]);

angular.module('viewCustom').component('prmAuthenticationAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmAuthenticationAfterController'
});

/**
 * Created by samsan on 6/15/17.
 */

angular.module('viewCustom').controller('prmBackToSearchResultsButtonAfterController', ['$sce', 'angularLoad', '$window', 'prmSearchService', '$location', function ($sce, angularLoad, $window, prmSearchService, $location) {

    var vm = this;
    var sv = prmSearchService;
    vm.params = $location.search();

    // get items from custom single image component
    vm.$doCheck = function () {
        vm.photo = sv.getPhoto();
    };

    // go back to search result list
    vm.goToSearch = function () {
        var url = '/primo-explore/search?query=' + vm.params.q + '&vid=' + vm.parentCtrl.$stateParams.vid;
        url += '&sortby=' + vm.parentCtrl.$stateParams.sortby + '&lang=' + vm.parentCtrl.$stateParams.lang;
        url += '&=search_scope=' + vm.parentCtrl.$stateParams.search_scope;
        url += '&searchString=' + vm.params.searchString;
        if (vm.parentCtrl.$stateParams.tab) {
            url += '&tab=' + vm.parentCtrl.$stateParams.tab;
        }
        if (vm.params.facet) {
            if (Array.isArray(vm.params.facet)) {
                for (var i = 0; i < vm.params.facet.length; i++) {
                    url += '&facet=' + vm.params.facet[i];
                }
            } else {
                url += '&facet=' + vm.params.facet;
            }
        }
        if (vm.params.offset) {
            url += '&offset=' + vm.params.offset;
        }
        $window.location.href = url;
    };

    // go back to full display page of thumbnail images
    vm.goToImages = function () {
        var url = '/primo-explore/fulldisplay?docid=' + vm.parentCtrl.$stateParams.docid + '&q=' + vm.params.q + '&vid=' + vm.parentCtrl.$stateParams.vid;
        url += '&sortby=' + vm.parentCtrl.$stateParams.sortby + '&lang=' + vm.parentCtrl.$stateParams.lang;
        url += '&context=' + vm.parentCtrl.$stateParams.context + '&adaptor=' + vm.parentCtrl.$stateParams.adaptor;
        url += '&tab=' + vm.parentCtrl.$stateParams.tab + '&search_scope=' + vm.parentCtrl.$stateParams.search_scope;
        url += '&searchString=' + vm.params.searchString;
        if (vm.params.facet) {
            if (Array.isArray(vm.params.facet)) {
                for (var i = 0; i < vm.params.facet.length; i++) {
                    url += '&facet=' + vm.params.facet[i];
                }
            } else {
                url += '&facet=' + vm.params.facet;
            }
        }
        if (vm.params.offset) {
            url += '&offset=' + vm.params.offset;
        }
        $window.location.href = url;
    };
}]);

angular.module('viewCustom').component('prmBackToSearchResultsButtonAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmBackToSearchResultsButtonAfterController',
    controllerAs: 'vm',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/prm-back-to-search-results-button-after.html'
});

/**
 * Created by samsan on 6/13/17.
 */

angular.module('viewCustom').controller('prmBreadcrumbsAfterController', ['prmSearchService', function (prmSearchService) {
    var vm = this;
    // initialize custom service search
    var sv = prmSearchService;
    // get page object


    vm.$onChanges = function () {
        // capture user select facets
        sv.setFacets(vm.parentCtrl.selectedFacets);
        // reset the current page to beginning when a user select new facets
        var pageObj = sv.getPage();
        pageObj.currentPage = 1;
        sv.setPage(pageObj);
    };
}]);

angular.module('viewCustom').component('prmBreadcrumbsAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmBreadcrumbsAfterController'
});

/**
 * Created by samsan on 6/30/17.
 */
angular.module('viewCustom').controller('prmBriefResultContainerAfterController', ['$sce', function ($sce) {

    var vm = this;

    vm.$onChanges = function () {
        // hide IMAGE
        vm.parentCtrl.showItemType = false;
    };
}]);

angular.module('viewCustom').component('prmBriefResultContainerAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmBriefResultContainerAfterController'
});

/**
 * Created by samsan on 5/30/17.
 */

angular.module('viewCustom').controller('prmFacetAfterController', ['prmSearchService', '$location', function (prmSearchService, $location) {
    var vm = this;
    vm.params = $location.search();
    var sv = prmSearchService;
    // get page object
    var pageObj = sv.getPage();

    vm.$onChanges = function () {

        // if there is no facet, remove it from service
        if (!vm.parentCtrl.$stateParams.facet) {
            // reset facet if it is empty
            pageObj.currentPage = 1;
            sv.setPage(pageObj);
            sv.setFacets([]);
        }
    };
}]);

angular.module('viewCustom').component('prmFacetAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmFacetAfterController'
});

/**
 * Created by samsan on 7/7/17.
 * This component is for favorite section when a user pin his or her favorite image.
 */

angular.module('viewCustom').controller('prmFavoritesAfterController', ['prmSearchService', '$element', '$mdMedia', function (prmSearchService, $element, $mdMedia) {

    var sv = prmSearchService;
    var vm = this;
    vm.dataList = vm.parentCtrl;
    vm.flexSize = { 'col1': 80, 'col2': 20 }; // set up grid size for different screen

    // access ajax data from search component list of primo
    vm.$doCheck = function () {
        vm.dataList = vm.parentCtrl;
        vm.isFavorites = true;
        vm.isSearchHistory = true;
        vm.isSavedQuery = true;
        if (vm.dataList.favoritesService) {
            vm.savedQueryItems = vm.dataList.favoritesService.searchService.searchHistoryService.savedQueriesService.items;
            vm.historyItem = vm.dataList.favoritesService.searchService.searchHistoryService.items;
        }
    };

    vm.$onChanges = function () {
        // remove the above element
        var el = $element[0].parentNode.children[1].children[1].children[1];
        if (el) {
            el.remove();
        }
        if ($mdMedia('xs')) {
            vm.flexSize.col1 = 100;
            vm.flexSize.col2 = 100;
        }
    };
}]);

angular.module('viewCustom').component('prmFavoritesAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmFavoritesAfterController',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/prm-favorites-after.html'
});

/**
 * Created by samsan on 5/17/17.
 * This template is for direct access full view display link when a user send email to someone
 */
angular.module('viewCustom').controller('prmFullViewAfterController', ['$sce', 'prmSearchService', '$timeout', '$location', '$element', function ($sce, prmSearchService, $timeout, $location, $element) {

    var sv = prmSearchService;
    var vm = this;
    vm.item = vm.parentCtrl.item;
    vm.params = $location.search();
    vm.services = [];

    vm.showFullViewPage = function () {
        // remove virtual browse shelf and more link
        for (var i = 0; i < vm.parentCtrl.services.length; i++) {
            if (vm.parentCtrl.services[i].serviceName === 'virtualBrowse') {
                vm.parentCtrl.services.splice(i);
            } else if (vm.parentCtrl.services[i].scrollId === 'getit_link2') {
                vm.parentCtrl.services.splice(i);
            }
        }
    };

    vm.showSingImagePage = function () {
        // remove virtual browse shelf and more link
        var k = 0;
        for (var i = 0; i < vm.parentCtrl.services.length; i++) {
            if (vm.parentCtrl.services[i].serviceName === 'details') {
                vm.services[k] = vm.parentCtrl.services[i];
                k++;
            } else if (vm.parentCtrl.services[i].scrollId === 'getit_link1_0') {
                vm.services[k] = vm.parentCtrl.services[i];
                k++;
            }
        }

        for (var i = 0; i < vm.parentCtrl.services.length; i++) {
            vm.parentCtrl.services.splice(i);
        };
        sv.setData(vm);
    };

    vm.$onChanges = function () {
        if (!vm.parentCtrl.searchService.query) {
            vm.parentCtrl.searchService.query = vm.params.query;
            vm.parentCtrl.searchService.$stateParams.query = vm.params.query;
            vm.parentCtrl.mainSearchField = vm.params.searchString;
        }

        if (vm.item.pnx) {
            // when a user access full view detail page, it has no mis1Data so it need to convert xml to json data
            if (!vm.item.mis1Data) {
                var item = [];
                item[0] = vm.item;
                item = sv.convertData(item);
                vm.item = item[0];
            }

            // set data to build full display page
            var itemData = { 'item': '', 'searchData': '' };
            itemData.item = vm.item;
            if (vm.parentCtrl.searchService.cheetah.searchData) {
                // this data is available from over layer slide page
                itemData.searchData = vm.parentCtrl.searchService.cheetah.searchData;
            } else {
                // this data is available only from fulldisplay url
                itemData.searchData = vm.params;
                itemData.searchData.scope = vm.params.search_scope;
            }
            sv.setItem(itemData);
        }
    };

    vm.$onInit = function () {

        vm.params = $location.search();
        vm.showFullViewPage();
    };
}]);

angular.module('viewCustom').component('prmFullViewAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmFullViewAfterController',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/prm-full-view-after.html'
});

/**
 * Created by samsan on 6/8/17.
 * This component add customize logo and Hollis Images text
 */
angular.module('viewCustom').controller('prmLogoAfterController', ['$sce', '$element', function ($sce, $element) {

    var vm = this;

    vm.$onChanges = function () {
        // remove flex top bar and also remove tab menus
        var el = $element[0].parentNode.parentNode;
        el.children[2].remove();
        el.children[2].remove();

        // remove logo div
        var el2 = $element[0].parentNode;
        el2.children[0].remove();
    };
}]);

angular.module('viewCustom').component('prmLogoAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmLogoAfterController',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/prm-logo-after.html'
});

/**
 * Created by samsan on 5/22/17.
 * Access search box json data. Then change the number item per page. See prm-search-service.js file
 */
angular.module('viewCustom').controller('prmSearchBarAfterController', ['prmSearchService', '$location', function (prmSearchService, $location) {
    var vm = this;
    // initialize custom service search
    var sv = prmSearchService;
    // get page object
    var pageObj = sv.getPage();
    sv.removePageInfo();

    vm.$onChanges = function () {
        pageObj.currentPage = 1;
        pageObj.totalItems = 0;
        pageObj.totalPages = 0;
        pageObj.userClick = false;
        sv.setPage(pageObj);

        // show text in search box
        if (!vm.parentCtrl.mainSearchField) {
            var params = $location.search();
            if (params.searchString) {
                vm.parentCtrl.mainSearchField = params.searchString;
            }
        }
    };
}]);

angular.module('viewCustom').component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchBarAfterController',
    'template': '<div id="searchResultList"></div>'
});

// override the limit=10 when a user refresh page at search result list
angular.module('viewCustom').config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push(function () {
        return {
            'request': function request(config) {
                // override the default page size limit
                if (config.params) {
                    if (config.params.limit === 10) {
                        config.params.limit = 50;
                    }
                }
                if (config.method === 'POST' && config.url === '/primo_library/libweb/webservices/rest/v1/actions/email') {
                    // override request parameters if a user click on pagination
                    var pageObj = JSON.parse(window.localStorage.getItem('pageInfo'));

                    // add parameters to email link
                    var url = config.data.records[0].deeplink;
                    var urlStr = new URL(window.location.href);
                    var offset = 0;
                    if (urlStr.searchParams.get('offset')) {
                        offset = urlStr.searchParams.get('offset');
                    }
                    var searchString = '';
                    if (urlStr.searchParams.get('searchString')) {
                        searchString = urlStr.searchParams.get('searchString');
                    } else if (pageObj.searchString) {
                        searchString = pageObj.searchString;
                    }
                    var sortby = 'rank';
                    if (urlStr.searchParams.get('sortby')) {
                        sortby = urlStr.searchParams.get('sortby');
                    }
                    var q = '';
                    if (urlStr.searchParams.get('q')) {
                        q = urlStr.searchParams.get('q');
                    } else if (pageObj.query) {
                        q = pageObj.query;
                    }
                    // override the url parameter
                    if (pageObj.userClick) {
                        offset = pageObj.offset;
                        searchString = pageObj.searchString;
                        q = pageObj.query;
                    }
                    url += '&sortby=' + sortby + '&offset=' + offset + '&searchString=' + searchString + '&q=' + q;
                    config.data.records[0].deeplink = encodeURI(url);
                }
                return config;
            },

            'response': function response(_response) {
                return _response;
            }
        };
    });
}]);
/**
 * Created by samsan on 7/7/17.
 * This component is for pin favorite and search icon on the top right menu tab
 */

angular.module('viewCustom').controller('prmSearchBookmarkFilterAfterController', ['$sce', '$element', function ($sce, $element) {

    var vm = this;

    vm.$onChanges = function () {

        if (vm.parentCtrl.isFavorites) {
            // remove search magnify glass icon on the top left menu tab
            //var el=$element[0].parentNode.children;
            //el[0].remove();
        }
    };
}]);

angular.module('viewCustom').component('prmSearchBookmarkFilterAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchBookmarkFilterAfterController'
});

/**
 * Created by samsan on 7/10/17.
 */

angular.module('viewCustom').controller('prmSearchHistoryAfterController', ['prmSearchService', '$window', function (prmSearchService, $window) {

    var sv = prmSearchService;
    var vm = this;
    vm.itemlist = [];

    // open database connection, dbName=lf, dbVersion=2
    var db;
    var request = $window.indexedDB.open('lf', 2);
    request.onerror = function (err) {
        console.log('*** error ***');
        console.log(err);
    };

    request.onsuccess = function (e) {
        db = request.result;
        console.log('*** success ***');
        console.log(db);
    };

    // for update or create new record
    request.onupgradeneeded = function (e) {
        console.log('*** upgrade needed ****');
        console.log(e);
    };

    vm.$doCheck = function () {
        vm.itemlist = vm.parentCtrl.searchHistoryService.items;
        //console.log('*** prm-search-history-after ****');
        //console.log(vm);
    };

    vm.removeSearchHistoryItem = function (id) {
        //anonymous-0712_145554_SearchHistoryQeuriesKey

        var query = db.transaction(['keyvaluepairs'], "readwrite").objectStore('keyvaluepairs').get('anonymous-0712_145554_SearchHistoryQeuriesKey');

        console.log(query);

        query.onerror = function (err) {
            console.log('*** error ***');
            console.log(err);
        };

        query.onsuccess = function (e) {
            var result = query.result;
            console.log('* success result ***');
            console.log(result);
            console.log('*** id ***');
            console.log(id);
        };
    };
}]);

angular.module('viewCustom').component('prmSearchHistoryAfter2', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchHistoryAfterController',
    controllerAs: 'vm',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/prm-search-history-after.html'
});

/**
 * Created by samsan on 6/30/17.
 */

angular.module('viewCustom').controller('prmSearchResultAvailabilityAfterController', ['$element', '$timeout', function ($element, $timeout) {
    var vm = this;
    vm.$onChanges = function () {
        // remove  access online and icon
        $timeout(function () {
            var el = $element[0].parentNode.childNodes[1].children;
            if (el) {
                el[0].remove();
                el[0].remove();
            }
        }, 200);
    };
}]);

angular.module('viewCustom').component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchResultAvailabilityAfterController'
});

/* Author: Sam San
 This custom component is used for search result list which display all the images in thumbnail.
 */
angular.module('viewCustom').controller('prmSearchResultListAfterController', ['$sce', 'angularLoad', 'prmSearchService', '$window', '$timeout', '$mdDialog', '$element', '$mdMedia', function ($sce, angularLoad, prmSearchService, $window, $timeout, $mdDialog, $element, $mdMedia) {
    // local variables
    this.tooltip = { 'flag': [] };
    // show tooltip function when mouse over
    this.showTooltip = function (index) {
        this.tooltip.flag[index] = true;
    };
    // hide tooltip function when mouse out
    this.hideTooltip = function () {
        for (var i = 0; i < this.searchInfo.pageSize; i++) {
            this.tooltip.flag[i] = false;
        }
    };
    // call custom service from the injection
    var sv = prmSearchService;
    this.searchInfo = sv.getPage(); // get page info object

    var vm = this;
    vm.searchInProgress = true;
    vm.modalDialogFlag = false;
    vm.currentPage = 1;
    vm.flag = false;
    vm.searchData = {};
    vm.paginationNumber = 6;
    vm.flexSize = { 'size1': 20, 'size2': 80, 'class': 'spaceLeft15' };
    // set search result set per page, default 50 items per page

    // set up page counter
    vm.pageCounter = { 'min': 0, 'max': 0 };
    // calculate the page counter such as 1-50 of 1,232
    this.findPageCounter = function () {
        vm.pageCounter.min = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize + 1;

        if (vm.pageCounter.min > this.searchInfo.totalItems) {
            vm.pageCounter.min = this.searchInfo.totalItems;
        }
        vm.pageCounter.max = this.searchInfo.currentPage * this.searchInfo.pageSize;
        if (vm.pageCounter.max > this.searchInfo.totalItems) {
            vm.pageCounter.max = this.searchInfo.totalItems;
        }
    };

    // when a user click on next page or select new row from the drop down, it call this search function to get new data
    vm.ajaxSearch = function () {
        var facets = sv.getFacets();
        var facetsParam = '';
        this.searchInfo = sv.getPage();
        var limit = this.searchInfo.pageSize;
        var remainder = parseInt(this.searchInfo.totalItems) - parseInt(this.searchInfo.currentPage - 1) * parseInt(this.searchInfo.pageSize);

        if (remainder < this.searchInfo.pageSize) {
            limit = remainder;
        }

        var params = { 'addfields': [], 'offset': 0, 'limit': 10, 'lang': 'en_US', 'inst': 'HVD', 'getMore': 0, 'pcAvailability': true, 'q': '', 'rtaLinks': true,
            'sort': 'rank', 'tab': 'default_tab', 'vid': 'HVD_IMAGES', 'scope': 'default_scope', 'qExclude': '', 'qInclude': '', 'searchString': '' };
        params.addfields = vm.parentCtrl.searchService.cheetah.searchData.addfields;
        params.qExclude = vm.parentCtrl.searchService.cheetah.searchData.qExclude;
        params.getMore = vm.parentCtrl.searchService.cheetah.searchData.getMore;
        params.pcAvailability = vm.parentCtrl.searchService.cheetah.searchData.pcAvailability;
        params.limit = limit;
        params.q = vm.parentCtrl.$stateParams.query;
        params.lang = vm.parentCtrl.$stateParams.lang;
        params.vid = vm.parentCtrl.$stateParams.vid;
        params.sort = vm.parentCtrl.$stateParams.sortby;
        params.offset = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize;
        params.searchString = vm.parentCtrl.searchString;

        for (var i = 0; i < facets.length; i++) {
            facetsParam += 'facet_' + facets[i].name + ',' + facets[i].displayedType + ',' + facets[i].value + '|,|';
        }
        // remove the last string of [,]
        if (facetsParam.length > 5) {
            facetsParam = facetsParam.substring(0, facetsParam.length - 3);
        }
        params.qInclude = facetsParam;

        // start ajax loader progress bar
        vm.parentCtrl.searchService.searchStateService.searchObject.newSearch = true;
        vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress = true;
        vm.parentCtrl.searchService.searchStateService.searchObject.offset = params.offset;

        // get the current search rest url
        var url = vm.parentCtrl.briefResultService.restBaseURLs.pnxBaseURL;

        sv.getAjax(url, params, 'get').then(function (data) {
            var mydata = data.data;
            vm.items = sv.convertData(mydata.docs);
            // stop the ajax loader progress bar
            vm.parentCtrl.searchService.searchStateService.searchObject.newSearch = false;
            vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress = false;
            vm.searchInProgress = false;
        }, function (err) {
            console.log(err);
            vm.parentCtrl.searchService.searchStateService.searchObject.newSearch = false;
            vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress = false;
            vm.searchInProgress = false;
        });
    };

    // when a user click on next page or prev page, it call this function.
    this.pageChanged = function (currentPage) {
        // prevent calling ajax twice during refresh the page or click on facets
        if (!vm.flag) {
            this.searchInfo.currentPage = currentPage;
            this.searchInfo.userClick = true;
            this.searchInfo.offset = parseInt(currentPage - 1) * this.searchInfo.pageSize;
            this.searchInfo.searchString = vm.parentCtrl.searchString;
            this.searchInfo.query = vm.parentCtrl.$stateParams.query;
            sv.setPage(this.searchInfo); // keep track a user click on each current page
            // ajax call function
            if (vm.parentCtrl.isFavorites === false) {
                vm.ajaxSearch();
            }
            // calculate the min and max of items
            this.findPageCounter();
        }
        vm.flag = false;
    };

    vm.items = [];

    vm.$onInit = function () {
        var _this = this;

        if (vm.parentCtrl.isFavorites === false) {

            // remove left margin on result list grid
            var el = $element[0].parentNode.parentNode.parentNode;
            el.children[0].remove();

            this.searchInfo = sv.getPage(); // get page info object
            // watch for new data change when a user search

            vm.parentCtrl.$scope.$watch(function () {
                return vm.parentCtrl.searchResults;
            }, function (newVal, oldVal) {

                if (vm.parentCtrl.$stateParams.offset > 0) {
                    vm.currentPage = parseInt(vm.parentCtrl.$stateParams.offset / _this.searchInfo.pageSize) + 1;
                    _this.searchInfo.currentPage = parseInt(vm.parentCtrl.$stateParams.offset / _this.searchInfo.pageSize) + 1;
                } else {
                    vm.currentPage = 1;
                    _this.searchInfo.currentPage = 1;
                }
                vm.flag = true;
                // convert xml data into json data so it knows which image is a restricted image
                if (vm.parentCtrl.isFavorites === false && vm.parentCtrl.searchResults) {
                    vm.items = sv.convertData(vm.parentCtrl.searchResults);
                }
                // set up pagination
                _this.searchInfo.totalItems = vm.parentCtrl.totalItems;
                _this.searchInfo.totalPages = parseInt(vm.parentCtrl.totalItems / _this.searchInfo.pageSize);
                if (_this.searchInfo.pageSize * _this.searchInfo.totalPages < _this.searchInfo.totalItems) {
                    _this.searchInfo.totalPages++;
                }

                _this.findPageCounter();

                _this.searchInfo.query = vm.parentCtrl.$stateParams.query;
                _this.searchInfo.searchString = vm.parentCtrl.searchString;
                sv.setPage(_this.searchInfo);
                vm.searchInProgress = vm.parentCtrl.searchInProgress;
            });
        }
    };

    vm.$onChanges = function () {
        if (vm.parentCtrl.isFavorites === false) {
            vm.searchData = vm.parentCtrl.searchService.cheetah.searchData;
            if (vm.parentCtrl.searchString) {
                vm.searchData.searchString = vm.parentCtrl.searchString;
            }
        }
        // for small screen size
        if ($mdMedia('xs')) {
            vm.paginationNumber = 2;
            vm.flexSize.size1 = 100;
            vm.flexSize.size2 = 100;
            vm.flexSize.class = '';
        }

        console.log('*** prm-search-result-list-after *****');
        console.log(vm);
        // set data to pass into favorite list controller
        sv.setData(vm.parentCtrl);
    };

    vm.$doCheck = function () {
        vm.modalDialogFlag = sv.getDialogFlag();
    };

    this.closeDialog = function () {
        sv.setDialogFlag(false);
        $mdDialog.hide();
    };
}]);

// custom filter to remove $$U infront of url in pnx.links
angular.module('viewCustom').filter('urlFilter', function () {
    return function (url) {
        var newUrl = '';
        var pattern = /^(\$\$U)/;
        if (url) {
            newUrl = url[0];
            if (pattern.test(newUrl)) {
                newUrl = newUrl.substring(3, newUrl.length);
            }
        }

        return newUrl;
    };
});

// extract [6 images] from pnx.display.lds28 field
angular.module('viewCustom').filter('countFilter', function () {
    return function (qty) {
        var nums = '';
        var pattern = /[\[\]]+/g;
        if (qty) {
            nums = qty.replace(pattern, '');
        }

        return nums;
    };
});

/*http://dc03kg0084eu.hosted.exlibrisgroup.com:8991/pds*/

angular.module('viewCustom').component('prmSearchResultListAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchResultListAfterController',
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/prm-search-results.html'
});

/**
 * Created by samsan on 5/12/17.
 * This custom service use to inject to the controller.
 */

angular.module('viewCustom').service('prmSearchService', ['$http', '$window', '$filter', function ($http, $window, $filter) {
    var serviceObj = {};

    serviceObj.getBrowserType = function () {
        var userAgent = $window.navigator.userAgent;
        var browsers = { chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i };
        for (var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        };

        return '';
    };

    //http ajax service, pass in URL, parameters, method. The method can be get, post, put, delete
    serviceObj.getAjax = function (url, param, methodType) {
        return $http({
            'method': methodType,
            'url': url,
            'params': param
        });
    };

    serviceObj.postAjax = function (url, jsonObj) {
        return $http({
            'method': 'post',
            'url': url,
            'data': jsonObj
        });
    };

    // default page info
    serviceObj.page = { 'pageSize': 50, 'totalItems': 0, 'currentPage': 1, 'query': '', 'searchString': '', 'totalPages': 0, 'offset': 0, 'userClick': false };
    // getter for page info
    serviceObj.getPage = function () {
        // localStorage page info exist, just use the old one
        if ($window.localStorage.getItem('pageInfo')) {
            return JSON.parse($window.localStorage.getItem('pageInfo'));
        } else {
            return serviceObj.page;
        }
    };

    // setter for page info
    serviceObj.setPage = function (pageInfo) {
        // store page info on client browser by using html 5 local storage
        if ($window.localStorage.getItem('pageInfo')) {
            $window.localStorage.removeItem('pageInfo');
        }
        $window.localStorage.setItem('pageInfo', JSON.stringify(pageInfo));
        serviceObj.page = pageInfo;
    };

    // clear local storage
    serviceObj.removePageInfo = function () {
        if ($window.localStorage.getItem('pageInfo')) {
            $window.localStorage.removeItem('pageInfo');
        }
    };

    // replace & . It cause error in firefox;
    serviceObj.removeInvalidString = function (str) {
        var pattern = /[\&]/g;
        return str.replace(pattern, '&amp;');
    };

    //parse xml
    serviceObj.parseXml = function (str) {
        str = serviceObj.removeInvalidString(str);
        return xmlToJSON.parseString(str);
    };

    // maninpulate data and convert xml data to json
    serviceObj.convertData = function (data) {
        var newData = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            obj.restrictedImage = false;
            if (obj.pnx.addata.mis1) {
                if (obj.pnx.addata.mis1.length > 0) {
                    var jsonObj = serviceObj.getXMLdata(obj.pnx.addata.mis1[0]);
                    if (jsonObj.surrogate) {
                        for (var k = 0; k < jsonObj.surrogate.length; k++) {
                            if (jsonObj.surrogate[k].image) {
                                if (jsonObj.surrogate[k].image[0]._attr) {
                                    if (jsonObj.surrogate[k].image[0]._attr.restrictedImage._value) {
                                        obj.restrictedImage = true;
                                        k = jsonObj.surrogate.length;
                                    }
                                }
                            }
                        }
                    }
                    if (jsonObj.image) {
                        for (var k = 0; k < jsonObj.image.length; k++) {
                            if (jsonObj.image[k]._attr.restrictedImage) {
                                if (jsonObj.image[k]._attr.restrictedImage._value) {
                                    obj.restrictedImage = true;
                                    k = jsonObj.image.length;
                                }
                            }
                        }
                    }
                }
            }
            // remove the $$U infront of url
            if (obj.pnx.links.thumbnail) {
                var imgUrl = $filter('urlFilter')(obj.pnx.links.thumbnail);
                obj.pnx.links.thumbnail[0] = serviceObj.getHttps(imgUrl);
            }
            newData[i] = obj;
        }

        return newData;
    };

    // get user login ID
    serviceObj.logID = false;
    serviceObj.setLogInID = function (logID) {
        serviceObj.logID = logID;
    };

    serviceObj.getLogInID = function () {
        return serviceObj.logID;
    };

    // getter and setter for item data for view full detail page
    serviceObj.item = {};
    serviceObj.setItem = function (item) {
        serviceObj.item = item;
    };

    serviceObj.getItem = function () {
        return serviceObj.item;
    };

    // getter and setter for single image data
    serviceObj.data = {};
    serviceObj.setData = function (data) {
        serviceObj.data = data;
    };

    serviceObj.getData = function () {
        return serviceObj.data;
    };

    // getter and setter for selected facet
    serviceObj.facets = [];
    serviceObj.setFacets = function (data) {
        serviceObj.facets = data;
    };
    serviceObj.getFacets = function () {
        return serviceObj.facets;
    };

    // setter and getter for a single image
    serviceObj.photo = {};
    serviceObj.setPhoto = function (data) {
        serviceObj.photo = data;
    };
    serviceObj.getPhoto = function () {
        return serviceObj.photo;
    };

    // get user profile for authentication to login
    serviceObj.auth = {};
    serviceObj.setAuth = function (data) {
        serviceObj.auth = data;
    };
    serviceObj.getAuth = function () {
        return serviceObj.auth;
    };

    serviceObj.modalDialogFlag = false;
    serviceObj.setDialogFlag = function (flag) {
        serviceObj.modalDialogFlag = flag;
    };

    serviceObj.getDialogFlag = function () {
        return serviceObj.modalDialogFlag;
    };

    // replace http with https
    serviceObj.getHttps = function (url) {
        var pattern = /^(http:)/i;
        if (pattern.test(url)) {
            return url.replace(pattern, 'https:');
        } else {
            return url;
        }
    };

    // find image if it is jp2 or not
    serviceObj.findJP2 = function (itemData) {
        var flag = false;
        if (itemData.thumbnail) {
            var thumbnailUrl = itemData.thumbnail[0]._attr.href._value;
            var photoUrl = itemData._attr.href._value;
            var thumbnailList = thumbnailUrl.split(':');
            var thumbnailFlag = 0;
            if (thumbnailList.length > 0) {
                thumbnailFlag = thumbnailList[thumbnailList.length - 1];
            }
            var photoList = photoUrl.split(':');
            var photoFlag = 1;
            if (photoList.length > 0) {
                photoFlag = photoList[photoList.length - 1];
            }
            if (photoFlag === thumbnailFlag) {
                flag = true;
            }
        }
        return flag;
    };

    // convert xml data to json data by re-group them
    serviceObj.getXMLdata = function (str) {
        var xmldata = '';
        var listArray = [];
        if (str) {
            xmldata = serviceObj.parseXml(str);
            if (xmldata.work) {
                listArray = [];
                var work = xmldata.work[0];
                if (!work.surrogate && work.image) {
                    var data = work;
                    if (work.image.length === 1) {
                        listArray = data;
                    } else {
                        listArray = [];
                        var images = angular.copy(work.image);
                        delete work.image;
                        for (var i = 0; i < images.length; i++) {
                            data = angular.copy(work);
                            data.image = [];
                            data.image[0] = images[i];
                            listArray.push(data);
                        }
                    }
                } else if (work.surrogate && work.image) {
                    var data = {};
                    listArray = [];
                    var images = angular.copy(work.image);
                    var surrogate = angular.copy(work.surrogate);
                    delete work.image;
                    delete work.surrogate;
                    for (var i = 0; i < images.length; i++) {
                        data = angular.copy(work);
                        data.image = [];
                        data.image[0] = images[i];
                        listArray.push(data);
                    }

                    data = {};
                    for (var i = 0; i < surrogate.length; i++) {
                        data = surrogate[i];
                        if (surrogate[i].image) {
                            for (var j = 0; j < surrogate[i].image.length; j++) {
                                data = angular.copy(surrogate[i]);
                                if (surrogate[i].image[j]) {
                                    data.image = [];
                                    data.image[0] = surrogate[i].image[j];
                                    data.thumbnail = surrogate[i].image[j].thumbnail;
                                    data._attr = surrogate[i].image[j]._attr;
                                    data.caption = surrogate[i].image[j].caption;
                                }
                                listArray.push(data);
                            }
                        } else {
                            listArray.push(data);
                        }
                    }
                }

                if (work.subwork && !work.surrogate) {
                    listArray = [];
                    for (var i = 0; i < work.subwork.length; i++) {
                        var aSubwork = work.subwork[i];
                        if (aSubwork.surrogate) {
                            for (var j = 0; j < aSubwork.surrogate.length; j++) {
                                var data = aSubwork.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSubwork.image) {
                            for (var k = 0; k < aSubwork.image.length; k++) {
                                var data = aSubwork;
                                data.thumbnail = aSubwork.image[k].thumbnail;
                                data._attr = aSubwork.image[k]._attr;
                                data.caption = aSubwork.image[k].caption;
                                listArray.push(data);
                            }
                        }
                        if (!aSubwork.image && !aSubwork.surrogate) {
                            listArray.push(aSubwork);
                        }
                    }
                }
                if (work.subwork && work.surrogate) {
                    listArray = [];
                    for (var i = 0; i < work.subwork.length; i++) {
                        var aSubwork = work.subwork[i];
                        if (aSubwork.surrogate) {
                            for (var j = 0; j < aSubwork.surrogate.length; j++) {
                                var data = aSubwork.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSubwork.image) {
                            for (var k = 0; k < aSubwork.image.length; k++) {
                                var data = aSubwork;
                                data.thumbnail = aSubwork.image[k].thumbnail;
                                data._attr = aSubwork.image[k]._attr;
                                data.caption = aSubwork.image[k].caption;
                                listArray.push(data);
                            }
                        }
                    }
                    for (var w = 0; w < work.surrogate.length; w++) {
                        var aSurrogate = work.surrogate[w];
                        if (aSurrogate.surrogate) {
                            for (var j = 0; j < aSurrogate.surrogate.length; j++) {
                                var data = aSurrogate.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSurrogate.image) {
                            for (var k = 0; k < aSurrogate.image.length; k++) {
                                var data = aSurrogate;
                                data.thumbnail = aSurrogate.image[k].thumbnail;
                                data._attr = aSurrogate.image[k]._attr;
                                data.caption = aSurrogate.image[k].caption;
                                listArray.push(data);
                            }
                        }
                    }
                }
                if (work.surrogate && !work.subwork) {
                    listArray = [];
                    for (var w = 0; w < work.surrogate.length; w++) {
                        var aSurrogate = work.surrogate[w];
                        if (aSurrogate.surrogate) {
                            for (var j = 0; j < aSurrogate.surrogate.length; j++) {
                                var data = aSurrogate.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSurrogate.image) {
                            for (var k = 0; k < aSurrogate.image.length; k++) {
                                var data = angular.copy(aSurrogate);
                                data.image[0] = aSurrogate.image[k];
                                listArray.push(data);
                            }
                        }
                        if (!aSurrogate.image && !aSurrogate.surrogate) {
                            listArray.push(aSurrogate);
                        }
                    }
                }

                xmldata = work;
                if (listArray.length > 0) {
                    xmldata.surrogate = listArray;
                }

                /* end work section ***/
            } else if (xmldata.group) {
                listArray = [];
                xmldata = xmldata.group[0];
                if (xmldata.subwork && xmldata.surrogate) {
                    var listArray = [];
                    var subwork = xmldata.subwork;
                    var surrogate = xmldata.surrogate;
                    // get all the surrogate under subwork
                    for (var i = 0; i < subwork.length; i++) {
                        var aSubwork = subwork[i];
                        if (aSubwork.surrogate) {
                            for (var k = 0; k < aSubwork.surrogate.length; k++) {
                                var data = aSubwork.surrogate[k];
                                listArray.push(data);
                            }
                        }
                        if (aSubwork.image) {
                            for (var j = 0; j < aSubwork.image.length; j++) {
                                var data = aSubwork;
                                data.thumbnail = aSubwork.image[j].thumbnail;
                                data._attr = aSubwork.image[j]._attr;
                                data.caption = aSubwork.image[j].caption;
                                listArray.push(data);
                            }
                        }
                        if (!aSubwork.surrogate && !aSubwork.image) {
                            listArray.push(aSubwork);
                        }
                    }
                    // get all surrogate
                    for (var i = 0; i < surrogate.length; i++) {
                        var aSurrogate = surrogate[i];
                        if (aSurrogate.surrogate) {
                            for (var j = 0; j < aSurrogate.surrogate.length; j++) {
                                var data = aSurrogate.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSurrogate.image) {
                            for (var j = 0; j < aSurrogate.image.length; j++) {
                                var data = aSurrogate;
                                data.thumbnail = aSurrogate.image[j].thumbnail;
                                data._attr = aSurrogate.image[j]._attr;
                                data.caption = aSurrogate.image[j].caption;
                                listArray.push(data);
                            }
                        }
                        if (!aSurrogate.surrogate && !aSurrogate.image) {
                            listArray.push(aSurrogate);
                        }
                    }
                    xmldata.surrogate = listArray;
                } else if (xmldata.subwork && !xmldata.surrogate) {
                    // transfer subwork to surrogate
                    var surrogate = [];
                    listArray = [];
                    var subwork = angular.copy(xmldata.subwork);
                    delete xmldata.subwork;
                    for (var i = 0; i < subwork.length; i++) {
                        if (subwork[i].surrogate) {
                            surrogate = angular.copy(subwork[i].surrogate);
                            delete subwork[i].surrogate;
                            for (var k = 0; k < surrogate.length; k++) {
                                if (surrogate[k].image) {
                                    var images = angular.copy(surrogate[k].image);
                                    delete surrogate[k].image;
                                    for (var c = 0; c < images.length; c++) {
                                        var data = surrogate[k];
                                        data.image = [];
                                        data.image[0] = images[c];
                                        listArray.push(data);
                                    }
                                } else {
                                    listArray.push(surrogate[k]);
                                }
                            }
                        }
                        if (subwork[i].image) {
                            var images = angular.copy(subwork[i].image);
                            delete subwork[i].image;
                            for (var j = 0; j < images.length; j++) {
                                var data = subwork[i];
                                data.image = [];
                                data.image[0] = images[j];
                                listArray.push(data);
                            }
                        }
                    }

                    xmldata.surrogate = listArray;
                }
            }
        }
        return xmldata;
    };

    return serviceObj;
}]);

/**
 * Created by samsan on 6/29/17.
 */

angular.module('viewCustom').controller('prmTopbarAfterController', ['$element', function ($element) {

    var vm = this;
    vm.$onChanges = function () {
        // hide primo tab menu
        vm.parentCtrl.showMainMenu = false;
        // create new div for the top white menu
        var el = $element[0].parentNode.parentNode.parentNode.parentNode.parentNode;
        var div = document.createElement('div');
        div.setAttribute('id', 'customTopMenu');
        div.setAttribute('class', 'topMenu');
        el.prepend(div);
    };
}]);

angular.module('viewCustom').component('prmTopbarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmTopbarAfterController'
});

/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section
 */
angular.module('viewCustom').controller('prmViewOnlineAfterController', ['prmSearchService', '$mdDialog', '$timeout', '$window', '$location', function (prmSearchService, $mdDialog, $timeout, $window, $location) {

    var vm = this;
    var sv = prmSearchService;
    var itemData = sv.getItem();
    vm.item = itemData.item;
    vm.searchData = itemData.searchData;
    vm.params = $location.search();
    vm.zoomButtonFlag = true;
    vm.viewAllComponetMetadataFlag = false;
    vm.singleImageFlag = false;

    vm.$onChanges = function () {
        vm.isLoggedIn = sv.getLogInID();
        // get item data from service
        itemData = sv.getItem();
        vm.item = itemData.item;
        if (vm.item.pnx.addata) {
            var data = sv.getXMLdata(vm.item.pnx.addata.mis1[0]);
            if (data.surrogate) {
                vm.item.mis1Data = data.surrogate;
            } else if (data.image) {
                if (data.image.length === 1) {
                    vm.item.mis1Data = [];
                    vm.item.mis1Data.push(data);
                } else {
                    vm.item.mis1Data = data.image;
                }
            } else {
                vm.item.mis1Data = [];
                vm.item.mis1Data.push(data);
            }
        }
        vm.searchData = itemData.searchData;
        vm.searchData.sortby = vm.params.sortby;
        vm.pageInfo = sv.getPage();

        if (vm.isLoggedIn === false && vm.item.mis1Data) {
            if (vm.item.mis1Data.length === 1) {
                if (vm.item.mis1Data[0].image) {
                    if (vm.item.mis1Data[0].image[0]._attr.restrictedImage) {
                        if (vm.item.mis1Data[0].image[0]._attr.restrictedImage._value) {
                            vm.zoomButtonFlag = false;
                        }
                    }
                } else if (vm.item.mis1Data[0]._attr) {
                    if (vm.item.mis1Data[0]._attr.restrictedImage) {
                        if (vm.item.mis1Data[0]._attr.restrictedImage._value) {
                            vm.zoomButtonFlag = false;
                        }
                    }
                }
            }
        }
        if (vm.item.mis1Data) {
            if (vm.item.mis1Data.length == 1) {
                vm.singleImageFlag = true;
            } else {
                vm.viewAllComponetMetadataFlag = true;
            }
        } else {
            vm.singleImageFlag = true;
        }
    };

    // view all component metadata
    vm.viewAllComponentMetaData = function () {
        var url = '/primo-explore/viewallcomponentmetadata/' + vm.item.context + '/' + vm.item.pnx.control.recordid[0] + '?vid=' + vm.params.vid;
        url += '&tab=' + vm.params.tab + '&search_scope=' + vm.params.search_scope;
        url += '&lang=' + vm.params.lang;
        url += '&adaptor=' + vm.item.adaptor;
        $window.open(url, '_blank');
    };

    // show the pop up image
    vm.gotoFullPhoto = function ($event, item, index) {
        // go to full display page
        var url = '/primo-explore/viewcomponent/' + vm.item.context + '/' + vm.item.pnx.control.recordid[0] + '/' + index + '?vid=' + vm.searchData.vid + '&lang=' + vm.searchData.lang;
        if (vm.item.adaptor) {
            url += '&adaptor=' + vm.item.adaptor;
        } else {
            url += '&adaptor=' + (vm.searchData.adaptor ? vm.searchData.adaptor : '');
        }
        $window.open(url, '_blank');
    };
}]);

angular.module('viewCustom').config(function ($stateProvider) {
    $stateProvider.state('exploreMain.viewallcomponentdata', {
        url: '/viewallcomponentmetadata/:context/:docid',
        views: {
            '': {
                template: '<custom-view-all-component-metadata parent-ctrl="$ctrl"></custom-view-all-component-metadata>'
            }
        }
    }).state('exploreMain.viewcomponent', {
        url: '/viewcomponent/:context/:docid/:index',
        views: {
            '': {
                template: '<custom-view-component parent-ctrl="$ctrl" item="$ctrl.item" services="$ctrl.services" params="$ctrl.params"></custom-view-component>'
            }
        }
    });
}).component('prmViewOnlineAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmViewOnlineAfterController',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/prm-view-online-after.html'
});

/**
 * Created by samsan on 5/23/17.
 * If image width is greater than 600pixel, it will resize base on responsive css.
 * It use to show a single image on the page. If the image does not exist, it use icon_image.png
 */

angular.module('viewCustom').component('responsiveImage', {
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/responsiveImage.html',
    bindings: {
        src: '<',
        imgtitle: '<',
        restricted: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$window', '$location', 'prmSearchService', '$timeout', function ($element, $window, $location, prmSearchService, $timeout) {
        var vm = this;
        var sv = prmSearchService;
        // set up local scope variables
        vm.showImage = true;
        vm.params = $location.search();
        vm.localScope = { 'imgClass': '', 'loading': true, 'hideLockIcon': false };
        vm.isLoggedIn = sv.getLogInID();

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {

            vm.isLoggedIn = sv.getLogInID();
            if (vm.restricted && !vm.isLoggedIn) {
                vm.showImage = false;
            }
            vm.localScope = { 'imgClass': '', 'loading': true, 'hideLockIcon': false };
            if (vm.src && vm.showImage) {
                $timeout(function () {
                    var img = $element.find('img')[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if (pattern.test(vm.src)) {
                        img.src = '/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                    }
                    img.onload = vm.callback;
                    if (img.width > 50) {
                        vm.callback();
                    }
                }, 200);
            }

            vm.localScope.loading = false;
        };
        vm.callback = function () {
            var image = $element.find('img')[0];
            // resize the image if it is larger than 600 pixel
            if (image.width > 600) {
                vm.localScope.imgClass = 'responsiveImage';
                image.className = 'md-card-image ' + vm.localScope.imgClass;
            }

            // force to show lock icon
            if (vm.restricted) {
                vm.localScope.hideLockIcon = true;
            }
        };
        // login
        vm.signIn = function () {
            var auth = sv.getAuth();
            var params = { 'vid': '', 'targetURL': '' };
            params.vid = vm.params.vid;
            params.targetURL = $window.location.href;
            var url = '/primo-explore/login?from-new-ui=1&authenticationProfile=' + auth.authenticationMethods[0].profileName + '&search_scope=default_scope&tab=default_tab';
            url += '&Institute=' + auth.authenticationService.userSessionManagerService.userInstitution + '&vid=' + params.vid;
            if (vm.params.offset) {
                url += '&offset=' + vm.params.offset;
            }
            url += '&targetURL=' + encodeURIComponent(params.targetURL);
            $window.location.href = url;
        };
    }]
});

/**
 * Created by samsan on 5/23/17.
 * If image width is greater than 600pixel, it will resize base on responsive css.
 * It use to show a single image on the page. If the image does not exist, it use icon_image.png
 */

angular.module('viewCustom').component('singleImage', {
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/singleImage.html',
    bindings: {
        src: '<',
        imgtitle: '<',
        restricted: '<',
        jp2: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$window', '$location', 'prmSearchService', '$timeout', '$sce', function ($element, $window, $location, prmSearchService, $timeout, $sce) {
        var vm = this;
        var sv = prmSearchService;
        // set up local scope variables
        vm.imageUrl = '';
        vm.showImage = true;
        vm.params = $location.search();
        vm.localScope = { 'imgClass': '', 'loading': true, 'hideLockIcon': false };
        vm.isLoggedIn = sv.getLogInID();

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {

            vm.isLoggedIn = sv.getLogInID();
            if (vm.restricted && !vm.isLoggedIn) {
                vm.showImage = false;
            }
            vm.localScope = { 'imgClass': '', 'loading': true, 'hideLockIcon': false };
            if (vm.src && vm.showImage) {
                if (vm.jp2 === true) {
                    var url = sv.getHttps(vm.src) + '?buttons=Y';
                    vm.imageUrl = $sce.trustAsResourceUrl(url);
                } else {
                    vm.imageUrl = vm.src;
                    $timeout(function () {
                        var img = $element.find('img')[0];
                        // use default image if it is a broken link image
                        var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                        if (pattern.test(vm.src)) {
                            img.src = '/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                        }
                        img.onload = vm.callback;
                        if (img.width > 600) {
                            vm.callback();
                        }
                    }, 300);
                }
            } else {
                vm.imageUrl = '';
            }

            vm.localScope.loading = false;
        };

        vm.callback = function () {
            var image = $element.find('img')[0];
            // resize the image if it is larger than 600 pixel
            if (image.width > 600) {
                vm.localScope.imgClass = 'responsiveImage';
                image.className = 'md-card-image ' + vm.localScope.imgClass;
            }

            // force to show lock icon
            if (vm.restricted) {
                vm.localScope.hideLockIcon = true;
            }
        };

        // login
        vm.signIn = function () {
            var auth = sv.getAuth();
            var params = { 'vid': '', 'targetURL': '' };
            params.vid = vm.params.vid;
            params.targetURL = $window.location.href;
            var url = '/primo-explore/login?from-new-ui=1&authenticationProfile=' + auth.authenticationMethods[0].profileName + '&search_scope=default_scope&tab=default_tab';
            url += '&Institute=' + auth.authenticationService.userSessionManagerService.userInstitution + '&vid=' + params.vid;
            if (vm.params.offset) {
                url += '&offset=' + vm.params.offset;
            }
            url += '&targetURL=' + encodeURIComponent(params.targetURL);
            $window.location.href = url;
        };
    }]
});

/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom').component('thumbnail', {
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/thumbnail.html',
    bindings: {
        dataitem: '<',
        searchdata: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$timeout', '$window', '$mdDialog', 'prmSearchService', '$location', function ($element, $timeout, $window, $mdDialog, prmSearchService, $location) {
        var vm = this;
        var sv = prmSearchService;
        vm.localScope = { 'imgclass': '', 'hideLockIcon': false, 'showImageLabel': false };
        vm.modalDialogFlag = false;
        vm.imageUrl = '/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
        vm.linkUrl = '';
        vm.params = $location.search();

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {

            vm.localScope = { 'imgclass': '', 'hideLockIcon': false, 'showImageLabel': false };
            if (vm.dataitem.pnx.links.thumbnail) {
                vm.imageUrl = sv.getHttps(vm.dataitem.pnx.links.thumbnail[0]);
                $timeout(function () {
                    var img = $element.find('img')[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if (pattern.test(vm.dataitem.pnx.links.thumbnail[0])) {
                        img.src = '/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                    }
                    img.onload = vm.callback;

                    if (img.clientWidth > 50) {
                        vm.callback();
                    }
                }, 300);
            }

            var vid = 'HVD_IMAGES';
            var searchString = '';
            var q = '';
            var sort = 'rank';
            var offset = 0;
            var tab = '';
            var scope = '';
            if (vm.searchdata) {
                vid = vm.searchdata.vid;
                searchString = vm.searchdata.searchString;
                q = vm.searchdata.q;
                sort = vm.searchdata.sort;
                offset = vm.searchdata.offset;
                tab = vm.searchdata.tab;
                scope = vm.searchdata.scope;
            } else if (vm.params) {
                vid = vm.params.vid;
            }

            vm.linkUrl = '/primo-explore/fulldisplay?vid=' + vid + '&docid=' + vm.dataitem.pnx.control.recordid[0] + '&sortby=' + sort;
            vm.linkUrl += '&q=' + q + '&searchString=' + searchString + '&offset=' + offset;
            vm.linkUrl += '&tab=' + tab + '&search_scope=' + scope;
            if (vm.params.facet) {
                if (Array.isArray(vm.params.facet)) {
                    for (var i = 0; i < vm.params.facet.length; i++) {
                        vm.linkUrl += '&facet=' + vm.params.facet[i];
                    }
                } else {
                    vm.linkUrl += '&facet=' + vm.params.facet;
                }
            }

            // context menu
            var context = $element.find('a');
            context.bind('contextmenu', function (e) {

                //e.preventDefault();
                return false;
            });
        };

        vm.$doCheck = function () {
            vm.modalDialogFlag = sv.getDialogFlag();
        };

        vm.callback = function () {
            // show lock icon
            if (vm.dataitem.restrictedImage) {
                vm.localScope.hideLockIcon = true;
            }
            // show image label number on the top right corner
            if (vm.dataitem.pnx.display.lds20[0] > 1) {
                vm.localScope.showImageLabel = true;
            }
            // find the width and height of image after it is rendering
            var image = $element.find('img')[0];
            if (image.height > 150 && image.width < 185) {
                vm.localScope.imgclass = 'responsivePhoto';
                image.className = 'md-card-image ' + vm.localScope.imgclass;
            } else if (image.height > 150 && image.width > 185) {
                vm.localScope.imgclass = 'responsivePhoto2';
                image.className = 'md-card-image ' + vm.localScope.imgclass;
            } else if (image.width > 185) {
                vm.localScope.imgclass = 'responsivePhoto3';
                image.className = 'md-card-image ' + vm.localScope.imgclass;
            }

            // line up the image label on the top of the image
            var divs = $element[0].children[0].children[0].children[0];
            if (divs) {
                var margin = (185 - image.clientWidth) / 2;
                var leftMargin = margin + image.clientWidth - 20 + 'px';
                divs.style.marginLeft = leftMargin;
            }
        };

        vm.openWindow = function () {
            var url = '/primo-explore/fulldisplay?vid=HVD_IMAGES&docid=' + vm.dataitem.pnx.control.recordid[0];
            $window.open(url, '_blank');
        };

        // open modal dialog when click on thumbnail image
        vm.openDialog = function ($event) {
            // set data to build full display page
            var itemData = { 'item': '', 'searchData': '' };
            itemData.item = vm.dataitem;
            itemData.searchData = vm.searchdata;
            sv.setItem(itemData);

            // modal dialog pop up here
            $mdDialog.show({
                title: 'Full View Details',
                target: $event,
                clickOutsideToClose: true,
                focusOnOpen: true,
                escapeToClose: true,
                bindToController: true,
                templateUrl: '/primo-explore/custom/HVD_IMAGES/html/custom-full-view-dialog.html',
                controller: 'customFullViewDialogController',
                controllerAs: 'vm',
                fullscreen: true,
                multiple: false,
                openFrom: { left: 0 },
                locals: {
                    items: itemData
                },
                onComplete: function onComplete(scope, element) {
                    sv.setDialogFlag(true);
                },
                onRemoving: function onRemoving(element, removePromise) {
                    sv.setDialogFlag(false);
                }
            });
            return false;
        };

        // When a user press enter by using tab key
        vm.openDialog2 = function (e) {
            if (e.which === 13 || e.which === 1) {
                vm.openDialog(e);
            }
        };
    }]
});

// truncate word to limit 60 characters
angular.module('viewCustom').filter('truncatefilter', function () {
    return function (str) {
        var newstr = str;
        var index = 45;
        if (str) {
            if (str.length > 45) {
                newstr = str.substring(0, 45);
                for (var i = newstr.length; i > 20; i--) {
                    var text = newstr.substring(i - 1, i);
                    if (text === ' ') {
                        index = i;
                        i = 20;
                    }
                }
                newstr = str.substring(0, index) + '...';
            }
        }

        return newstr;
    };
});

/* Copyright 2015 William Summers, MetaTribal LLC
 * adapted from https://developer.mozilla.org/en-US/docs/JXON
 *
 * Licensed under the MIT License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @author William Summers
 *
 */

var xmlToJSON = function () {

    this.version = "1.3";

    var options = { // set up the default options
        mergeCDATA: true, // extract cdata and merge with text
        grokAttr: true, // convert truthy attributes to boolean, etc
        grokText: true, // convert truthy text/attr to boolean, etc
        normalize: true, // collapse multiple spaces to single space
        xmlns: true, // include namespaces as attribute in output
        namespaceKey: '_ns', // tag name for namespace objects
        textKey: '_text', // tag name for text nodes
        valueKey: '_value', // tag name for attribute values
        attrKey: '_attr', // tag for attr groups
        cdataKey: '_cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
        attrsAsObject: true, // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
        stripAttrPrefix: true, // remove namespace prefixes from attributes
        stripElemPrefix: true, // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
        childrenAsArray: true // force children into arrays
    };

    var prefixMatch = new RegExp(/(?!xmlns)^.*:/);
    var trimMatch = new RegExp(/^\s+|\s+$/g);

    this.grokType = function (sValue) {
        if (/^\s*$/.test(sValue)) {
            return null;
        }
        if (/^(?:true|false)$/i.test(sValue)) {
            return sValue.toLowerCase() === "true";
        }
        if (isFinite(sValue)) {
            return parseFloat(sValue);
        }
        return sValue;
    };

    this.parseString = function (xmlString, opt) {
        return this.parseXML(this.stringToXML(xmlString), opt);
    };

    this.parseXML = function (oXMLParent, opt) {

        // initialize options
        for (var key in opt) {
            options[key] = opt[key];
        }

        var vResult = {},
            nLength = 0,
            sCollectedTxt = "";

        // parse namespace information
        if (options.xmlns && oXMLParent.namespaceURI) {
            vResult[options.namespaceKey] = oXMLParent.namespaceURI;
        }

        // parse attributes
        // using attributes property instead of hasAttributes method to support older browsers
        if (oXMLParent.attributes && oXMLParent.attributes.length > 0) {
            var vAttribs = {};

            for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
                var oAttrib = oXMLParent.attributes.item(nLength);
                vContent = {};
                var attribName = '';

                if (options.stripAttrPrefix) {
                    attribName = oAttrib.name.replace(prefixMatch, '');
                } else {
                    attribName = oAttrib.name;
                }

                if (options.grokAttr) {
                    vContent[options.valueKey] = this.grokType(oAttrib.value.replace(trimMatch, ''));
                } else {
                    vContent[options.valueKey] = oAttrib.value.replace(trimMatch, '');
                }

                if (options.xmlns && oAttrib.namespaceURI) {
                    vContent[options.namespaceKey] = oAttrib.namespaceURI;
                }

                if (options.attrsAsObject) {
                    // attributes with same local name must enable prefixes
                    vAttribs[attribName] = vContent;
                } else {
                    vResult[options.attrKey + attribName] = vContent;
                }
            }

            if (options.attrsAsObject) {
                vResult[options.attrKey] = vAttribs;
            } else {}
        }

        // iterate over the children
        if (oXMLParent.hasChildNodes()) {
            for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
                oNode = oXMLParent.childNodes.item(nItem);

                if (oNode.nodeType === 4) {
                    if (options.mergeCDATA) {
                        sCollectedTxt += oNode.nodeValue;
                    } else {
                        if (vResult.hasOwnProperty(options.cdataKey)) {
                            if (vResult[options.cdataKey].constructor !== Array) {
                                vResult[options.cdataKey] = [vResult[options.cdataKey]];
                            }
                            vResult[options.cdataKey].push(oNode.nodeValue);
                        } else {
                            if (options.childrenAsArray) {
                                vResult[options.cdataKey] = [];
                                vResult[options.cdataKey].push(oNode.nodeValue);
                            } else {
                                vResult[options.cdataKey] = oNode.nodeValue;
                            }
                        }
                    }
                } /* nodeType is "CDATASection" (4) */
                else if (oNode.nodeType === 3) {
                        sCollectedTxt += oNode.nodeValue;
                    } /* nodeType is "Text" (3) */
                    else if (oNode.nodeType === 1) {
                            /* nodeType is "Element" (1) */

                            if (nLength === 0) {
                                vResult = {};
                            }

                            // using nodeName to support browser (IE) implementation with no 'localName' property
                            if (options.stripElemPrefix) {
                                sProp = oNode.nodeName.replace(prefixMatch, '');
                            } else {
                                sProp = oNode.nodeName;
                            }

                            vContent = xmlToJSON.parseXML(oNode);

                            if (vResult.hasOwnProperty(sProp)) {
                                if (vResult[sProp].constructor !== Array) {
                                    vResult[sProp] = [vResult[sProp]];
                                }
                                vResult[sProp].push(vContent);
                            } else {
                                if (options.childrenAsArray) {
                                    vResult[sProp] = [];
                                    vResult[sProp].push(vContent);
                                } else {
                                    vResult[sProp] = vContent;
                                }
                                nLength++;
                            }
                        }
            }
        } else if (!sCollectedTxt) {
            // no children and no text, return null
            if (options.childrenAsArray) {
                vResult[options.textKey] = [];
                vResult[options.textKey].push(null);
            } else {
                vResult[options.textKey] = null;
            }
        }

        if (sCollectedTxt) {
            if (options.grokText) {
                var value = this.grokType(sCollectedTxt.replace(trimMatch, ''));
                if (value !== null && value !== undefined) {
                    vResult[options.textKey] = value;
                }
            } else if (options.normalize) {
                vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '').replace(/\s+/g, " ");
            } else {
                vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '');
            }
        }

        return vResult;
    };

    // Convert xmlDocument to a string
    // Returns null on failure
    this.xmlToString = function (xmlDoc) {
        try {
            var xmlString = xmlDoc.xml ? xmlDoc.xml : new XMLSerializer().serializeToString(xmlDoc);
            return xmlString;
        } catch (err) {
            return null;
        }
    };

    // Convert a string to XML Node Structure
    // Returns null on failure
    this.stringToXML = function (xmlString) {
        try {
            var xmlDoc = null;

            if (window.DOMParser) {

                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(xmlString, "text/xml");

                return xmlDoc;
            } else {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlString);

                return xmlDoc;
            }
        } catch (e) {
            return null;
        }
    };

    return this;
}.call({});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = xmlToJSON;else if (typeof define === "function" && define.amd) define(function () {
    return xmlToJSON;
});
})();