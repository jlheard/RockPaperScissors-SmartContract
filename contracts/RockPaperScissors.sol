pragma solidity ^0.4.0;


contract RockPaperScissors {

    uint8 public constant ROCK = 0;
    uint8 public constant PAPER = 1;
    uint8 public constant SCISSORS = 2;

    uint public player1Bet = 0;
    uint public player2Bet = 0;

    address public player1 = address(0);
    address public player2 = address(0);

    bool public gameFull = false;
    bool public bidsReady = false;

    event Win(uint _player1bet, uint _player2bet, address winner, uint winnings, uint8 player1Played, uint8 played2Played);
    event Tie(uint _player1bet, uint _player2bet, uint8 player1Played, uint8 played2Played);
    event Invalid(uint _player1bet, uint _player2bet, uint8 player1Played, uint8 played2Played);
    event Player1Added(address player);
    event Player2Added(address player);
    event GameFull(address player1, address player2);
    event NeedTwoPlayersToPlay(address player1, address player2);
    event NeedTwoBetsToPlay(uint _player1Bet, uint _player2Bet);
    event PlayerMakesBet(address player, uint bet);
    event UnknownPlayer(address unknown);
    event GameAborted();
    event GameReset();

    function addPlayer() public {
        if(!gameFull) {
            if(player1 == address(0)) {
                player1 = msg.sender;
                Player1Added(player1);
            } else if (player2 == address(0)) {
                player2 = msg.sender;
                Player2Added(player2);
                gameFull = true;
                GameFull(player1, player2);
            }
        } else {
            GameFull(player1, player2);
            selfdestruct(msg.sender);
        }
    }

    function makeBet() public payable {
        if(msg.sender == player1) {
            player1Bet = msg.value;
            PlayerMakesBet(player1, player1Bet);
        } else if(msg.sender == player2) {
            player2Bet = msg.value;
            PlayerMakesBet(player2, player2Bet);
            bidsReady = true;
        } else {
            UnknownPlayer(msg.sender);
            selfdestruct(msg.sender);
        }
    }

    function play (uint8 player1Played, uint8 player2Played) public returns (bool) {
        if(!gameFull) {
            NeedTwoPlayersToPlay(player1, player2);
            return false;
        }

        if(!bidsReady) {
            NeedTwoBetsToPlay(player1Bet, player2Bet);
            return false;
        }

        if (player1Played == ROCK) {
            if (player2Played == ROCK) {
                settleTie(player1Played, player2Played);
            } else if (player2Played == PAPER) {
                giveWinnings(player2, player1Played, player2Played);
            } else if (player2Played == SCISSORS) {
                giveWinnings(player1,  player1Played, player2Played);
            } else {
                handleInvalidInput(player1Played, player2Played);
            }
        } else if (player1Played == PAPER) {
            if (player2Played == ROCK) {
                giveWinnings(player1, player1Played, player2Played);
            } else if (player2Played == PAPER) {
                settleTie(player1Played, player2Played);
            } else if (player2Played == SCISSORS) {
                giveWinnings(player2, player1Played, player2Played);
            } else {
                handleInvalidInput(player1Played, player2Played);
            }
        } else if (player1Played == SCISSORS) {
            if (player2Played == ROCK) {
                giveWinnings(player2, player1Played, player2Played);
            } else if (player2Played == PAPER) {
                giveWinnings(player1, player1Played, player2Played);
            } else if (player2Played == SCISSORS) {
                settleTie(player1Played, player2Played);
            } else {
                handleInvalidInput(player1Played, player2Played);
            }
        } else {
            handleInvalidInput(player1Played, player2Played);
        }

        return true;
    }

    function getBalance(address player) public view returns (uint256) {
        return player.balance;
    }

    function abortGame() public {
        GameAborted();
        giveRefund();
        selfdestruct(msg.sender);
    }

    function resetGame() public {
        GameReset();
        player1 = address(0);
        player1Bet = 0;
        player2Bet = 0;
        player2 = address(0);
        gameFull = false;
        bidsReady = false;
    }

    function giveWinnings(address winner, uint8 player1Played, uint8 player2Played) internal {
        uint256 winnings = getWinnings();
        Win(player1Bet, player2Bet, winner, winnings, player1Played, player2Played);
        winner.transfer(winnings);
    }

    function settleTie(uint8 player1Played, uint8 player2Played) internal {
        Tie(player1Bet, player2Bet, player1Played, player2Played);
        giveRefund();
    }

    function handleInvalidInput(uint8 player1Played, uint8 player2Played) internal {
        Invalid(player1Bet, player2Bet, player1Played, player2Played);
        giveRefund();
    }

    function giveRefund() internal {
        player1.transfer(player1Bet);
        player2.transfer(player2Bet);
    }

    function getWinnings() internal view returns (uint) {
        return player1Bet + player2Bet;
    }
}
