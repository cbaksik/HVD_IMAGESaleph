/**
 * Created by samsan on 5/12/17.
 * This custom service use to inject to the controller.
 */

angular.module('viewCustom')
    .service('prmSearchService',['$http','$window','$filter','$sce',function ($http, $window, $filter,$sce) {
    let serviceObj={};

    serviceObj.getBrowserType=function () {
        var userAgent=$window.navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        };

        return '';
    };

    //http ajax service, pass in URL, parameters, method. The method can be get, post, put, delete
    serviceObj.getAjax=function (url,param,methodType) {
      return $http({
          'method':methodType,
          'url':url,
          'params':param
      })
    };

    serviceObj.postAjax=function (url,jsonObj) {
        return $http({
            'method':'post',
            'url':url,
            'data':jsonObj
        })
    };

    // default page info
    serviceObj.page = {'pageSize':50,'totalItems':0,'currentPage':1,'query':'','searchString':'','totalPages':0,'offset':0,'userClick':false};
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
        var pattern = /[\&]/g;
        return str.replace(pattern, '&amp;');
    };

    //parse xml
    serviceObj.parseXml=function (str) {
        var options = {
            mergeCDATA: true,	// extract cdata and merge with text nodes
            grokAttr: true,		// convert truthy attributes to boolean, etc
            grokText: false,		// convert truthy text/attr to boolean, etc
            normalize: true,	// collapse multiple spaces to single space
            xmlns: true, 		// include namespaces as attributes in output
            namespaceKey: '_ns', 	// tag name for namespace objects
            textKey: '_text', 	// tag name for text nodes
            valueKey: '_value', 	// tag name for attribute values
            attrKey: '_attr', 	// tag for attr groups
            cdataKey: '_cdata',	// tag for cdata nodes (ignored if mergeCDATA is true)
            attrsAsObject: true, 	// if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
            stripAttrPrefix: true, 	// remove namespace prefixes from attributes
            stripElemPrefix: true, 	// for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
            childrenAsArray: true 	// force children into arrays
        };

        str=serviceObj.removeInvalidString(str);
        return xmlToJSON.parseString(str,options);
    };

    // maninpulate data and convert xml data to json
    serviceObj.convertData=function (data) {
       var newData=[];
       for(var i=0; i < data.length; i++){
           var obj=data[i];
           obj.restrictedImage=false;
           if(obj.pnx.addata.mis1) {
               if (obj.pnx.addata.mis1.length > 0) {
                   var jsonObj=serviceObj.getXMLdata(obj.pnx.addata.mis1[0]);
                   if(jsonObj.surrogate) {
                       for (var k = 0; k < jsonObj.surrogate.length; k++) {
                            if(jsonObj.surrogate[k].image) {
                                if(jsonObj.surrogate[k].image[0]._attr) {
                                    if (jsonObj.surrogate[k].image[0]._attr.restrictedImage._value) {
                                        obj.restrictedImage = true;
                                        k = jsonObj.surrogate.length;
                                    }
                                }
                            }
                       }
                   }
                   if(jsonObj.image) {
                       for (var k = 0; k < jsonObj.image.length; k++) {
                           if(jsonObj.image[k]._attr.restrictedImage) {
                               if(jsonObj.image[k]._attr.restrictedImage._value) {
                                   obj.restrictedImage=true;
                                   k=jsonObj.image.length;
                               }
                           }
                       }
                   }
               }
           }
           // remove the $$U infront of url
           if(obj.pnx.links.thumbnail) {
               var imgUrl = $filter('urlFilter')(obj.pnx.links.thumbnail);
               obj.pnx.links.thumbnail[0]=serviceObj.getHttps(imgUrl);
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

    // getter and setter for single image data
    serviceObj.data={};
    serviceObj.setData=function (data) {
      serviceObj.data=data;
    };

    serviceObj.getData=function () {
        return serviceObj.data;
    };

    // getter and setter for selected facet
    serviceObj.facets=[];
    serviceObj.setFacets=function (data) {
       serviceObj.facets=data;
    };
    serviceObj.getFacets=function () {
        return serviceObj.facets;
    };

    // setter and getter for a single image
    serviceObj.photo={};
    serviceObj.setPhoto=function (data) {
        serviceObj.photo=data;
    };
    serviceObj.getPhoto=function () {
        return serviceObj.photo;
    };

    // get user profile for authentication to login
    serviceObj.auth={};
    serviceObj.setAuth=function (data) {
        serviceObj.auth=data;
    };
    serviceObj.getAuth=function () {
      return serviceObj.auth;
    };

    serviceObj.modalDialogFlag=false;
    serviceObj.setDialogFlag=function (flag) {
        serviceObj.modalDialogFlag=flag;
    };

    serviceObj.getDialogFlag=function () {
        return serviceObj.modalDialogFlag;
    };

    // replace http with https
    serviceObj.getHttps=function (url) {
        var pattern = /^(http:)/i;
        if(pattern.test(url)) {
            return url.replace(pattern, 'https:');
        } else {
            return url;
        }
    };

    // find image if it is jp2 or not
    serviceObj.findJP2=function (itemData) {
      var flag=false;
      if(itemData.thumbnail) {
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
    serviceObj.getXMLdata=function (str) {
        var xmldata='';
        var listArray=[];
        if(str) {
            xmldata = serviceObj.parseXml(str);
            if(xmldata.work) {
                for(var k=0; k < xmldata.work.length; k++) {
                   var subLevel=xmldata.work[k];
                     if(subLevel.component) {
                         listArray=subLevel.component;
                     } else if(subLevel.image) {
                         listArray=subLevel;
                     }
                }

            } else {
                listArray=xmldata;
            }

        }

        return listArray;
    };

    // get json value base on dynamic key
     serviceObj.getValue=function (obj,key) {
         var text='';
         if(typeof(obj)==='object') {
             if(Array.isArray(obj)) {
                 obj=obj[0];
             }
             var keys = Object.keys(obj);
             // remove altComponentID
             if(key==='_attr') {
                 var index=keys.indexOf('altComponentID');
                 if(index !== -1) {
                     keys.splice(index,1);
                 }
             }
             // re-arrange keys relate to associatedName
             if(key==='associatedName') {
                 var tempKeys=[];
                 var asskeys=['nameElement','dates','role'];
                 for(var c=0; c < asskeys.length; c++) {
                     var index=keys.indexOf(asskeys[c]);
                     if(index !== -1) {
                         tempKeys.push(asskeys[c]);
                     }
                 }
                 keys=tempKeys;
             }

             for(var k=0; k < keys.length; k++) {
                 var nodeKey=keys[k];
                 if(nodeKey) {
                     var nodeValue=obj[nodeKey];
                     if(typeof(nodeValue)==='object') {
                         if(Array.isArray(nodeValue)) {
                             for(var i=0; i < nodeValue.length; i++) {
                                 var data=nodeValue[i];
                                 if(typeof(data)==='object') {
                                     if(Array.isArray(data)) {
                                         for(var j=0; j < data.length; j++) {
                                             var data2=data[j];
                                             if(typeof(data2)==='object'){
                                                 if(Array.isArray(data2)) {
                                                     for(var c=0; c < data2.length; c++) {
                                                         var data3=data2[c];
                                                         if(typeof(data3)==='object') {
                                                             if(Array.isArray(data3)) {
                                                                 for(var w=0; w < data3.length; w++) {
                                                                     var data4=data3[w];
                                                                     if(typeof(data4)==='object') {
                                                                         text+=data4[0] + '&nbsp;';
                                                                     } else {
                                                                         text+=data4 + '&nbsp;';
                                                                     }
                                                                 }
                                                             }
                                                         } else {
                                                             text+=data3 + '&nbsp;';
                                                         }
                                                     }
                                                 }
                                             } else {
                                                 text+=data2 + '&nbsp;';
                                             }
                                         }
                                     } else  {
                                         var subNodeKeys=Object.keys(data);
                                         if(Array.isArray(subNodeKeys)) {
                                             for(var b=0; b < subNodeKeys.length; b++) {
                                                 var key2=subNodeKeys[b];
                                                 if(typeof(key2)==='object') {
                                                     if(Array.isArray(key2)) {
                                                         for(var c=0; c < key2.length; c++){
                                                             var key3=key2[c];
                                                             if(typeof(key3)==='object') {
                                                                 if(Array.isArray(key3)) {
                                                                     for(var x=0; x < key3.length; x++) {
                                                                         var key4=key3[x];
                                                                         if(typeof(key4)==='object') {
                                                                             text+=data[key4][0] + '&nbsp;';
                                                                         } else {
                                                                             text+=data[key4] + '&nbsp;';
                                                                         }
                                                                     }
                                                                 }
                                                             } else {
                                                                 text+=data[key3] + '&nbsp;';
                                                             }
                                                         }
                                                     }
                                                 } else if(key2) {
                                                     if(key==='associatedName' && nodeKey==='nameElement') {
                                                         text += data[key2] + ', ';
                                                     } else if(key==='associatedName' && nodeKey==='role') {
                                                         text += '[' + data[key2] + ']';
                                                     } else {
                                                         text += data[key2] + '&nbsp;';
                                                     }
                                                 }
                                             }
                                         } else {
                                             text+=data[subNodeKeys] + '&nbsp;';
                                         }
                                     }
                                 } else {
                                     text+=data;
                                 }
                             }
                         } else if(nodeKey) {
                             var nodeKey2=Object.keys(nodeValue);
                             if(typeof(nodeKey2)==='object') {
                                 if(Array.isArray(nodeKey2)) {
                                     for(var c=0; c < nodeKey2.length; c++) {
                                         var nodeKey3=nodeKey2[c];
                                         if(nodeKey3) {
                                             text+=nodeValue[nodeKey3] + '&nbsp;';
                                         }
                                     }
                                 }
                             } else if(nodeKey2) {
                                 text+=nodeValue[nodeKey2] + '&nbsp;';
                             }
                         }
                     } else {
                         text+=nodeValue + '&nbsp;';
                     }
                 }
             }
         } else {
             text=obj;
         }

         return text;
     };

     // store api rest url from config.html
     serviceObj.api={};
     serviceObj.setApi=function (data) {
         serviceObj.api=data;
     };

     serviceObj.getApi=function () {
        return serviceObj.api;
     };

     // store validate client ip status
     serviceObj.clientIp={};
     serviceObj.setClientIp=function (data) {
        serviceObj.clientIp = data;
     };
     serviceObj.getClientIp=function(){
       return serviceObj.clientIp;
     };

    return serviceObj;

}]);
