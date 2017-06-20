(function(){
"use strict";
'use strict';

angular.module('viewCustom', ['angularLoad', 'cl.paging']);

/**
 * Created by samsan on 5/17/17.
 * A custom modal dialog when a user click on thumbnail on search result list page
 */
angular.module('viewCustom').controller('customFullViewDialogController', ['$sce', 'angularLoad', 'items', '$mdDialog', 'prmSearchService', function ($sce, angularLoad, items, $mdDialog, prmSearchService) {
    // local variables
    var vm = this;
    var sv = prmSearchService;
    vm.item = items.item;
    vm.searchData = items.searchData;

    sv.setItem(items);

    console.log('**** vm custom full view dialog controller *****');
    console.log(vm);

    vm.closeDialog = function () {
        $mdDialog.hide();
    };
}]);

/**
 * Created by samsan on 6/9/17.
 * This component is for a single image full display when a user click on thumbnail from a full display page
 */

angular.module('viewCustom').controller('customSingleImageController', ['$sce', 'angularLoad', '$window', '$mdMedia', 'prmSearchService', function ($sce, angularLoad, $window, $mdMedia, prmSearchService) {

    var vm = this;
    var sv = prmSearchService;
    vm.photo = {};
    vm.flexsize = 70;
    var index = vm.params.index;

    vm.$onChanges = function () {

        // if the smaller screen size, make the flex size to 100.
        if ($mdMedia('sm')) {
            vm.flexsize = 100;
        } else if ($mdMedia('xs')) {
            vm.flexsize = 100;
        }

        // if there is index and singleimage in parameter, then execute this statement.
        if (vm.params.index && vm.params.singleimage) {
            // the xml has different format nodes
            if (vm.item.mis1Data) {
                if (vm.item.mis1Data.length === 1) {
                    vm.photo = vm.item.mis1Data[0].image[index];
                } else if (vm.item.mis1Data.length > 1) {
                    vm.photo = vm.item.mis1Data[index].image[0];
                }
                // pass this data to use in prm-back-to-search-result-button-after
                sv.setPhoto(vm.item);
            }
            // hide previous page
            var doc = document.getElementById('fullView');
            var div = doc.getElementsByClassName('full-view-inner-container');
            div[0].style.display = 'none';
        }
    };

    // when a user click on breadcrumbs navigator
    vm.goBack = function () {
        $window.location.href = vm.breadcrumbs.url;
    };
}]);

angular.module('viewCustom').component('customSingleImage', {
    bindings: { item: '<', services: '<', params: '<' },
    controller: 'customSingleImageController',
    controllerAs: 'vm',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/custom-single-image.html'
});

/**
 * Created by samsan on 6/5/17.
 * A modal dialog pop up the image when a user click on thumbnail image in view full detail page
 */

angular.module('viewCustom').controller('customViewImageDialogController', ['$sce', 'angularLoad', 'items', '$mdDialog', function ($sce, angularLoad, items, $mdDialog) {
    // local variables
    var vm = this;
    vm.item = items;

    console.log('*** single image ***');
    console.log(items);

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
 * Created by samsan on 5/25/17.
 */

angular.module('viewCustom').controller('prmAuthenticationAfterController', ['angularLoad', 'prmSearchService', function (angularLoad, prmSearchService) {
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

    console.log('*** prm back to search result button after ***');
    console.log(vm);

    // get items from custom single image component
    vm.$doCheck = function () {
        vm.photo = sv.getPhoto();
    };

    // go back to search result list
    vm.goToSearch = function () {
        var url = '/primo-explore/search?query=' + vm.params.q + '&vid=' + vm.parentCtrl.$stateParams.vid;
        url += '&sortby=' + vm.parentCtrl.$stateParams.sortby + '&lang=' + vm.parentCtrl.$stateParams.lang;
        url += '&tab=' + vm.parentCtrl.$stateParams.tab + '&=search_scope=' + vm.parentCtrl.$stateParams.search_scope;
        url += '&searchString=' + vm.params.searchString;
        if (vm.params.facet) {
            url += '&facet=' + vm.params.facet;
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
            url += '&facet=' + vm.params.facet;
        }
        if (vm.params.offset) {
            url += '&offset=' + vm.params.offset;
        }
        $window.location.href = url;
    };
}]);

angular.module('viewCustom').component('prmBackToSearchResultsButtonAfter', {
    bindings: { parentCtrl: '=' },
    controller: 'prmBackToSearchResultsButtonAfterController',
    controllerAs: 'vm',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/prm-back-to-search-results-button-after.html'
});

/**
 * Created by samsan on 6/13/17.
 */

angular.module('viewCustom').controller('prmBreadcrumbsAfterController', ['angularLoad', 'prmSearchService', function (angularLoad, prmSearchService) {
    var vm = this;
    // initialize custom service search
    var sv = prmSearchService;
    // get page object


    vm.$onChanges = function () {
        console.log('*** prm breadcrumbs after ***');
        console.log(vm);

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
 * Created by samsan on 5/30/17.
 */

angular.module('viewCustom').controller('prmFacetAfterController', ['angularLoad', 'prmSearchService', '$location', function (angularLoad, prmSearchService, $location) {
    var vm = this;
    vm.params = $location.search();
    var sv = prmSearchService;
    // get page object
    var pageObj = sv.getPage();

    vm.$onChanges = function () {
        console.log('*** prm facet after ****');
        console.log(vm);
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
 * Created by samsan on 5/17/17.
 * This template is for direct access full view display link when a user send email to someone
 */
angular.module('viewCustom').controller('prmFullViewAfterController', ['$sce', 'angularLoad', 'prmSearchService', '$timeout', '$location', function ($sce, angularLoad, prmSearchService, $timeout, $location) {

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

        console.log('*** prm-full-view-after ***');
        console.log(vm);

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
        // remove virtual browse shelf and more link
        if (vm.params.singleimage && vm.params.index) {
            vm.showSingImagePage();
        } else {
            vm.showFullViewPage();
        }
    };
}]);

angular.module('viewCustom').component('prmFullViewAfter', {
    bindings: { parentCtrl: '=' },
    controller: 'prmFullViewAfterController',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/prm-full-view-after.html'
});

/**
 * Created by samsan on 6/8/17.
 * This component add customize logo and Hollis Images text
 */
angular.module('viewCustom').controller('prmLogoAfterController', ['$sce', 'angularLoad', function ($sce, angularLoad) {

    var vm = this;

    vm.$onChanges = function () {
        // override the logo on top left corner
        vm.parentCtrl.iconLink = 'custom/HVD_IMAGES/img/library-logo-small.png';
    };
}]);

angular.module('viewCustom').component('prmLogoAfter', {
    bindings: { parentCtrl: '=' },
    controller: 'prmLogoAfterController',
    'templateUrl': '/primo-explore/custom/HVD_IMAGES/html/prm-logo-after.html'
});

/**
 * Created by samsan on 5/22/17.
 * Access search box json data. Then change the number item per page. See prm-search-service.js file
 */
angular.module('viewCustom').controller('prmSearchBarAfterController', ['angularLoad', 'prmSearchService', '$location', function (angularLoad, prmSearchService, $location) {
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
    bindings: { parentCtrl: '=' },
    controller: 'prmSearchBarAfterController',
    'template': '<div id="searchResultList"></div>'
});

// override the limit=10 when a user refresh page at search result list
angular.module('viewCustom').config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push(function () {
        return {
            'request': function request(config) {
                if (config.params) {
                    if (config.params.limit === 10) {
                        config.params.limit = 50;
                    }
                }
                if (config.method === 'POST' && config.url === '/primo_library/libweb/webservices/rest/v1/actions/email') {
                    console.log(config.data.records[0].deeplink);
                    config.data.records[0].deeplink = window.location.href;
                    console.log('*** config.params ***');
                    console.log(config);
                }
                return config;
            },

            'response': function response(_response) {
                return _response;
            }
        };
    });
}]);
/* Author: Sam San
 This custom component is used for search result list which display all the images in thumbnail.
 */
angular.module('viewCustom').controller('prmSearchResultListAfterController', ['$sce', 'angularLoad', 'prmSearchService', '$window', '$timeout', '$mdDialog', function ($sce, angularLoad, prmSearchService, $window, $timeout, $mdDialog) {
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

        console.log('*** vm ****');
        console.log(vm);

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

        console.log('*** params ***');
        console.log(params);

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
            sv.setPage(this.searchInfo); // keep track a user click on each current page
            // ajax call function
            vm.ajaxSearch();
            // calculate the min and max of items
            this.findPageCounter();
        }
        vm.flag = false;
    };

    vm.items = [];

    vm.$onInit = function () {
        var _this = this;

        this.searchInfo = sv.getPage(); // get page info object
        // watch for new data change when a user search
        vm.parentCtrl.$scope.$watch(function () {
            return vm.parentCtrl.searchResults;
        }, function (newVal, oldVal) {

            console.log('*** prm search result after ***');
            console.log(vm.parentCtrl);
            if (vm.parentCtrl.$stateParams.offset > 0) {
                vm.currentPage = parseInt(vm.parentCtrl.$stateParams.offset / _this.searchInfo.pageSize) + 1;
                _this.searchInfo.currentPage = parseInt(vm.parentCtrl.$stateParams.offset / _this.searchInfo.pageSize) + 1;
            } else {
                vm.currentPage = 1;
                _this.searchInfo.currentPage = 1;
            }
            vm.flag = true;
            // convert xml data into json data so it knows which image is a restricted image
            vm.items = sv.convertData(vm.parentCtrl.searchResults);

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
    };

    // open modal dialog when click on thumbnail image
    this.openDialog = function ($event, item) {
        // get user login status, true for login, false for not login
        var logID = sv.getLogInID();
        vm.parentCtrl.searchService.searchStateService.resultsBulkSize = this.searchInfo.pageSize;

        // set data to build full display page
        var itemData = { 'item': '', 'searchData': '' };
        itemData.item = item;
        itemData.searchData = vm.parentCtrl.searchService.cheetah.searchData;
        itemData.searchData.searchString = vm.parentCtrl.searchString;
        sv.setItem(itemData);

        // modal dialog pop up here
        $mdDialog.show({
            title: 'Full View Details',
            target: $event,
            clickOutsideToClose: true,
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
                vm.modalDialogFlag = true;
            },
            onRemoving: function onRemoving(element, removePromise) {
                vm.modalDialogFlag = false;
            }
        });
    };

    // When a user press enter by using tab key
    this.openDialog2 = function (e, item) {
        if (e.which === 13) {
            this.openDialog(e, item);
        }
    };
    // close modal dialog of view full display
    this.closeDialog = function () {
        vm.modalDialogFlag = false;
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

    // default page info
    serviceObj.page = { 'pageSize': 50, 'totalItems': 0, 'currentPage': 1, 'query': '', 'searchString': '', 'totalPages': 0, 'userClick': false };
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
            if (obj.pnx.addata.mis1.length > 0) {
                var xml = obj.pnx.addata.mis1[0];
                var jsonData = serviceObj.parseXml(xml);
                if (jsonData.work) {
                    // it has a single image
                    if (jsonData.work[0].surrogate) {
                        obj.mis1Data = jsonData.work[0].surrogate;
                        if (obj.mis1Data.length === 1) {
                            if (obj.mis1Data[0].image) {
                                obj.restrictedImage = obj.mis1Data[0].image[0]._attr.restrictedImage._value;
                            }
                        } else {
                            for (var j = 0; j < obj.mis1Data.length; j++) {
                                if (obj.mis1Data[j].image) {
                                    if (obj.mis1Data[j].image[0]._attr.restrictedImage) {
                                        obj.restrictedImage = true;
                                    }
                                }
                            }
                        }
                    } else if (jsonData.work.length == 1) {
                        obj.mis1Data = jsonData.work;
                        if (obj.mis1Data[0].image) {
                            obj.restrictedImage = obj.mis1Data[0].image[0]._attr.restrictedImage._value;
                        }
                    } else {
                        obj.mis1Data = jsonData.work;
                        if (obj.mis1Data) {
                            for (var c = 0; c < obj.mis1Data.length; c++) {
                                if (obj.mis1Data[c].image) {
                                    obj.restrictedImage = obj.mis1Data[c].image[0]._attr.restrictedImage;
                                }
                            }
                        }
                    }
                } else if (jsonData.group) {
                    // it has multiple images
                    obj.mis1Data = jsonData.group[0].subwork;
                    if (obj.mis1Data) {
                        for (var k = 0; k < obj.mis1Data.length; k++) {
                            if (obj.mis1Data[k].image) {
                                obj.restrictedImage = obj.mis1Data[k].image[0]._attr.restrictedImage._value;
                            }
                        }
                    }
                }
            }
            // remove the $$U infront of url
            if (obj.pnx.links.thumbnail) {
                var imgUrl = $filter('urlFilter')(obj.pnx.links.thumbnail);
                obj.pnx.links.thumbnail[0] = imgUrl;
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

    return serviceObj;
}]);

/**
 * Created by samsan on 6/20/17.
 */

angular.module('viewCustom').controller('prmSendEmailAfterController', ['$sce', 'angularLoad', function ($sce, angularLoad) {

    var vm = this;

    vm.$onChanges = function () {
        console.log('** prm send email after ***');
        console.log(vm);
    };
}]);

angular.module('viewCustom').component('prmSendEmailAfter', {
    bindings: { parentCtrl: '=' },
    controller: 'prmSendEmailAfterController'
});

/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section
 */
angular.module('viewCustom').controller('prmViewOnlineAfterController', ['$sce', 'angularLoad', 'prmSearchService', '$mdDialog', '$timeout', '$window', '$location', function ($sce, angularLoad, prmSearchService, $mdDialog, $timeout, $window, $location) {

    var vm = this;
    var sv = prmSearchService;
    var itemData = sv.getItem();
    vm.item = itemData.item;
    vm.searchData = itemData.searchData;
    vm.params = $location.search();

    vm.$onChanges = function () {
        // get item data from service
        itemData = sv.getItem();
        vm.item = itemData.item;
        vm.searchData = itemData.searchData;
        vm.searchData.sortby = vm.params.sortby;
        vm.pageInfo = sv.getPage();

        console.log('*** prm view online after ***');
        console.log(vm);
    };

    // show the pop up image
    vm.gotoFullPhoto = function ($event, item, index) {
        // go to full display page
        var url = '/primo-explore/fulldisplay?docid=' + vm.item.pnx.control.recordid[0] + '&vid=' + vm.searchData.vid + '&context=' + vm.item.context + '&lang=' + vm.searchData.lang;
        if (vm.item.adaptor) {
            url += '&adaptor=' + vm.item.adaptor;
        } else {
            url += '&adaptor=' + vm.searchData.adaptor;
        }
        if (vm.searchData.searchString) {
            url += '&searchString=' + vm.searchData.searchString;
        } else {
            url += '&searchString=';
        }
        url += '&sortby=' + vm.searchData.sortby;
        url += '&q=' + vm.searchData.q + '&tab=' + vm.searchData.tab;
        url += '&search_scope=' + vm.searchData.scope + '&singleimage=true&index=' + index;
        if (vm.params.facet) {
            url += '&facet=' + vm.params.facet;
        }
        var offset = vm.params.offset;
        if (vm.pageInfo.userClick) {
            offset = parseInt(vm.pageInfo.currentPage - 1) * vm.pageInfo.pageSize;
        }

        url += '&offset=' + offset;
        $window.location.href = url;
    };
}]);

angular.module('viewCustom').component('prmViewOnlineAfter', {
    bindings: { parentCtrl: '=' },
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
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom').component('thumbnail', {
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/thumbnail.html',
    bindings: {
        src: '<',
        imgtitle: '<',
        restricted: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$timeout', function ($element, $timeout) {
        var vm = this;
        vm.localScope = { 'imgclass': '', 'hideLockIcon': false, 'hideTooltip': false };

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {
            vm.localScope = { 'imgclass': '', 'hideLockIcon': false, 'hideTooltip': false };
            if (vm.src) {
                $timeout(function () {
                    var img = $element.find('img')[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if (pattern.test(vm.src)) {
                        img.src = '/primo-explore/custom/HVD_IMAGES/img/icon_image.png';
                    }
                    img.onload = vm.callback;
                    // show lock up icon
                    if (vm.restricted) {
                        vm.localScope.hideLockIcon = true;
                    }
                }, 200);
            }
        };
        vm.callback = function () {
            var image = $element.find('img')[0];
            if (image.height > 150) {
                vm.localScope.imgclass = 'responsivePhoto';
                image.className = 'md-card-image ' + vm.localScope.imgclass;
            }
        };

        vm.showToolTip = function (e) {
            vm.localScope.hideTooltip = true;
        };

        vm.hideToolTip = function (e) {
            vm.localScope.hideTooltip = false;
        };
    }]
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