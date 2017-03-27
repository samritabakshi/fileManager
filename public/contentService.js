angular.module('FolderStructure', [])
    .service('Structure', function($q) {
        var files = {
            "Folder-1": {
                "files": [{
                    "name": "File-1",
                    "size": "200000",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }, {
                    "name": "File-2",
                    "size": "330033",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }, {
                    "name": "File-3",
                    "size": "200000",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }, {
                    "name": "File-4",
                    "size": "330033",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }, {
                    "name": "File-5",
                    "size": "200000",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }, {
                    "name": "File-6",
                    "size": "330033",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }]
            },
            "Folder-2": {
                "files": [{
                    "name": "File-7",
                    "size": "200000",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }, {
                    "name": "File-8",
                    "size": "330033",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }, {
                    "name": "File-9",
                    "size": "200000",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }, {
                    "name": "File-10",
                    "size": "330033",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }, {
                    "name": "File-5",
                    "size": "200",
                    "date": "2016-05-30",
                    "MimeType": "file"
                }, {
                    "name": "File-11",
                    "size": "330033",
                    "date": "2016-06-30",
                    "MimeType": "file"
                }]
            }
        }
        var folders = [
            { "name": "Folder-1" },
            { "name": "Folder-2" }
        ]
        this.getFiles = function(_folder) {
            var defer = $q.defer();
            if (files && _folder && files[_folder.name].files.length)
                defer.resolve(files[_folder.name].files);
            else
                defer.reject(e);
            return defer.promise;
        }
        this.getFolders = function() {
            var defer = $q.defer();
            if (folders)
                defer.resolve(folders);
            else
                defer.reject("No folder Found / No files present in folder");
            return defer.promise;
        }
        this.getContent = function(_fileName, folderName) {
            var defer = $q.defer();
            if (_fileName && folderName && files[folderName].files) {
                var data = files[folderName].files.filter(function(_d) {
                    return _d.name == _fileName;
                })
                defer.resolve(data[0]);
            } else
                defer.reject("File /Folder Not Found");
            return defer.promise;
        }

        this.searchFile = function(_fileName) {
            var searchResults = [];
            var defer = $q.defer();
            if (_fileName) {
                Object.keys(files).forEach(function(_folderName) {
                    files[_folderName].files.forEach(function(_files) {
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
            } else
                defer.reject(e);

            return defer.promise;

        }

        this.addFile = function(_folderName, _file) {
            var defer = $q.defer();
            if (_folderName && _file) {
                files[_folderName.name].files.push(_file)
                defer.resolve("Created File: " + _file.name);
            } else
                defer.reject(e);
            return defer.promise;
        }

        this.searchFolder = function(query) {
            var defer = $q.defer();
            if (folders.length)
                defer.resolve(folders);
            else
                defer.reject("No Folders Found")
            return defer.promise;
        }

    });
