/* Author: Sam San
 This custom component is used for search result list which display all the images in thumbnail.
 */
angular.module('viewCustom')
    .controller('prmSearchResultListAfterController', [ '$sce', 'angularLoad','prmSearchService','$window','$timeout','$mdDialog', function ($sce, angularLoad, prmSearchService, $window, $timeout, $mdDialog) {
    // local variables
    this.tooltip = {'flag':[]};
    // show tooltip function when mouse over
    this.showTooltip=function (index) {
        this.tooltip.flag[index]=true;
    };
    // hide tooltip function when mouse out
    this.hideTooltip=function () {
      for(let i=0; i < this.searchInfo.pageSize; i++) {
          this.tooltip.flag[i] = false;
      }
    };
    // call custom service from the injection
    let sv=prmSearchService;
    this.searchInfo = sv.getPage(); // get page info object

    let vm = this;
    vm.searchInProgress=true;
    vm.modalDialogFlag=false;
    // set search result set per page, default 50 items per page
    vm.parentCtrl.searchService.searchStateService.resultsBulkSize=this.searchInfo.pageSize;

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
    this.search=function () {
       this.searchInfo=sv.getPage();
       var limit=this.searchInfo.pageSize;
       var remainder = this.searchInfo.totalItems - ((this.searchInfo.currentPage - 1) * this.searchInfo.pageSize);
       if(remainder < this.searchInfo.pageSize) {
           limit=remainder;
       }
       var params={'addfields':[],'offset':0,'limit':10,'lang':'en_US','inst':'HVD','getMore':0,'pcAvailability':true,'q':'','rtaLinks':true,
       'sortby':'rank','tab':'default_tab','vid':'HVD_IMAGES','scope':'default_scope','qExclude':'','qInclude':''};
       params.limit=limit;
       params.q=vm.parentCtrl.$stateParams.query;
       params.lang=vm.parentCtrl.$stateParams.lang;
       params.vid=vm.parentCtrl.$stateParams.vid;
       params.sortby=vm.parentCtrl.$stateParams.sortby;
       params.currentPage = this.searchInfo.currentPage;
       params.offset = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize;
       params.bulkSize = this.searchInfo.pageSize;
       params.to = this.searchInfo.pageSize * this.searchInfo.currentPage;
       params.facet = vm.parentCtrl.$stateParams.facet;
       params.newSearch = true;
       params.searchInProgress = true;
       //params.addfields='vertitle,title,collection,creator,contributor,subject,ispartof,description,relation,publisher,creationdate,format,language,identifier,citation,source';
        
       vm.parentCtrl.currentPage = params.currentPage;
       vm.parentCtrl.$stateParams.offset = params.offset;

       // start ajax loader progress bar
       vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=true;
       vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=true;
       vm.parentCtrl.searchService.searchStateService.searchObject.offset=params.offset;
       vm.parentCtrl.searchService.searchStateService.resultsBulkSize=this.searchInfo.pageSize;

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
                console.log('*** ajax vm.items ***');
                console.log(vm.items);
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
        this.searchInfo.currentPage = currentPage;
        sv.setPage(this.searchInfo); // keep track a user click on each current page
        // ajax call function
        this.search();
        // calculate the min and max of items
        this.findPageCounter();
    };

    vm.items=[];
    // this trigger when the page refresh or access for the first time
    if(vm.parentCtrl.searchResults) {
        // convert xml data into json data so it know which image is a restricted image
        vm.items = sv.convertData(vm.parentCtrl.searchResults);
        // set up pagination
        this.searchInfo.totalItems = vm.parentCtrl.totalItems;
        this.searchInfo.totalPages = parseInt(this.searchInfo.totalItems / this.searchInfo.pageSize);
        if((this.searchInfo.totalPages * this.searchInfo.pageSize) < this.totalItems) {
            this.searchInfo.totalPages++;
        }
        // calculate pagination
        this.findPageCounter();
        // store search term so it can pass into ajax call when a user click on next page or prev page
        this.searchInfo.query = vm.parentCtrl.$stateParams.query;
        this.searchInfo.searchString = vm.parentCtrl.searchString;
        sv.setPage(this.searchInfo);
        vm.searchInProgress=vm.parentCtrl.searchInProgress;
    }


    vm.$onInit = function () {
        this.searchInfo = sv.getPage(); // get page info object
        vm.parentCtrl.searchService.searchStateService.resultsBulkSize=this.searchInfo.pageSize;
        vm.parentCtrl.PAGE_SIZE=this.searchInfo.pageSize;

        // if a user enter new search term, it reset the pagination to beginning
        vm.parentCtrl.$scope.$watch(()=>vm.parentCtrl.searchString,(newVal, oldVal)=>{
            if(vm.parentCtrl.searchString !== this.searchInfo.searchString){
                this.searchInfo.totalItems = 0;
                this.searchInfo.currentPage = 1;
                this.searchInfo.totalPages = 0;
                sv.setPage(this.searchInfo);
            }
        });


        // watch the search result when a user is not refresh the page
        vm.parentCtrl.$scope.$watch(()=>vm.parentCtrl.searchResults, (newVal, oldVal)=>{
            // set up pagination
            this.searchInfo.totalItems = vm.parentCtrl.totalItems;
            this.searchInfo.totalPages = parseInt(vm.parentCtrl.totalItems / vm.parentCtrl.searchService.searchStateService.resultsBulkSize);
            if((vm.parentCtrl.searchService.searchStateService.resultsBulkSize * this.searchInfo.totalPages) < this.searchInfo.totalItems) {
                this.searchInfo.totalPages++;
            }
            // convert xml data into json data so it knows which image is a restricted image
            vm.items = sv.convertData(newVal);

            console.log('*** vm.parentCtrl ***');
            console.log(vm.parentCtrl);

            console.log('*** newVal ***');
            console.log(newVal);

            console.log('*** oldVal ***');
            console.log(oldVal);


            this.findPageCounter();

            this.searchInfo.query = vm.parentCtrl.$stateParams.query;
            this.searchInfo.searchString = vm.parentCtrl.searchString;
            sv.setPage(this.searchInfo);
            vm.searchInProgress=vm.parentCtrl.searchInProgress;

        });

    };


    // open modal dialog when click on thumbnail image
    this.openDialog=function ($event,item) {
        // get user login status, true for login, false for not login
        let logID=sv.getLogInID();
        sv.setItem(item);

        vm.parentCtrl.searchService.searchStateService.resultsBulkSize=this.searchInfo.pageSize;

        if(item.restrictedImage && logID===false) {
            // if image is restricted and user is not login, trigger click event on user login button through dom
            var doc=document.getElementsByClassName('user-menu-button')[0];
            $timeout(function (e) {
                doc.click();
                var prmTag=document.getElementsByTagName('prm-authentication')[1];
                var button = prmTag.getElementsByTagName('button');
                button[0].click();
            },500);
        } else {
           // modal dialog pop up here
            $mdDialog.show({
                title:'Full View Details',
                target:$event,
                clickOutsideToClose: true,
                escapeToClose: true,
                bindToController:true,
                templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-full-view-dialog.html',
                controller:'customFullViewDialogController',
                controllerAs:'vm',
                fullscreen:true,
                multiple:true,
                locals: {
                    items:item
                },
                onComplete:function (scope, element) {
                    vm.modalDialogFlag=true;
                },
                onRemoving:function (element,removePromise) {
                    vm.modalDialogFlag=false;
                }
            });

        }
    };

    // When a user press enter by using tab key
    this.openDialog2=function(e,item){
        if(e.which===13){
            this.openDialog(e,item);
        }
    };
    // close modal dialog of view full display
    this.closeDialog=function () {
        vm.modalDialogFlag=false;
        $mdDialog.hide();
    };

    this.closeDialog2=function(e) {
        if(e.which===13) {
            vm.modalDialogFlag = false;
            $mdDialog.hide();
        }
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
    bindings: {parentCtrl: '='},
    controller: 'prmSearchResultListAfterController',
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/prm-search-results.html'
});

