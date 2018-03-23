/* Author: Sam San
 This custom component is used for search result list which display all the images in thumbnail.
 */
angular.module('viewCustom')
    .controller('prmSearchResultListAfterController', [ '$sce', 'angularLoad','prmSearchService','$window','$timeout','$mdDialog','$element','$mdMedia', function ($sce, angularLoad, prmSearchService, $window, $timeout, $mdDialog,$element, $mdMedia) {

    // call custom service from the injection
    let sv=prmSearchService;
    this.searchInfo = sv.getPage(); // get page info object

    let vm = this;
    vm.searchInProgress=true;
    vm.modalDialogFlag=false;
    vm.currentPage=1;
    vm.flag=false;
    vm.searchData={};
    vm.paginationNumber=6;
    vm.flexSize={'size1':20,'size2':80,'class':'spaceLeft15'};
    // set search result set per page, default 50 items per page

    // set up page counter
    vm.pageCounter = {'min':0,'max':0};
    // calculate the page counter such as 1-50 of 1,232
    this.findPageCounter=function () {
      vm.pageCounter.min = ((this.searchInfo.currentPage - 1) * this.searchInfo.pageSize) + 1;

      if(vm.pageCounter.min > this.searchInfo.totalItems) {
          vm.pageCounter.min = this.searchInfo.totalItems;
      }
      vm.pageCounter.max = this.searchInfo.currentPage * this.searchInfo.pageSize;
      if(vm.pageCounter.max > this.searchInfo.totalItems) {
          vm.pageCounter.max = this.searchInfo.totalItems;
      }

    };


    // when a user click on next page or select new row from the drop down, it call this search function to get new data
    vm.ajaxSearch=function () {

       this.searchInfo=sv.getPage();
       var limit=this.searchInfo.pageSize;
       var remainder = parseInt(this.searchInfo.totalItems) - (parseInt(this.searchInfo.currentPage - 1) * parseInt(this.searchInfo.pageSize));

       if(remainder < this.searchInfo.pageSize) {
           limit=remainder;
       }

       var params={'addfields':[],'offset':0,'limit':10,'lang':'en_US','inst':'HVD','getMore':0,'pcAvailability':true,'q':'','rtaLinks':true,
       'sort':'rank','tab':'default_tab','vid':'HVD_IMAGES','scope':'default_scope','qExclude':'','qInclude':'','searchString':'','mode':'','multiFacets':''};

       params.limit=limit;
       params.offset = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize;

        if(vm.parentCtrl.searchService.cheetah.searchData) {
            params.q = vm.parentCtrl.searchService.cheetah.searchData.q;
            params.searchString = vm.parentCtrl.searchService.cheetah.searchData.searchString;
            params.mode = vm.parentCtrl.searchService.cheetah.searchData.mode;
            params.lang = vm.parentCtrl.searchService.cheetah.searchData.lang;
            params.sort = vm.parentCtrl.searchService.cheetah.searchData.sort;
            params.tab = vm.parentCtrl.searchService.cheetah.searchData.tab;
            params.scope = vm.parentCtrl.searchService.cheetah.searchData.scope;
            params.inst = vm.parentCtrl.searchService.cheetah.searchData.inst;
            params.vid = vm.parentCtrl.searchService.cheetah.searchData.vid;
            params.qInclude = vm.parentCtrl.searchService.cheetah.searchData.qInclude;
            params.qExclude=vm.parentCtrl.searchService.cheetah.searchData.qExclude;
            params.getMore=vm.parentCtrl.searchService.cheetah.searchData.getMore;
            params.pcAvailability=vm.parentCtrl.searchService.cheetah.searchData.pcAvailability;
            params.addfields=vm.parentCtrl.searchService.cheetah.searchData.addfields;
        }

        // multiFacets
        if(vm.parentCtrl.searchService.cheetah.searchData.multiFacets) {
            params.multiFacets = vm.parentCtrl.searchService.cheetah.searchData.multiFacets.toString();
        }


       // start ajax loader progress bar
       vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=true;
       vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=true;
       vm.parentCtrl.searchService.searchStateService.searchObject.offset=params.offset;

       // get the current search rest url
       let url = vm.parentCtrl.briefResultService.restBaseURLs.pnxBaseURL;

       sv.getAjax(url,params,'get')
           .then(function (data) {
                let mydata = data.data;
                vm.items=sv.convertData( mydata.docs);
                // stop the ajax loader progress bar
                vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
                vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
                vm.searchInProgress=false;
               },
            function (err) {
               console.log(err);
               vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
               vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
               vm.searchInProgress=false;
            }
           )

    };

    // when a user click on next page or prev page, it call this function.
    this.pageChanged=function (currentPage) {
        // prevent calling ajax twice during refresh the page or click on facets
        if(!vm.flag) {
            this.searchInfo.currentPage = currentPage;
            this.searchInfo.userClick=true;
            this.searchInfo.offset=parseInt(currentPage - 1) * this.searchInfo.pageSize;
            this.searchInfo.searchString=vm.parentCtrl.searchString;
            this.searchInfo.query=vm.parentCtrl.$stateParams.query;
            sv.setPage(this.searchInfo); // keep track a user click on each current page
            // ajax call function
            if(vm.parentCtrl.isFavorites===false) {
                vm.ajaxSearch();
            }
            // calculate the min and max of items
            this.findPageCounter();
        }
        vm.flag=false;
    };

    vm.items=[];

    vm.$onInit = function () {
        if(vm.parentCtrl.isFavorites===false) {

            // remove left margin on result list grid
            var el = $element[0].parentNode.parentNode.parentNode;
            el.children[0].remove();

            // remove prm-result-list display item if the favorite page is false
            var parentNode=$element[0].parentNode.children[0];
            parentNode.remove();

            this.searchInfo = sv.getPage(); // get page info object
            // watch for new data change when a user search

            vm.parentCtrl.$scope.$watch(() => vm.parentCtrl.searchResults, (newVal, oldVal) => {

                if (vm.parentCtrl.$stateParams.offset > 0) {
                    vm.currentPage = parseInt(vm.parentCtrl.$stateParams.offset / this.searchInfo.pageSize) + 1;
                    this.searchInfo.currentPage = parseInt(vm.parentCtrl.$stateParams.offset / this.searchInfo.pageSize) + 1;
                } else {
                    vm.currentPage = 1;
                    this.searchInfo.currentPage = 1;
                }
                vm.flag = true;
                // convert xml data into json data so it knows which image is a restricted image
                if (vm.parentCtrl.isFavorites === false && vm.parentCtrl.searchResults) {
                    vm.items = sv.convertData(vm.parentCtrl.searchResults);
                }
                // set up pagination
                this.searchInfo.totalItems = vm.parentCtrl.totalItems;
                this.searchInfo.totalPages = parseInt(vm.parentCtrl.totalItems / this.searchInfo.pageSize);
                if ((this.searchInfo.pageSize * this.searchInfo.totalPages) < this.searchInfo.totalItems) {
                    this.searchInfo.totalPages++;
                }

                this.findPageCounter();

                this.searchInfo.query = vm.parentCtrl.$stateParams.query;
                this.searchInfo.searchString = vm.parentCtrl.searchString;
                sv.setPage(this.searchInfo);
                vm.searchInProgress = vm.parentCtrl.searchInProgress;

            });

        }

    };

    vm.$onChanges=function() {
        if(vm.parentCtrl.isFavorites===false) {
            vm.searchData = vm.parentCtrl.searchService.cheetah.searchData;
            if (vm.parentCtrl.searchString) {
                vm.searchData.searchString = vm.parentCtrl.searchString;
            }
        }
        // for small screen size
        if($mdMedia('xs')) {
            vm.paginationNumber=2;
            vm.flexSize.size1=100;
            vm.flexSize.size2=100;
            vm.flexSize.class='';
        } else if($mdMedia('sm')) {
            vm.paginationNumber=4;
        }

        // set data to pass into favorite list controller
        sv.setData(vm.parentCtrl);

    };

    vm.$doCheck=function() {
        vm.modalDialogFlag=sv.getDialogFlag();
    };

    this.closeDialog=function () {
        sv.setDialogFlag(false);
        $mdDialog.hide();
    };


}]);

// custom filter to remove $$U infront of url in pnx.links
angular.module('viewCustom').filter('urlFilter',function () {
    return function (url) {
        var newUrl='';
        var pattern=/^(\$\$U)/;
        if(url){
            newUrl=url[0];
            if(pattern.test(newUrl)){
                newUrl = newUrl.substring(3,newUrl.length);
            }
        }

        return newUrl;
    }

});

// extract [6 images] from pnx.display.lds28 field
angular.module('viewCustom').filter('countFilter',function () {
    return function (qty) {
        var nums='';
        var pattern=/[\[\]]+/g;
        if(qty){
            nums=qty.replace(pattern,'');
        }

        return nums;
    }

});

/*http://dc03kg0084eu.hosted.exlibrisgroup.com:8991/pds*/

angular.module('viewCustom')
    .component('prmSearchResultListAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'prmSearchResultListAfterController',
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/prm-search-results.html'
});

