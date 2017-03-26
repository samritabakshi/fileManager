angular.module('FolderStructure', [])
    .service('Structure', function($http, $q) {

        // var res = {};

        // // Replicate $http request returning JSON
        // res.all = function() {

        //     return $http.get('./folderStructure.json');

        // };

        this.getContent = function(_fileName, folderName) {
            var defer = $q.defer();
            $http.get('./fileContent.json').then(function(d) {
                var contentsOfFile = d.data[folderName].files.filter(function(a) {
                    return a.name == _fileName;
                })
                defer.resolve(contentsOfFile);
            }, function(e) {
                console.error(e);
                defer.reject(e);
            })
            return defer.promise;

        }
        this.searchFile = function(_fileName) {
            var searchResults = [];
            var defer = $q.defer();
            $http.get('./fileContent.json').then(function(d) {
                Object.keys(d.data).forEach(function(_folderName) {
                    d.data[_folderName].files.forEach(function(_files) {
                        if (_files.name == _fileName) {
                            var obj = {
                                "folderName": _folderName,
                                "file": _files.name
                            }
                            searchResults.push(obj);
                        }
                    })
                })
                defer.resolve(searchResults);
            }, function(e) {
                console.error(e);
                defer.reject(e);
            })
            return defer.promise;

        }
        this.addFile = function(_folderName, _file) {
            var defer = $q.defer();
            var jsonFile = ('./fileContent.json')[_folderName];
            $http.post(jsonFile, _file)
                .then(function(data) {
                    console.log(data);
                }, function(err) {
                    console.log(err)
                });
            return defer.promise;
        }

    });
