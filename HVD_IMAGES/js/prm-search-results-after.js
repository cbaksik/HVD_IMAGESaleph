angular.module('viewCustom')
    .controller('prmSearchResultListAfterController', [ '$sce', 'angularLoad','prmSearchService','$window', function ($sce, angularLoad, prmSearchService, $window) {
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

    let sv=prmSearchService;
    this.searchInfo = sv.getPage(); // get page info object

    let vm = this;
    vm.parentCtrl.searchService.searchStateService.resultsBulkSize=this.searchInfo.pageSize;

    // set up page counter
    vm.pageCounter = {'min':0,'max':0};
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
       var params={'addfields':[],'offset':0,'limit':10,'lang':'en_US','inst':'HVD','getMore':0,'pcAvailability':true,'q':'','rtaLinks':true,
       'sortby':'rank','tab':'default_tab','vid':'HVD_IMAGES','scope':'default_scope','qExclude':'','qInclude':''};
       params.limit=this.searchInfo.pageSize;
       params.q=vm.parentCtrl.$stateParams.query;
       params.lang=vm.parentCtrl.$stateParams.lang;
       params.vid=vm.parentCtrl.$stateParams.vid;
       params.sortby=vm.parentCtrl.$stateParams.sortby;
       params.currentPage = this.searchInfo.currentPage;
       params.offset = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize;
       params.bulkSize = this.searchInfo.pageSize;
       params.to = this.searchInfo.pageSize * this.searchInfo.currentPage;
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
                vm.items=sv.covertData( mydata.docs);

                console.log('*** vm.items ***');
                console.log(vm.items);

                console.log('*** data from ajax call ***');
                console.log(mydata);

                // stop the ajax loader progress bar
                vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
                vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
               },
            function (err) {
               console.log(err);
               vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
               vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
            }
           )
    };

    // when a user click on next page or prev page, it call this function.
    this.pageChanged=function (currentPage) {
        this.searchInfo.currentPage = currentPage;
        sv.setPage(this.searchInfo); // keep track a user click on each current page
        this.search();
        this.findPageCounter();
    };

    vm.items = [];


    vm.$onInit = function () {
        this.searchInfo = sv.getPage(); // get page info object
        vm.parentCtrl.searchService.searchStateService.resultsBulkSize=this.searchInfo.pageSize;
        //vm.parentCtrl.PAGE_SIZE=this.searchInfo.pageSize;

        vm.parentCtrl.$scope.$watch(()=>vm.parentCtrl.searchString,(newVal, oldVal)=>{
            if(vm.parentCtrl.searchString !== this.searchInfo.searchString){
                this.searchInfo.totalItems = 0;
                this.searchInfo.currentPage = 1;
            }
        });

        vm.parentCtrl.$scope.$watch(()=>vm.parentCtrl.searchResults, (newVal, oldVal)=>{

            this.searchInfo.totalItems = vm.parentCtrl.totalItems;
            this.searchInfo.totalPages = parseInt(vm.parentCtrl.totalItems / vm.parentCtrl.searchService.searchStateService.resultsBulkSize);
            if((vm.parentCtrl.searchService.searchStateService.resultsBulkSize * this.searchInfo.totalPages) < this.searchInfo.totalItems) {
                this.searchInfo.totalPages++;
            }

            if(vm.parentCtrl.currentPage===this.searchInfo.currentPage && vm.parentCtrl.itemsPerPage === this.searchInfo.pageSize && this.searchInfo.query==='' && newVal) {
                vm.items = sv.covertData(newVal);
            } else if(vm.parentCtrl.currentPage===this.searchInfo.currentPage && vm.parentCtrl.itemsPerPage === this.searchInfo.pageSize && this.searchInfo.query === vm.parentCtrl.$stateParams.query && newVal) {
                vm.items = sv.covertData(newVal);
            } else {
                this.search();
            }


            console.log('*** vm.parentCtrl ***');
            console.log(vm.parentCtrl);

            console.log('*** newVal ***');
            console.log(newVal);


            this.findPageCounter();

            this.searchInfo.query = vm.parentCtrl.$stateParams.query;
            this.searchInfo.searchString = vm.parentCtrl.searchString;
            sv.setPage(this.searchInfo);

        });
    };


    this.openDialog=function (item) {
        let logID=sv.getLogInID();

        console.log(logID);
        console.log(item.restrictedImage);

        vm.parentCtrl.PAGE_SIZE=this.searchInfo.pageSize;
        vm.parentCtrl.currentPage=this.searchInfo.currentPage;
        vm.parentCtrl.searchInfo.maxTotal = this.searchInfo.pageSize;
        vm.parentCtrl.searchService.searchStateService.resultsBulkSize=this.searchInfo.pageSize;

        let offset = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize;
        let url='/primo-explore/fulldisplay?docid='+item.pnx.control.recordid[0]+'&adaptor='+
        item.adaptor+'&context='+item.context+'&lang='+vm.parentCtrl.$stateParams.lang+'&query='+vm.parentCtrl.$stateParams.query+
        '&sortby='+vm.parentCtrl.$stateParams.sortby+'&tab='+vm.parentCtrl.$stateParams.tab+'&search_scope='+vm.parentCtrl.$stateParams.search_scope+
        '&offset='+offset+'&vid='+vm.parentCtrl.$stateParams.vid +'&limit='+this.searchInfo.pageSize+'&currentPage='+this.searchInfo.currentPage +'&itemsPerPage='+this.searchInfo.pageSize;

        if(item.restrictedImage && logID===false) {
            url='https://www.pin1.harvard.edu/cas/login?service=https://hollis.harvard.edu/pds?func=load-login&calling_system=primo&institute=HVD&lang=eng&url=https://qa.hollis.harvard.edu:443/primo_library/libweb/pdsLogin?targetURL=http://localhost:8003/primo-explore/search?vid=HVD_IMAGES&sortby=rank&lang=en%255FUS&from-new-ui=1&authenticationProfile=Profile+1';
            $window.location.href = url;
        } else {
           $window.location.href = url;
        }
    };

    // When a user press enter by using tab key
    this.openDialog2=function(e,item){
        if(e.which===13){
            this.openDialog(item);
        }
    }

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

