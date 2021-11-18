"use strict";

angular
  .module("ethExplorer", ["ngRoute", "ui.bootstrap"])

  .config([
    "$routeProvider",
    "$locationProvider",
    function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when("/", {
          templateUrl: "views/main.html",
          controller: "mainCtrl",
        })
        .when("/block/:blockId", {
          templateUrl: "views/blockInfos.html",
          controller: "blockInfosCtrl",
        })
        .when("/transaction/:transactionId", {
          templateUrl: "views/transactionInfos.html",
          controller: "transactionInfosCtrl",
        })
        .when("/address/:addressId", {
          templateUrl: "views/addressInfo.html",
          controller: "addressInfoCtrl",
        });
      // .otherwise({
      //   redirectTo: "/",
      // });
    },
  ])
  .run(function ($rootScope) {
    var web3 = new Web3();
    var eth_node_url = "NODE_IP";
    web3.setProvider(new Web3.providers.WebsocketProvider(eth_node_url));
    $rootScope.web3 = web3;
    function sleepFor(sleepDuration) {
      var now = new Date().getTime();
      while (new Date().getTime() < now + sleepDuration) {
        /* do nothing */
      }
    }
    web3.eth.net
      .isListening()
      .then(() => console.log("connected", eth_node_url))
      .catch((err) => {
        console.error(err);
        $("#connectwarning").modal({ keyboard: false, backdrop: "static" });
        $("#connectwarning").modal("show");
      });
  });
