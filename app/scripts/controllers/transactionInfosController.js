angular
  .module("ethExplorer")
  .controller(
    "transactionInfosCtrl",
    function ($rootScope, $scope, $location, $routeParams, $q) {
      var web3 = $rootScope.web3;

      $scope.init = function () {
        $scope.txId = $routeParams.transactionId;

        if ($scope.txId !== undefined) {
          // add a test to check if it match tx paterns to avoid useless API call, clients are not obliged to come from the search form...

          getTransactionInfos().then(function (result) {
            $scope.result = result;

            if (result.blockHash !== undefined) {
              $scope.blockHash = result.blockHash;
            } else {
              $scope.blockHash = "pending";
            }
            if (result.blockNumber !== undefined) {
              $scope.blockNumber = result.blockNumber;
            } else {
              $scope.blockNumber = "pending";
            }
            $scope.from = result.from;
            $scope.gas = result.gas;
            $scope.gasPrice = result.gasPrice + " wei";
            $scope.hash = result.hash;
            $scope.input = result.input;
            $scope.nonce = result.nonce;
            $scope.to = result.to;
            $scope.transactionIndex = result.transactionIndex;
            $scope.ethValue = Web3.utils.fromWei(result.value, "ether");
            var totalGasInWei = result.gas * result.gasPrice;
            $scope.txprice =
              Web3.utils.fromWei(totalGasInWei.toString(), "ether") + " eth";

            web3.eth.getBlockNumber().then((number) => {
              if ($scope.blockNumber !== undefined) {
                $scope.conf = number - $scope.blockNumber;
                $scope.$apply();
              }
            });

            if ($scope.blockNumber !== undefined) {
              web3.eth.getBlock($scope.blockNumber).then((info) => {
                if (info !== undefined) {
                  $scope.time = info.timestamp;
                  $scope.$apply();
                }
              });
            }
          });
        } else {
          $location.path("/"); // add a trigger to display an error message so user knows he messed up with the TX number
        }

        function getTransactionInfos() {
          var deferred = $q.defer();

          web3.eth.getTransaction($scope.txId, function (error, result) {
            if (!error) {
              deferred.resolve(result);
            } else {
              deferred.reject(error);
            }
          });
          return deferred.promise;
        }
      };
      $scope.init();
    }
  );
