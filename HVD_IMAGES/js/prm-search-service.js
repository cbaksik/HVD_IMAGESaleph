/**
 * Created by samsan on 5/12/17.
 * This custom service use to inject to the controller.
 */

angular.module('viewCustom')
    .service('prmSearchService',['$http','$window','$filter',function ($http, $window, $filter) {
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
        str=serviceObj.removeInvalidString(str);
        return xmlToJSON.parseString(str);
    };

    // maninpulate data and convert xml data to json
    serviceObj.convertData=function (data) {
       var newData=[];
       for(var i=0; i < data.length; i++){
           var obj=data[i];
           obj.restrictedImage=false;
           if(obj.pnx.addata.mis1) {
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
                       if (jsonData.group[0].subwork) {
                           obj.mis1Data=jsonData.group[0].subwork;
                           for (var k = 0; k < obj.mis1Data.length; k++) {
                               if (obj.mis1Data[k].image) {
                                   obj.restrictedImage = obj.mis1Data[k].image[0]._attr.restrictedImage._value;
                               }
                           }
                       }
                       if(jsonData.group[0].surrogate) {
                           var j=obj.mis1Data.length;
                           for (var k = 0; k < jsonData.group[0].surrogate.length; k++) {
                               obj.mis1Data[j]=jsonData.group[0].surrogate[k];
                               if (obj.mis1Data[j].image) {
                                   obj.restrictedImage = obj.mis1Data[j].image[0]._attr.restrictedImage._value;
                               }
                               j++;
                           }
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

    // this handle multipe subtree
    serviceObj.getXMLdata=function (str) {
        var xmldata='';
        if(str) {
            xmldata = serviceObj.parseXml(str);

            console.log('** xmldata ***');
            console.log(xmldata);

            if(xmldata.work) {
                xmldata=xmldata.work[0];
                if(!xmldata.surrogate && xmldata.image) {
                    xmldata.surrogate=xmldata.image;
                }
                if(xmldata.subwork && xmldata.surrogate) {
                    var k=xmldata.surrogate.length;
                    for(var i=0; i < xmldata.subwork.length; i++) {
                        xmldata.surrogate[k]=xmldata.subwork[i];
                        k++;
                        if(xmldata.subwork[i].surrogate) {
                            for(var j=0; j < xmldata.subwork[i].surrogate.length; j++) {
                                xmldata.surrogate[k]=xmldata.subwork[i].surrogate[j];
                                k++;
                            }
                        }
                    }
                }
            } else if(xmldata.group) {
                xmldata=xmldata.group[0];
                if(xmldata.subwork && xmldata.surrogate){
                    console.log('*** I am here one ');
                    var listArray=[];
                    var subwork=xmldata.subwork;
                    var surrogate=xmldata.surrogate;
                    // get all the surrogate under subwork
                    for(var i=0; i < subwork.length; i++) {
                        var aSubwork = subwork[i];
                        if(aSubwork.surrogate) {
                            for(var k=0; k < aSubwork.surrogate.length; k++) {
                                var data=aSubwork.surrogate[k];
                               listArray.push(data);
                            }
                        }
                        if(aSubwork.image) {
                            for(var j=0; j < aSubwork.image.length; j++){
                                var data=aSubwork.image[j];
                                listArray.push(data);
                            }
                        }
                        if(!aSubwork.surrogate && !aSubwork.image) {
                            listArray.push(aSubwork);
                        }

                    }
                    // get all surrogate
                    for(var i=0; i < surrogate.length; i++) {
                        var aSurrogate=surrogate[i];
                        if(aSurrogate.surrogate) {
                            for(var j=0; j < aSurrogate.surrogate.length; j++) {
                                var data=aSurrogate.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if(aSurrogate.image) {
                            for(var j=0; j < aSurrogate.image.length; j++) {
                                var data=aSurrogate.image[j];
                                listArray.push(data);
                            }
                        }
                        if(!aSurrogate.surrogate && !aSurrogate.image) {
                            listArray.push(aSurrogate);
                        }
                    }
                    xmldata.surrogate=listArray;
                    console.log(xmldata);

                } else if(xmldata.subwork && !xmldata.surrogate) {
                    console.log('*** I am here two ');
                    // transfer subwork to surrogate
                    var surrogate=[];
                    var subwork=xmldata.subwork;
                    for(var i=0; i < subwork.length; i++) {
                        if(subwork[i].surrogate) {
                            for(var k=0; k < subwork[i].surrogate.length; k++) {
                                surrogate.push(subwork[i].surrogate[k]);
                            }
                        }
                        if(subwork[i].image) {
                            for(var j=0; j < subwork[i].image.length; j++) {
                                surrogate.push(subwork[i].image[j]);
                            }
                        }
                    }

                    xmldata.surrogate=surrogate;
                    console.log(xmldata);

                }
            }

        }
        return xmldata;
    };

    return serviceObj;

}]);
