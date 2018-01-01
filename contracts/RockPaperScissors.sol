pragma solidity ^0.4.0;


contract RockPaperScissors {

    uint8 public constant ROCK = 0;
    uint8 public constant PAPER = 1;
    uint8 public constant SCISSORS = 2;

    event Win(address winner, uint256 bid, uint winnings, uint8 player1Played, uint8 played2Played);
    event Tie(uint256 bid, uint8 player1Played, uint8 played2Played);
    event Invalid(uint256 bid, uint8 player1Played, uint8 played2Played);

    function play (address player1, address player2, uint8 player1Played, uint8 player2Played, uint256 bid) public {
        if (player1Played == ROCK) {
            if (player2Played == ROCK) {
                settleTie(player1, player2, bid, player1Played, player2Played);
            } else if (player2Played == PAPER) {
                giveWinnings(player2, bid, player1Played, player2Played);
            } else if (player2Played == SCISSORS) {
                giveWinnings(player1, bid, player1Played, player2Played);
            } else {
                handleInvalidInput(player1, player2, bid, player1Played, player2Played);
            }
        } else if (player1Played == PAPER) {
            if (player2Played == ROCK) {
                giveWinnings(player1, bid, player1Played, player2Played);
            } else if (player2Played == PAPER) {
                settleTie(player1, player2, bid, player1Played, player2Played);
            } else if (player2Played == SCISSORS) {
                giveWinnings(player2, bid, player1Played, player2Played);
            } else {
                handleInvalidInput(player1, player2, bid, player1Played, player2Played);
            }
        } else if (player1Played == SCISSORS) {
            if (player2Played == ROCK) {
                giveWinnings(player2, bid, player1Played, player2Played);
            } else if (player2Played == PAPER) {
                giveWinnings(player1, bid, player1Played, player2Played);
            } else if (player2Played == SCISSORS) {
                settleTie(player1, player2, bid, player1Played, player2Played);
            } else {
                handleInvalidInput(player1, player2, bid, player1Played, player2Played);
            }
        } else {
            handleInvalidInput(player1, player2, bid, player1Played, player2Played);
        }
    }

    function getBalance(address player) public view returns (uint256) {
        return player.balance;
    }

    function giveWinnings(address winner, uint256 bid, uint8 player1Played, uint8 player2Played) internal {
        var winnings = getWinnings(bid);
        Win(winner, bid, winnings, player1Played, player2Played);
        winner.transfer(winnings);
    }

    function settleTie(address player1, address player2, uint256 bid, uint8 player1Played, uint8 player2Played) internal {
        Tie(bid, player1Played, player2Played);
        giveRefund(player1, player2, bid);
    }

    function handleInvalidInput(address player1, address player2,  uint256 bid, uint8 player1Played, uint8 player2Played) internal {
        Invalid(bid, player1Played, player2Played);
        giveRefund(player1, player2, bid);
    }

    function giveRefund(address player1, address player2, uint256 bid) internal {
        player1.transfer(bid);
        player2.transfer(bid);
    }

    function getWinnings(uint256 bid) internal pure returns (uint) {
        return bid * 2;
    }
}
