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
                listArray=[];
                var work=xmldata.work[0];
                if(!work.surrogate && work.image) {
                    var data = work;
                    if(work.image.length===1) {
                        listArray = data;
                    } else {
                        listArray=[];
                        var images=angular.copy(work.image);
                        delete work.image;
                        for(var i=0; i < images.length; i++){
                            data=angular.copy(work);
                            data.image=[];
                            data.image[0]=images[i];
                            listArray.push(data);
                        }
                    }

                } else if(work.surrogate && work.image) {
                    var data = {};
                    listArray=[];
                    var images = angular.copy(work.image);
                    var surrogate = angular.copy(work.surrogate);
                    delete work.image;
                    delete work.surrogate;
                    for(var i=0; i < images.length; i++){
                        data=angular.copy(work);
                        data.image=[];
                        data.image[0]=images[i];
                        listArray.push(data);
                    }

                    data={};
                    for(var i=0; i < surrogate.length; i++){
                        data=surrogate[i];
                        if(surrogate[i].image) {
                            for(var j=0; j < surrogate[i].image.length; j++) {
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

                if(work.subwork && !work.surrogate) {
                    listArray=[];
                    for(var i=0; i < work.subwork.length; i++) {
                        var aSubwork=work.subwork[i];
                        if(aSubwork.surrogate) {
                            for(var j=0; j < aSubwork.surrogate.length; j++) {
                                var data=aSubwork.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if(aSubwork.image) {
                            for(var k=0; k < aSubwork.image.length; k++) {
                                var data=aSubwork;
                                data.thumbnail=aSubwork.image[k].thumbnail;
                                data._attr=aSubwork.image[k]._attr;
                                data.caption=aSubwork.image[k].caption;
                                listArray.push(data);
                            }
                        }
                        if(!aSubwork.image && !aSubwork.surrogate) {
                            listArray.push(aSubwork);
                        }
                    }
                }
                if(work.subwork && work.surrogate) {
                    listArray=[];
                    for(var i=0; i < work.subwork.length; i++) {
                        var aSubwork=work.subwork[i];
                        if(aSubwork.surrogate) {
                            for(var j=0; j < aSubwork.surrogate.length; j++) {
                                var data=aSubwork.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if(aSubwork.image) {
                            for(var k=0; k < aSubwork.image.length; k++) {
                                var data=aSubwork;
                                data.thumbnail=aSubwork.image[k].thumbnail;
                                data._attr=aSubwork.image[k]._attr;
                                data.caption=aSubwork.image[k].caption;
                                listArray.push(data);
                            }
                        }
                    }
                    for(var w=0; w < work.surrogate.length; w++) {
                        var aSurrogate=work.surrogate[w];
                        if(aSurrogate.surrogate) {
                            for(var j=0; j < aSurrogate.surrogate.length; j++) {
                                var data=aSurrogate.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if(aSurrogate.image) {
                            for(var k=0; k < aSurrogate.image.length; k++) {
                                var data=aSurrogate;
                                data.thumbnail=aSurrogate.image[k].thumbnail;
                                data._attr=aSurrogate.image[k]._attr;
                                data.caption=aSurrogate.image[k].caption;
                                listArray.push(data);
                            }
                        }
                    }
                }
                if(work.surrogate && !work.subwork) {
                    listArray=[];
                    for(var w=0; w < work.surrogate.length; w++) {
                        var aSurrogate=work.surrogate[w];
                        if(aSurrogate.surrogate) {
                            for(var j=0; j < aSurrogate.surrogate.length; j++) {
                                var data=aSurrogate.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if(aSurrogate.image) {
                            for(var k=0; k < aSurrogate.image.length; k++) {
                                var data=angular.copy(aSurrogate);
                                data.image[0]=aSurrogate.image[k];
                                listArray.push(data);
                            }
                        }
                        if(!aSurrogate.image && !aSurrogate.surrogate) {
                            listArray.push(aSurrogate);
                        }
                    }

                }

                xmldata=work;
                if(listArray.length > 0) {
                    xmldata.surrogate = listArray;
                }

                /* end work section ***/
            } else if(xmldata.group) {
                listArray=[];
                xmldata=xmldata.group[0];
                if(xmldata.subwork && xmldata.surrogate){
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
                                var data=aSubwork;
                                data.thumbnail=aSubwork.image[j].thumbnail;
                                data._attr=aSubwork.image[j]._attr;
                                data.caption=aSubwork.image[j].caption;
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
                                var data=aSurrogate;
                                data.thumbnail=aSurrogate.image[j].thumbnail;
                                data._attr=aSurrogate.image[j]._attr;
                                data.caption=aSurrogate.image[j].caption;
                                listArray.push(data);
                            }
                        }
                        if(!aSurrogate.surrogate && !aSurrogate.image) {
                            listArray.push(aSurrogate);
                        }
                    }
                    xmldata.surrogate=listArray;

                } else if(xmldata.subwork && !xmldata.surrogate) {
                    // transfer subwork to surrogate
                    var surrogate=[];
                    listArray=[];
                    var subwork=angular.copy(xmldata.subwork);
                    delete xmldata.subwork;
                    for(var i=0; i < subwork.length; i++) {
                        if(subwork[i].surrogate) {
                            surrogate=angular.copy(subwork[i].surrogate);
                            delete subwork[i].surrogate;
                            for(var k=0; k < surrogate.length; k++) {
                                if(surrogate[k].image) {
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
                        if(subwork[i].image) {
                            var images = angular.copy(subwork[i].image);
                            delete subwork[i].image;
                            for(var j=0; j < images.length; j++) {
                                var data=subwork[i];
                                data.image=[];
                                data.image[0]=images[j];
                                listArray.push(data);
                            }
                        }
                    }

                    xmldata.surrogate=listArray
                }
            }

        }
        return xmldata;
    };

    return serviceObj;

}]);
