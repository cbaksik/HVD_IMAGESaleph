/**
 * Created by samsan on 5/12/17.
 */

angular.module('viewCustom')
    .service('prmSearchService',['$http','$q',function ($http,$q) {
    let serviceObj={};

    serviceObj.getAjax=function (url,param,methodType) {
      return $http({
          'method':methodType,
          'url':url,
          'params':param
      })
    };

    serviceObj.get=function () {
       return 'hello world';
    };

    return serviceObj;

}]);
