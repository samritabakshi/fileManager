angular.module('appCtrl', ["FolderStructure"])
    .controller('appCtrl', function($stateParams, $rootScope, $scope, $timeout, $mdSidenav, $log, $mdToast, $mdDialog, Structure, $q) {
        $scope.folders = [
            { name: "Folder-1" },
            { name: "Folder-2" },
            { name: "Folder-3" },
            { name: "Folder-4" },
            { name: "Folder-5" },
            { name: "Folder-6" },
            { name: "Folder-7" },
            { name: "Folder-8" },
            { name: "Folder-9" },
            { name: "Folder-10" },
            { name: "Folder-11" },
            { name: "Folder-12" },
        ];
        $scope.files = {
            "Folder-1": {
                "files": [{
                    "name": "File-1",
                    "size": "200000", // bytes
                    "date": "2016-06-30",
                    "MimeType": "image/png",
                }, {
                    "name": "File-2",
                    "size": "330033", // bytes
                    "date": "2016-06-30",
                    "MimeType": "image/jpg"
                }, {
                    "name": "File-3",
                    "size": "200000", // bytes
                    "date": "2016-06-30",
                    "MimeType": "image/png",
                }, {
                    "name": "File-4",
                    "size": "330033", // bytes
                    "date": "2016-06-30",
                    "MimeType": "image/jpg"
                }, {
                    "name": "File-5",
                    "size": "200000", // bytes
                    "date": "2016-06-30",
                    "MimeType": "image/png",
                }, {
                    "name": "File-6",
                    "size": "330033", // bytes
                    "date": "2016-06-30",
                    "MimeType": "image/jpg"
                }]
            }
        };
        self = this;

        // Update title using rootscope
        self.updateTitle = function() {
            $rootScope.title = $stateParams.title;
        }

        // Run updateTitle on each state change
        $rootScope.$on('$stateChangeSuccess', self.updateTitle);

        self.toggleLeft = function() {
            $mdSidenav('left').toggle();
        }

        self.toggleRight = function() {
            $mdSidenav('right').toggle();
        }
        $scope.toggleLeft = buildDelayedToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function() {
            return $mdSidenav('right').isOpen();
        };
        self.createFile = function(_folderName) {
            $scope.files[_folderName].files.push($scope.newFile)
        };
        self.addFolder = function(_folderName) {
            var obj = { name: _folderName }
            var index = $scope.folders.indexOf(obj);
            if (index == -1)
                $scope.folders.push(obj);
            else
                $scope.showCustomToast();

        };
        $scope.showCustomToast = function() {
            $mdToast.show({
                hideDelay: 3000,
                position: 'top right',
                controller: 'ToastCtrl',
                templateUrl: 'toast-template.html'
            });
        };

        $scope.selectFolder = function(_folderInfo) {
            $scope.selectedFolder = _folderInfo.name
        };

        function debounce(func, wait, context) {
            var timer;

            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function() {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function() {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }
        $mdSidenav('left').close()
            .then(function() {
                $log.debug("close LEFT is done");
            });
        $mdSidenav('right').close()
            .then(function() {
                $log.debug("close RIGHT is done");
            });


    })
    .directive('ngRightClick', function($parse) {
        return function($scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, { $event: event });
                });
            });
        };
    })
    .directive("ffFileBrowser", function($mdDialog, Structure, $q) {
        return {
            replace: true,
            restrict: 'EA',
            transclude: 'true',
            //template: "<input ng-model='value' ng-change='onChange()'>",
            templateUrl: function($elem, $attr) {
                if ($attr.mode == 'fileDisplay')
                    return 'home.html'
                else if ($attr.mode == 'search')
                    return "searchFile.html"
            },
            scope: {
                browse: "=",
                folder: "=",
                mode: "="
            },
            link: function(scope, element, attrs, ngModel) {
                var contentFile;
                init();
                scope.onChange = function() {
                    querySearch(scope.value).then(function(_results) {
                        showResults(_results)
                    })
                };

                function showResults(_results) {
                    $mdDialog.show({
                        templateUrl: 'searchResultsDialogue.html',
                        controller: 'resultController',
                        parent: angular.element(document.body),
                        locals: {
                            result: _results
                        } // Only for -xs, -sm breakpoints.
                    })
                }

                function init() {
                    angular.element(element).bind("click", function(e) {
                        console.log("h3")
                        getContent(scope.browse, scope.folder)
                    });

                };

                function getContent(_fileName, _folderName) {
                    Structure.getContent(_fileName, _folderName).then(function(_data) {
                        showAdvanced(scope.browse, _data);

                    })
                }

                function showAdvanced(fileName, content, ev) {
                    $mdDialog.show({
                        templateUrl: 'dialog1.tmpl.html',
                        controller: 'DialogController',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        locals: {
                            file: fileName,
                            content: content
                        } // Only for -xs, -sm breakpoints.
                    })
                };

                function querySearch(query) {
                    if (query) {
                        var deferred = $q.defer();
                        console.log(query);
                        Structure.searchFile(query).then(function(_data) {
                            console.log(_data);
                            var results = _data;
                            deferred.resolve(results);
                        })
                    }
                    return deferred.promise;
                }




                processDragOverOrEnter = function(event) {
                    if (event != null) {
                        event.preventDefault();
                    }
                    event.dataTransfer.effectAllowed = 'copy';
                    return false;
                };
                validMimeTypes = attrs.fileDropzone;
                checkSize = function(size) {
                    var _ref;
                    if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                        return true;
                    } else {
                        alert("File must be smaller than " + attrs.maxFileSize + " MB");
                        return false;
                    }
                };
                isTypeValid = function(type) {
                    if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                        return true;
                    } else {
                        alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                        return false;
                    }
                };
                element.bind('dragover', processDragOverOrEnter);
                element.bind('dragenter', processDragOverOrEnter);
                return element.bind('drop', function(event) {
                    var file, name, reader, size, type;
                    if (event != null) {
                        event.preventDefault();
                    }
                    reader = new FileReader();
                    reader.onload = function(evt) {
                        if (checkSize(size) && isTypeValid(type)) {
                            return scope.$apply(function() {
                                scope.file = evt.target.result;
                                if (angular.isString(scope.fileName)) {
                                    return scope.fileName = name;
                                }
                            });
                        }
                    };
                    file = event.dataTransfer.files[0];
                    name = file.name;
                    type = file.type;
                    size = file.size;
                    reader.readAsDataURL(file);
                    return false;
                });
            },

        }
    })

.controller("DialogController", function($scope, $mdDialog, file, content) {
        console.log(file, content);
        init()

        function init() {
            $scope.fileName = file
            $scope.contents = content;
        }
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    })
    .controller("resultController", function($scope, $mdDialog, result) {

        init()

        function init() {
            $scope.result = result;
        }
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    })
