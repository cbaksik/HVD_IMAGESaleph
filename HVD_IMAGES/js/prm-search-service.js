/**
 * Created by samsan on 5/12/17.
 */

angular.module('viewCustom')
    .service('prmSearchService',['$http','$window','$filter',function ($http, $window, $filter) {
    let serviceObj={};

    //http ajax service, pass in URL, parameters, method. The method can be get, post, put, delete
    serviceObj.getAjax=function (url,param,methodType) {
      return $http({
          'method':methodType,
          'url':url,
          'params':param
      })
    };

    // default page info
    serviceObj.page = {'pageSize':50,'totalItems':0,'currentPage':1,'query':'','searchString':'','totalPages':0};
    // getter for page info
    serviceObj.getPage=function () {
       // localStorage page info exist, just use the old one
       if($window.localStorage.getItem('pageInfo')) {
           return JSON.parse($window.localStorage.getItem('pageInfo'));
       }  else {
           return serviceObj.page;
       }
    };

    // setter for page info
    serviceObj.setPage=function (pageInfo) {
        // store page info on client browser by using html 5 local storage
        if($window.localStorage.getItem('pageInfo')) {
            $window.localStorage.removeItem('pageInfo');
        }
        $window.localStorage.setItem('pageInfo',JSON.stringify(pageInfo));
        serviceObj.page=pageInfo;
    };

    // clear local storage
    serviceObj.removePageInfo=function () {
      if($window.localStorage.getItem('pageInfo')) {
          $window.localStorage.removeItem('pageInfo');
      }
    };

    // replace & . It cause error in firefox;
    serviceObj.removeInvalidString=function (str) {
        var pattern=/[\&]/;
        return str.replace(pattern,'');
    };

    //parse xml
    serviceObj.parseXml=function (str) {
        str=serviceObj.removeInvalidString(str);
        return xmlToJSON.parseString(str);
    };

    // maninpulate data and convert xml data to json
    serviceObj.convertData=function (data) {
       var newData=[];
       for(var i=0; i < data.length; i++){
           var obj=data[i];
           obj.restrictedImage=false;

           if(obj.pnx.addata.mis1.length > 0) {
               var xml = obj.pnx.addata.mis1[0];
               var jsonData = serviceObj.parseXml(xml);
               if (jsonData.work) {
                   // it has a single image
                   obj.mis1Data = jsonData.work[0];
                   if (jsonData.work[0].surrogate) {
                       if(jsonData.work[0].surrogate[0].image) {
                           obj.restrictedImage = jsonData.work[0].surrogate[0].image[0]._attr.restrictedImage._value;
                       }
                   } else if(jsonData.work[0].image) {
                       obj.restrictedImage = jsonData.work[0].image[0]._attr.restrictedImage._value;
                   }

               } else if(jsonData.group) {
                   // it has multiple images
                   obj.mis1Data = jsonData.group[0].subwork;
                   for(var k=0; k < obj.mis1Data.length; k++){
                       if(obj.mis1Data[k].image[0]._attr.restrictedImage._value) {
                           obj.restrictedImage=obj.mis1Data[k].image[0]._attr.restrictedImage._value;
                       }
                   }
               }

           }
           // remove the $$U infront of url
           if(obj.pnx.links.thumbnail) {
               var imgUrl = $filter('urlFilter')(obj.pnx.links.thumbnail);
               obj.pnx.links.thumbnail[0]=imgUrl;
           }
           newData[i] = obj;

       }

       return newData;
    };

    // get user login ID
    serviceObj.logID=false;
    serviceObj.setLogInID=function (logID) {
        serviceObj.logID=logID;
    };

    serviceObj.getLogInID=function () {
        return serviceObj.logID;
    };

    // getter and setter for item data for view full detail page
    serviceObj.item={};
    serviceObj.setItem=function (item) {
        serviceObj.item=item;
    };

    serviceObj.getItem=function() {
        return serviceObj.item;
    };


    return serviceObj;

}]);
