var RockPaperScissors = artifacts.require("RockPaperScissors");

contract('RockPaperScissors', function(accounts) {
    var bet = web3.toWei(1, "ether");
    var player1 = accounts[1];
    var player2 = accounts[2];
    var player1StartingBalance = web3.eth.getBalance(player1).toNumber();
    var player2StartingBalance = web3.eth.getBalance(player2).toNumber();


    it("should get player1's balance", function () {
        return RockPaperScissors.deployed().then(function(instance) {
            return instance.getBalance.call(player1);
        }).then(function(player1Balance) {
            assert.equal(player1Balance.toNumber(), player1StartingBalance);
        });
    });

    it("should get player2's balance", function () {
        return RockPaperScissors.deployed().then(function(instance) {
            return instance.getBalance.call(player2);
        }).then(function(player2Balance) {
            assert.equal(player2Balance.toNumber(), player2StartingBalance);
        });
    });

    it("should add the first caller of addPlayer as player1", function() {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.addPlayer.call({from: player1});
        }).then(function() {
            return rps.player1.call();
        }).then(function(_player1) {
            assert.equal(_player1, player1)
        });
    });

});
