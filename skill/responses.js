/* Copyright (C) Crossborders LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Greg Hedges <gregh@rain.agency>, January 2016
 */
'use strict';

var responses = function () {

  return {
    "Errors": {
      General: {
        tell: "Oops, you're empire was destroyed by a freak {accident}. Try again."
      },
      BadLaunch: {
        tell: "I've got no idea what you're trying to do. If you want to play Hammurabi, say Alexa, play Hammurabi"
      },
    },
    "Actions": {
      "Prompt": {
        ask: "What will you do my lord?"
      },
      "PromptMore": {
        ask: "What else will you do my lord?",
        reprompt: "You can use bushels to feed your people, plant land, or buy and sell acres."
      },
      "Validate": {
        "Buy": { say: "You're buying {buyAcres} and have {bushelsLeft}." },
        "Sell": { say: "You're selling {buyAcres} and will have {bushelsLeft}." },
        "BuyWithRest": { say: "With the rest of your bushels, you buy {buyAcres}." },
        "Feed": { say: "You're feeding {feedPeople}." },
        "FeedEveryone": { say: "You're feeding everyone and have {bushelsLeft}." },
        "FeedRest": { say: "With the rest of your bushels, you feed {feedPeople}. {starvePeople} will starve." },
        "FeedNoOne": { say: "Feed no one my lord! Your subjects will not stand for such tyranny." },
        "Plant": { say: "You're planting {plantAcres}." },
        "PlantAll": { say: "You're planting all {plantAcres} and have {bushelsLeft}." },
        "PlantRestWorkersLimited": { say: "You plant {plantAcres}, which is the most you can work with {populationPeople}. You have {bushelsLeft}. " },
        "PlantRestBushelsLimited": { say: "With the rest of your bushels, you plant {plantAcres}." },
        "PlantNothing": { say: "You plant nothing. I fear your foresight master." },
      },
      "Errors": {
        "Buy": {
          "InsufficientBushels": { say: "The coffers can't support that. The most you could buy is {mostCanBuyAcres}. You've got {bushelsUnused}." },
          "InsufficientBushelsWithCommand": { say: "The years plan is over stretched. "+
            "Since you're using {plantBushels} for seed, and {feedBushels} to feed your people, " +
            "The most you could buy is {mostCanBuyAcres}. You've got {bushelsUnused}." },
        },
        "Sell": {
          "ExcessiveAcres": { say: "You don't have {attemptedSellAcres} to sell. You've only have {acres}." },
          "ExcessiveAcresWithCommand": { say: "Since you're planting {plantAcres} the most you could sell is {mostCanSellAcres} of the {acres} you have." },
          "InsufficientBushelsWithCommand": { say: "Since you're using {plantBushels} for seed, and {feedBushels} to feed your people, " +
            "and you only have {bushels}, " +
            "you must sell at least {leastCanSellAcres}." },
        },
        "BuyWithRest": {
          "InsufficientBushels": { say: "You can't afford even a single acre of land with your {bushelsRemaining}." },
        },
        "FeedEveryone": {
          say: "My Lord! There aren't enough bushels left to feed anyone!"
        },
        "Feed": {
          "Negative": { say: "HAMURABI: I CANNOT DO WHAT YOU WISH." },
          "InsufficientBushels": { say: "The coffers can't support that. The most you could feed is {mostCanFeedPeople} with your {bushelsUnused}." },


          "InsufficientBushelsWithCommand": { say: "HAMURABI, Your reach exceeds your grasp. "+
            "Since you're using {plantBushels} for seed, " +
            "the most you could feed is {mostCanFeedPeople} with your {bushelsUnused}." },
          "InsufficientBushelsWithCommandWithBuy": { say: "HAMURABI, Your reach exceeds your grasp. "+
            "Since you're using {plantBushels} for seed and {buyBushels} to buy {buyAcres}, " +
            "the most you could feed is {mostCanFeedPeople} with your {bushelsUnused}." },
          "InsufficientBushelsWithCommandWithSell": { say: "HAMURABI, Your reach exceeds your grasp. "+
            "Since you're using {plantBushels} for seed and gaining {sellBushels} by selling {sellAcres}, " +
            "the most you could feed is {mostCanFeedPeople} with your {bushelsUnused}." },
        },
        "Plant": {
          "Negative": { say: "HAMURABI: I CANNOT DO WHAT YOU WISH." },
          "InsufficientBushels": { say: "The coffers can't support that. The most you could plant is {mostCanPlantAcres} with your {bushelsUnused}." },
          "InsufficientBushelsWithCommand": { say: "HAMURABI, Your reach exceeds your grasp. "+
            "Since you're using {feedBushels} as food, " +
            "the most you could plant is {mostCanPlantBushels} with your {bushelsUnused}." },
          "InsufficientBushelsWithCommandBuy": { say: "HAMURABI, Your reach exceeds your grasp. "+
            "Since you're using {feedBushels} as food and {buyBushels} to buy land, " +
            "the most you could plant is {mostCanPlantBushels} with your {bushelsUnused}." },
          "InsufficientBushelsWithCommandSell": { say: "HAMURABI, Your reach exceeds your grasp. "+
            "Since you're using {feedBushels} as food and gaining {sellBushels} by selling land, " +
            "the most you could plant is {mostCanPlantBushels} with your {bushelsUnused}." },
          "InsufficientPeople": { say: "HAMURABI, You only have {populationPeople} to tend your fields. "+
            "The most you could plant is {mostCanPlantAcres} with your {bushelsUnused}." },
        }
      }
    },
    "Welcome": { say: "Welcome to your kingdom." },
    "Cancel": { say: "Ok. I've cleared you plans for this year." },
    "Wait": { say: "Ok. I'll give you a second to think it over. <break time=\"10s\"/>" },
    "StartOverQuery": {
       ask: "Not going so great? Do you want to start over?",
       reprompt: "Do you want to start over?",
    },
    "StartOver": { say: "Running a kingdom is harder than it sounds. Let's try again." },
    "ExitQuery": {
       ask: "Exit? Are you a coward? Would you abandon your people?",
       reprompt: "Do you want to exit Hammurabi?",
    },
    "Goodbye": { tell: "You sneak out the palace's back door to avoid the mobs. At least you saved yourself." },
    "Report": {
      ask: "{kingdomStatus}\nWhat will you do my lord?",
      reprompt: "What will you do my lord?"
    },
    "FinalReport": { tell: "{finalKingdomStatus}\n" },
    "Help": {
      "ExplainActions": {
        say: "You can plant acres of land by saying \"Plant {mostCanPlantAcres}\". " +
             "Or you can feed your people by saying \"Feed {mostCanFeedPeople}\". " +
             "Or you can sell land by saying \"Sell {mostCanSellAcres}\". " +
             "Or you can buy land by saying \"Buy {mostCanBuyAcres}\". " +
             "Or you can move on to the next year by saying \"go to the next year\". " +
             "Be sure to feed your people and plant food for the next year."
      },
      "ExplainGame": {
        say: "Hammurabi is one of the first games made for terminal computers. " +
          "In Hammurabi you manage a kingdom and se \n" +
          "Do want to give it a try?"
      }
    },
    "Query": {
      "Actions": { say: "{commandStatus}.", },
      "AcresCost": { say: "Land costs {acresCost} per acre. With {bushelsUnused} you can afford to buy up to {mostCanBuyAcres}.", },
      "Acres": { say: "You have {acres}.", },
      "Population": { say: "You have {populationPeople} in your kingdom.", },
    }
  };
}();
module.exports = responses;
