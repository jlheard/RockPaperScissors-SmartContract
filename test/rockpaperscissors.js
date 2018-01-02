var RockPaperScissors = artifacts.require("RockPaperScissors");

contract('RockPaperScissors', function(accounts) {
    var bid = web3.toBigNumber(10);
    var player1 = accounts[1];
    var player2 = accounts[2];
    var player1StartingBalance = web3.eth.getBalance(player1).toNumber();
    var player2StartingBalance = web3.eth.getBalance(player2).toNumber();


    it("should get player1's balance", function () {
        return RockPaperScissors.deployed().then(function(instance) {
            return instance.getBalance.call(player1);
        }).then(function(player1Balance) {
            assert.equal(player1StartingBalance, player1Balance.toNumber());
        });
    });

    it("should get player2's balance", function () {
        return RockPaperScissors.deployed().then(function(instance) {
            return instance.getBalance.call(player2);
        }).then(function(player2Balance) {
            assert.equal(player2StartingBalance, player2Balance.toNumber());
        });
    });

    it("should give refunds when player1 and player2 play ROCK ", function () {
        return RockPaperScissors.deployed().then(function(instance) {
            return instance.play.call(player1, player2, 0, 0, bid);
        }).then(function() {
            assert.equal(player1StartingBalance,  web3.eth.getBalance(player1));
        });
    });
});
