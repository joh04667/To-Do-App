var app = angular.module('ToDoApp', []);


app.controller("MainController", ['$scope', '$http', function($scope, $http) {
  $scope.taskList = [];
  $scope.completedTaskList = [];
  $scope.newTask = "";
  $scope.errorShow = false;

// function will sort array of objects by key as ascending
  var sortByKey = function(array, key) {
   return array.sort(function(a, b){
     if(a[key] < b[key]) return -1;
     if(a[key] > b[key]) return 1;
     return 0;
   });
 };


  // gets all tasks in db
  $scope.getTasks = function() {
    $http.get('/tasks').then(function(response) {
      sortByKey(response.data, "id");
      $scope.taskList = response.data.filter(function(s) {
        return !s.task_complete;
      });
      $scope.completedTaskList = response.data.filter(function(s) {
        return s.task_complete;
      });
      // debug
      console.log($scope.taskList, "h", $scope.completedTaskList);
    });
  };

  // post new task to db
  $scope.submit = function() {
    if(!$scope.newTask) {$scope.errorShow = true;} else {
      $scope.errorShow = false;
    $http.post('/tasks/new', {task_name: $scope.newTask}).then(function(response) {
      console.log('posted', $scope.newTask);
      $scope.newTask = null;
      $scope.getTasks();
    });
  }
  };

// get db on page load
  $scope.getTasks();


}]); // main control end

app.controller("TaskController", ['$scope', '$http', function($scope, $http) {



// change status to complete
  $scope.complete = function(task) {
    $http.put('/tasks/update/' + task.id).then(function(response) {
    $scope.$parent.getTasks();

      //debug
      console.log('update response', response);
    });
  };

// delete a task from db
  $scope.delete = function(task) {
    $http.delete('/tasks/delete/' + task.id).then(function(response) {
     $scope.$parent.getTasks();


    });
  };


}]); // task control end
