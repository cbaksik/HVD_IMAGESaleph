/**
 * Created by samsan on 7/31/17.
 * The web sql is stored on user browser when a user is not login
 */
angular.module('viewCustom')
    .service('prmFavoriteWebSql',['$window',function ($window) {

        var websql={};

        var items=[];
        websql.setItem=function (data) {
            items=data
        };
        websql.getItem=function () {
            return items;
        };

        var db, request, objectStore,query;
        websql.init=function (callback) {
            request=$window.indexedDB.open('lf',2);
            request.onerror=function (err) {
                console.log(err);
            };
            // for update or create new record
            request.onupgradeneeded=function (e) {
                console.log(e);
            };

            request.onsuccess=function(e) {
                db=request.result;
                callback(db);

            };
        };

        // remote item from web sql base on userID
        websql.removePinItem=function (index,userID, callback) {
            var myKey=userID;
            var myIndex=parseInt(index);
            var objectStore=db.transaction(['keyvaluepairs'],"readwrite").objectStore('keyvaluepairs');
            var query=objectStore.get(myKey);

            query.onerror=function (err) {
                console.log(err);
            };

            query.onsuccess=function(e) {
                var result=query.result;
                var dataList=[];
                var k=0;
                for(var i=0; i < result.length; i++) {
                    if(i !== myIndex) {
                        dataList[k]=result[i];
                        k++;
                    }
                }

                // update web sql record base
                objectStore.put(dataList,myKey);
                callback(dataList);
            };

        };

        websql.getPinItem=function (userID, callback) {
            var myKey=userID;

            var objectStore=db.transaction(['keyvaluepairs'],"readwrite").objectStore('keyvaluepairs');
            var query=objectStore.get(myKey);

            query.onerror=function (err) {
                console.log(err);
            };

            query.onsuccess=function(e) {
                var result=query.result;
                callback(result);
            };
        };

        return websql;

    }]);
