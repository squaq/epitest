angular.module('starter.controllers', ["chart.js"])

.controller('DiarioCtrl', function($scope, $http, $ionicLoading) {
    function httpGet(_url, success, error){
        $http({ method: 'GET', url:_url}).then(success,error);
    }
    
    $scope.init = function(){
        $ionicLoading.show({
          template: 'Carregando o Diário...'
        });
        
        httpGet("../data/calendar_month.json", completeCM, erroCM);
        httpGet("../data/calendar_year.json", completeCY, erroCY);
        httpGet("../data/total.json", completeTotal, erroTotal);
        
        for(var i = 0; i < 3; i++){
            var user = {}
            user.id = "User "+(i+1)
            user.name = "Nome"+(i+1)
            $scope.users.push(user)
        }
        console.log($scope.users)
    }
    
    $scope.users = []
                
    function completeCM(response)
    {
//        $scope.lineChart ={}
//        $scope.lineChart.labels = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
//        $scope.lineChart.data = []//[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//        var mData = []
//        $scope.lineChart.series = ['Mal']
//        for(u in response.data.data){
//            var pos = parseInt(response.data.data[u]._id.month)-1
////            console.log(response.data.data[u])
////                $scope.lineChart.data[pos] = response.data.data[u].count
//            mData.push(response.data.data[u].count)
////                $scope.lineChart.infos.push{{"month":$scope.lineChart.labels[u], "":}}
//        }
//        $scope.lineChart.data.push(mData)
        hideLoad()
    }
    function erroCM(response)
    {

    } 
    
    function completeCY(response)
    {
        $scope.lineChart ={}
        $scope.lineChart.labels = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        $scope.lineChart.data = []
        var mData = [0,0,0,0,0,0,0,0,0,0,0,0]
        $scope.lineChart.series = ['Mal']        
        for (u in response.data.data)
        {
            mData[response.data.data[u]._id.month -1] = parseFloat(response.data.data[u].percent)
        }
        $scope.lineChart.data.push(mData)
        hideLoad()
    }
    function erroCY(response)
    {

    } 
    
    function completeTotal(response)
    {
        $scope.total = response.data.data;
            $scope.pie={}
            $scope.pie.data = [$scope.total.no_symptom, $scope.total.symptom]
            $scope.pie.labels = ["Bem", "Mal"]
            $scope.pie.colours = ["#1AFC0A", "#FC0A0A"]
        hideLoad()
    }
    function erroTotal(response)
    {

    }
    
    $scope.goodPercent = function(){if($scope.total)return (($scope.total.no_symptom*100)/$scope.total.total).toFixed(2)}
    $scope.badPercent = function(){if($scope.total)return (($scope.total.symptom*100)/$scope.total.total).toFixed(2)}
    
    
    var contHideLd = 0
    function hideLoad(){if(++contHideLd>=3)$ionicLoading.hide()}
    
})






.controller('MapaCtrl', function($scope, $http, $compile, $ionicLoading) {
    function httpGet(_url, success, error){
        $http({ method: 'GET', url:_url}).then(success,error);
    }
    
    $scope.initMap = function (){
        $ionicLoading.show({
          template: 'Carregando o Mapa...'
        });
        var myOptions = {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(document.getElementById("map"), myOptions);

        $scope.map = map;
        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude))
        })
        
        google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
            hideLoad();
        });

        
        httpGet("../data/surveys.json", successCallback, errorCallback);
    }
    
    var contHideLd = 0
    function hideLoad(){if(++contHideLd>=2)$ionicLoading.hide()}
    
    function successCallback(response){
       $scope.users = response.data.data;
            $scope.$broadcast("scroll.refreshComplete")
            for(i in response.data.data) {
                
                console.log(response.data.data[i]);
                
                var iconpath = "img/circle_red.png" 
                if(response.data.data[i].no_symptom == "Y") var iconpath = "img/circle_green.png"
                
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(response.data.data[i].lat, response.data.data[i].lon),
                    map: $scope.map,
                    icon: iconpath
                });
            }
        hideLoad();
    }
    function errorCallback(response){
       $scope.users = response.data.data;
            $scope.$broadcast("scroll.refreshComplete")
            $ionicLoading.hide();
            console.log(response) 
    }
});
