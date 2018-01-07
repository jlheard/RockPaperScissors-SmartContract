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
            return rps.addPlayer.sendTransaction({from: player1});
        }).then(function() {
            return rps.player1.call();
        }).then(function(_player1) {
            assert.equal(_player1, player1);
        });
    });

    it("should add player1's bet", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.player1Bet.call();
        }).then(function(player1Bet) {
            assert.equal(player1Bet.toNumber(), bet);
        });
    });

    it("should add the second caller of addPlayer as player2", function() {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.addPlayer.sendTransaction({from: player2});
        }).then(function() {
            return rps.player2.call();
        }).then(function(_player2) {
            assert.equal(_player2, player2);
        });
    });

    it("should add player2's bet", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.player2Bet.call();
        }).then(function(player2Bet) {
            assert.equal(player2Bet.toNumber(), bet);
        });
    });

    it("should be a tie and give refund when player1 plays ROCK and player2 plays ROCK", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.play.sendTransaction(0, 0);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), player1StartingBalance);
            assert.equal(web3.eth.getBalance(player2).toNumber(), player2StartingBalance);
        });
    });

    it("should be a player2 win when player1 plays ROCK and player2 plays PAPER", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(0, 1);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), parseInt(player1StartingBalance) - parseInt(bet));
            assert.equal(web3.eth.getBalance(player2).toNumber(), parseInt(player2StartingBalance) + parseInt(bet));
        });
    });

    it("should be a player1 win when player1 plays ROCK and player2 plays SCISSORS", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(0, 2);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), parseInt(player1StartingBalance) + parseInt(bet));
            assert.equal(web3.eth.getBalance(player2).toNumber(), parseInt(player2StartingBalance) - parseInt(bet));
        });
    });

    it("should be invalid and give refund when player1 plays ROCK and player2 plays invalid", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(0, 5);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), player1StartingBalance);
            assert.equal(web3.eth.getBalance(player2).toNumber(), player2StartingBalance);
        });
    });

    it("should be a player1 win when player1 plays PAPER and player2 plays ROCK", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(1, 0);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), parseInt(player1StartingBalance) + parseInt(bet));
            assert.equal(web3.eth.getBalance(player2).toNumber(), parseInt(player2StartingBalance) - parseInt(bet));
        });
    });

    it("should be a tie and give refund when player1 plays PAPER and player2 plays PAPER", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(1, 1);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), player1StartingBalance);
            assert.equal(web3.eth.getBalance(player2).toNumber(), player2StartingBalance);
        });
    });

    it("should be a player2 win when player1 plays PAPER and player2 plays SCISSORS", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(1, 2);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), parseInt(player1StartingBalance) - parseInt(bet));
            assert.equal(web3.eth.getBalance(player2).toNumber(), parseInt(player2StartingBalance) + parseInt(bet));
        });
    });

    it("should be invalid and give refund when player1 plays PAPER and player2 plays invalid", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(1, 10);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), player1StartingBalance);
            assert.equal(web3.eth.getBalance(player2).toNumber(), player2StartingBalance);
        });
    });

    it("should be a player2 win when player1 plays SCISSORS and player2 plays ROCK", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(2, 0);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), parseInt(player1StartingBalance) - parseInt(bet));
            assert.equal(web3.eth.getBalance(player2).toNumber(), parseInt(player2StartingBalance) + parseInt(bet));
        });
    });

    it("should be a player1 win when player1 plays SCISSORS and player2 plays PAPER", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(2, 1);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), parseInt(player1StartingBalance) + parseInt(bet));
            assert.equal(web3.eth.getBalance(player2).toNumber(), parseInt(player2StartingBalance) - parseInt(bet));
        });
    });

    it("should be a tie and give refund when player1 plays SCISSORS and player2 plays SCISSORS", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(2, 2);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), player1StartingBalance);
            assert.equal(web3.eth.getBalance(player2).toNumber(), player2StartingBalance);
        });
    });

    it("should be invalid and give refund when player1 plays SCISSORS and player2 plays invalid", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(2, 11);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), player1StartingBalance);
            assert.equal(web3.eth.getBalance(player2).toNumber(), player2StartingBalance);
        });
    });

    it("should be invalid and give refund when player1 plays invalid", function () {
        var rps;
        return RockPaperScissors.deployed().then(function(instance) {
            rps = instance;
            return rps.makeBet.sendTransaction({from: player1, value: bet})
        }).then(function () {
            player1StartingBalance = parseInt(web3.eth.getBalance(player1).toNumber()) + parseInt(bet);
            return rps.makeBet.sendTransaction({from: player2, value: bet})
        }).then(function () {
            player2StartingBalance = parseInt(web3.eth.getBalance(player2).toNumber()) + parseInt(bet);
            return rps.play.sendTransaction(5, 0);
        }).then(function(result) {
            assert.equal(web3.eth.getBalance(player1).toNumber(), player1StartingBalance);
            assert.equal(web3.eth.getBalance(player2).toNumber(), player2StartingBalance);
        });
    });

});
