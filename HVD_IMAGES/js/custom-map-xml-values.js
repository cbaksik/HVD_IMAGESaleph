/**
 * Created by samsan on 10/13/17.
 */
angular.module('viewCustom')
    .service('customMapXmlValues',[function () {
        var serviceObj = {};

        // get relatedInformation value
        serviceObj.getRelatedInformation=function (nodeValue) {
            var str='';
            var keys = Object.keys(nodeValue);
            if(keys.length > 0) {
                for(var i=0; i < keys.length; i++) {
                    var key=keys[i];
                    var values=nodeValue[key];
                    if(values) {
                        var nodeKeys=Object.keys(values);
                        var text = '';
                        var url = '';
                        var index = nodeKeys.indexOf('_text');
                        if (index !== -1) {
                            text = values['_text'];
                        }
                        var index2 = nodeKeys.indexOf('_attr');
                        if (index2 !== -1) {
                            url = values['_attr']['href']['_value'];
                        }
                        if (url && text) {
                            str = '<a href="' + url + '" target="_blank">' + text + '</a><br/>';
                        }
                    }
                }
            }
            if(str) {
                str=str.replace(/<br\/>$/,'');
            }
            return str;

        };

        // get associatedName value
        serviceObj.getAssociatedName=function (nodeValue) {
            var str='';
            var name='';
            var dates='';
            var role='';
            var keys = Object.keys(nodeValue);
            for(var i=0; i < keys.length; i++) {
                var nodeKey=keys[i];
                var values=nodeValue[nodeKey];
                if(values) {
                    var nodeKeys = Object.keys(values);
                    var index = nodeKeys.indexOf('nameElement');
                    var index2 = nodeKeys.indexOf('dates');
                    var index3 = nodeKeys.indexOf('role');
                    if (index !== -1) {
                        name = values['nameElement'];
                        if (Array.isArray(name)) {
                            name = name[0]['_text'];
                        }

                    }

                    if (index2 !== -1) {
                        dates = values['dates'];
                        if (Array.isArray(dates)) {
                            dates = dates[0]['_text'];
                        }
                        if (dates) {
                            dates = ', ' + dates;
                        }

                    }

                    if (index3 !== -1) {
                        role = values['role'];
                        if (Array.isArray(role)) {
                            role = ' [' + role[0]['_text'] + ']';
                        }
                        str += name + dates + role + '<br/>';
                    } else {
                        str += name + dates + '<br/>';
                    }
                }

            }
            if(str) {
                str=str.replace(/<br\/>$/,'');
            }
            return str;
        };

        // get image ID
        serviceObj.getAttr=function (nodeValue) {
            var str='';
            var keys = Object.keys(nodeValue);
            if(keys.length > 0) {
                var index = keys.indexOf('componentID');
                if(index !== -1) {
                    var componentID = nodeValue['componentID'];
                    if(typeof(componentID)==='object') {
                        componentID = componentID['_value'];
                    }
                    str=componentID;
                }

            }
            return str;
        };

        // get relatedWork
        serviceObj.getTopic=function (nodeValue) {
            var str='';
            var keys = Object.keys(nodeValue);
            if(keys.length > 0) {
                for(var i=0; i < keys.length; i++) {
                    var nodeKey=keys[i];
                    var values=nodeValue[nodeKey];
                    if(typeof(values)==='object') {
                        var nodeKeys2=Object.keys(values);
                        for(var k=0; k < nodeKeys2.length; k++) {
                            var nodekey3=nodeKeys2[k];
                            if(nodekey3) {
                                var values2 = values[nodekey3];
                                if(typeof(values2)==='object') {
                                    var nodekeys4 = Object.keys(values2);
                                    if(nodekeys4) {
                                        var values3=values2[nodekeys4];
                                        if(typeof(values3)==='object') {
                                            var nodeKeys5=Object.keys(values3);
                                            for (var c = 0; c < nodeKeys5.length; c++) {
                                                var nodekey5 = nodeKeys5[c];
                                                str += values3[nodekey5] +';&nbsp;';
                                            }
                                        } else {
                                            str+=values3 +';&nbsp;';
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        str+=values;
                    }
                }

            }
            if(str) {
                str=str.replace(/;&nbsp;$/,'');
            }
            return str;
        };

        // get relatedWork
        serviceObj.getRelatedWork=function (nodeValue) {
            var str='';
            var keys = Object.keys(nodeValue);
            if(keys.length > 0) {
                for(var i=0; i < keys.length; i++) {
                    var nodeKey=keys[i];
                    var values=nodeValue[nodeKey];
                    if(values) {
                        var nodeKeys=Object.keys(values);
                        if(typeof(nodeKeys)==='object') {
                            for(var k=0; k < nodeKeys.length; k++) {
                                var key2=nodeKeys[k];
                                if(key2) {
                                    var values2=values[key2];
                                    if(typeof(values2)==='object') {
                                        var nodeKeys2=Object.keys(values2);
                                        if(typeof(nodeKeys2)==='object') {
                                            for(var c=0; c < nodeKeys2.length; c++) {
                                                var key3=nodeKeys2[c];
                                                if(key3) {
                                                    var values3=values2[key3];
                                                    if(typeof(values3)==='object') {
                                                        var nodeKeys3=Object.keys(values3);
                                                        for(var j=0; j < nodeKeys3.length; j++) {
                                                            var key4=nodeKeys3[j];
                                                            var values4=values3[key4];
                                                            if(values4) {
                                                                str+=values4+'<br/>';
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            str+=values2[nodeKeys2] + '<br/>';
                                        }
                                    } else {
                                        str += values2 + '<br/>';
                                    }
                                }
                            }
                        } else if(values) {
                            str+=values+'<br/>';
                        }
                    }
                }

            }

            if(str){
                str=str.replace(/<br\/>$/,'');
            }
            return str;
        };

        // get xml node value
        serviceObj.getValue=function (values, key) {
            var text='';
            if(typeof(values)==='object'){
                switch(key) {
                    case 'hvd_relatedInformation':
                    case 'relatedInformation':
                        text = serviceObj.getRelatedInformation(values);
                        break;
                    case 'hvd_associatedName':
                    case 'associatedName':
                        text = serviceObj.getAssociatedName(values);
                        break;
                    case '_attr':
                        text = serviceObj.getAttr(values);
                        break;
                    case 'hvd_relatedWork':
                    case 'relatedWork':
                            text = serviceObj.getRelatedWork(values);
                        break;
                    case 'topic':
                            text = serviceObj.getTopic(values);
                        break;
                    default:
                            text = serviceObj.getOtherValue(values,key);
                        break;
                }

            } else {
                text=values;
            }
            return text;
        };


        // get json value base on dynamic key
        serviceObj.getOtherValue=function (obj,key) {
            var text='';
            if(typeof(obj)==='object') {
                if(Array.isArray(obj)) {
                    obj=obj[0];
                }
                var keys = Object.keys(obj);

                for(var k=0; k < keys.length; k++) {
                    var nodeKey=keys[k];
                    if(nodeKey) {
                        var nodeValue=obj[nodeKey];
                        if(Array.isArray(nodeValue)) {
                            nodeValue=nodeValue[0];
                        }

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
                                                        text += data[key2] + '&nbsp;';
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
                                                var nodeValue3 = nodeValue[nodeKey3];
                                                if(Array.isArray(nodeValue3)) {
                                                    nodeValue3 = nodeValue3[0];
                                                }
                                                if(typeof(nodeValue3)==='object') {
                                                    var nodeKey4 = Object.keys(nodeValue3);
                                                    if(Array.isArray(nodeKey4)) {
                                                        for (var b = 0; b < nodeKey4.length; b++) {
                                                            var nodeKey5 = nodeKey4[b];
                                                            if (nodeKey5) {
                                                                text += nodeValue3[nodeKey5] + '&nbsp;';
                                                            }
                                                        }
                                                    } else {
                                                        text += nodeValue3[nodeKey4] + '&nbsp;';
                                                    }
                                                } else {
                                                    text += nodeValue3 + '&nbsp;';
                                                }
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

        return serviceObj;
    }]);
