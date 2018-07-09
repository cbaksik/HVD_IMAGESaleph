/**
 * Created by samsan on 7/18/17.
 * This is a service component and use to store data, get data, ajax call, compare any logic.
 */

angular.module('viewCustom')
    .service('customService',['$http',function ($http) {
        var serviceObj={};

        serviceObj.getAjax=function (url,param,methodType) {
            return $http({
                'method':methodType,
                'url':url,
                'timeout':5000,
                'params':param
            })
        };

        serviceObj.postAjax=function (url,jsonObj) {
            // pass primo token to header with value call token
            $http.defaults.headers.common.token=jsonObj.token;
            return $http({
                'method':'post',
                'url':url,
                'timeout':5000,
                'data':jsonObj
            })
        };

        // setter and getter for text msg data
        serviceObj.textData={};
        serviceObj.setTextData=function (data) {
            serviceObj.textData=data;
        };

        serviceObj.getTextData=function () {
            return serviceObj.textData;
        };

        // action list selected
        serviceObj.actionName='none';
        serviceObj.setActionName=function (actionName) {
            serviceObj.actionName=actionName;
        };
        serviceObj.getActionName=function () {
            return serviceObj.actionName;
        };

        // setter and getter
        serviceObj.items={};
        serviceObj.setItems=function (data) {
            serviceObj.items=data;
        };
        serviceObj.getItems=function () {
            return serviceObj.items;
        };

        // replace & . It cause error in firefox;
        serviceObj.removeInvalidString=function (str) {
            var pattern = /[\&]/g;
            return str.replace(pattern, '&amp;');
        };

        //parse xml
        serviceObj.convertXML=function (str) {
            var listItems=[];
            str=serviceObj.removeInvalidString(str);
            var xmldata=xmlToJSON.parseString(str);
            if(xmldata.requestlinkconfig) {
                listItems=xmldata.requestlinkconfig[0].mainlocationcode;
            }

            return listItems;
        };

        // setter and getter for library list data logic from xml file
        serviceObj.logicList=[];
        serviceObj.setLogicList=function (arr) {
            serviceObj.logicList=arr;
        };

        serviceObj.getLogicList=function () {
            return serviceObj.logicList;
        };

        // compare logic
        serviceObj.getLocation=function (currLoc) {
            var item='';
            for (var i = 0; i < serviceObj.logicList.length; i++) {
                var data = serviceObj.logicList[i];
                if (data._attr.id._value === currLoc.location.mainLocation) {
                    item = data;
                    i = serviceObj.logicList.length;
                }
            }

            return item;
        };

        // setter and getter for parent locations data
        serviceObj.parentData={};
        serviceObj.setParentData=function (data) {
            serviceObj.parentData=data;
        };
        serviceObj.getParentData=function () {
            return serviceObj.parentData;
        };

        // locationInfoArray when the current Location is matched with xml location
        // itemsCategory is an ajax response with itemcategorycode when pass current location
        serviceObj.getRequestLinks=function (locationInfoArray, itemsCategory, ItemType,TextDisplay, index, flagBoolean) {
            var requestItem={'flag':false,'item':{},'type':'','text':'','displayflag':false};
            requestItem.type=ItemType; // requestItem, scanDeliver, aeonrequest
            requestItem.text=TextDisplay; // Request Item, Scan & Delivery, Schedule visit
            requestItem.displayflag=flagBoolean;

            if(itemsCategory.length > 0 && locationInfoArray.length > 0) {

                for (var i = 0; i < locationInfoArray.length; i++) {
                    var json = locationInfoArray[i];

                    for (var j = 0; j < itemsCategory.length; j++) {
                        var itemCat = itemsCategory[j].items;

                        if (itemCat.length > 0) {
                            var item = itemCat[index];
                            var itemCategoryCodeList = '';
                            if (json._attr.itemcategorycode) {
                                itemCategoryCodeList = json._attr.itemcategorycode._value;
                                if (itemCategoryCodeList.length > 1) {
                                    itemCategoryCodeList = itemCategoryCodeList.toString();
                                    itemCategoryCodeList = itemCategoryCodeList.split(';'); // convert comma into array
                                } else {
                                    if(parseInt(itemCategoryCodeList)) {
                                        // add 0 infront of a number
                                        var arr = [];
                                        itemCategoryCodeList = '0' + itemCategoryCodeList.toString();
                                        arr.push(itemCategoryCodeList);
                                        itemCategoryCodeList = arr;
                                    } else {
                                        itemCategoryCodeList = itemCategoryCodeList.toString();
                                        itemCategoryCodeList = itemCategoryCodeList.split(';')
                                    }
                                }
                            }
                            var itemStatusNameList = '';
                            if (json._attr.itemstatusname) {
                                itemStatusNameList = json._attr.itemstatusname._value;
                                itemStatusNameList = itemStatusNameList.split(';'); // convert comma into array
                            }
                            var processingStatusList = '';
                            if (json._attr.processingstatus) {
                                processingStatusList = json._attr.processingstatus._value;
                                processingStatusList = processingStatusList.split(';'); // convert comma into array
                            }
                            var queueList = '';
                            if (json._attr.queue) {
                                queueList = json._attr.queue._value;
                                queueList = queueList.split(';'); // convert comma into array
                            }

                            if (itemCategoryCodeList.length > 0) {
                                // compare if item category code is number
                                if (itemCategoryCodeList.indexOf(item.itemcategorycode) !== -1) {
                                    if(item.processingstatus==='') {
                                        item.processingstatus='NULL';
                                    }
                                    if(item.queue === '') {
                                        item.queue='NULL';
                                    }
                                    if (itemStatusNameList.indexOf(item.itemstatusname) !== -1 && processingStatusList.indexOf(item.processingstatus) !== -1) {
                                            if(queueList.indexOf(item.queue) !== -1) {
                                                requestItem.flag = true;
                                                requestItem.item = item;
                                                i = locationInfoArray.length;
                                            } else if(!queueList) {
                                                requestItem.flag = true;
                                                requestItem.item = item;
                                                i = locationInfoArray.length;
                                            }

                                    } else if(itemStatusNameList.length > 0) {
                                        for(var k=0; k < itemStatusNameList.length; k++) {
                                            var statusName=itemStatusNameList[k];
                                            statusName=statusName.replace(/\*/g,'');
                                            var itemstatusname=item.itemstatusname;
                                            if(itemstatusname.includes(statusName) && processingStatusList.indexOf(item.processingstatus) !== -1) {
                                                    requestItem.flag = true;
                                                    requestItem.item = item;
                                                    i = locationInfoArray.length;
                                            }
                                        }

                                    }
                                } else if(itemCategoryCodeList[0]==='*') {
                                    // compare if item category code is asterisk
                                    if(itemStatusNameList.indexOf(item.itemstatusname) !== -1 && processingStatusList.indexOf(item.processingstatus) !== -1) {
                                        requestItem.flag = true;
                                        requestItem.item = item;
                                        i = locationInfoArray.length;
                                    } else if(itemStatusNameList.length > 0) {
                                        // remove asterisk and find word in the array list
                                        for(var k=0; k < itemStatusNameList.length; k++) {
                                            var statusName=itemStatusNameList[k];
                                            statusName=statusName.replace(/\*/g,'');
                                            var itemstatusname=item.itemstatusname;
                                            if(itemstatusname.includes(statusName) && processingStatusList.indexOf(item.processingstatus) !== -1) {
                                                requestItem.flag = true;
                                                requestItem.item = item;
                                                i = locationInfoArray.length;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }

            return requestItem;
        };

        serviceObj.auth={};
        serviceObj.setAuth=function (data) {
            serviceObj.auth=data;
        };

        serviceObj.getAuth=function () {
           return serviceObj.auth;
        };


        return serviceObj;
    }]);
