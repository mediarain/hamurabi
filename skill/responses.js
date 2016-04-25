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
        "Buy": { say: "You're buying {buyAcres}." },
        "Feed": { say: "You're feeding {feedPeople}." },
        "FeedEveryone": { say: "You're feeding everyone and have {bushelsLeft}." },
        "FeedRest": { say: "With the rest of your bushels, you feed {feedPeople}. {starvePeople} will starve." },
        "FeedNoOne": { say: "Feed no one my lord! Your subjects will not stand for such tyranny." },
        "Plant": { say: "You're planting {plantAcres}." },
        "PlantAll": { say: "You're planting all {plantAcres} and have {bushelsLeft}." },
        "PlantRest": { say: "With the rest of your bushels, you plant {plantAcres}." },
      },
      "Errors": {
        "Buy": {
          "InsufficientBushels": { say: "The coffers can't support that. The most you could buy is {mostCanBuyAcres}. You've got {bushelsUnused}." },
          "InsufficientBushelsWithCommand": { say: "The years plan is over stretched. "+
            "Since you're using {plantBushels} for seed, and {feedBushels} to feed your people, " +
            "The most you could buy is {mostCanBuyAcres} acres. You've got {bushelsUnused}." },
          "ExcessiveAcres": { say: "You don't have {sellAcres} to sell. You've only have {acres}." },
          "ExcessiveAcresWithCommand": { say: "Since you're planting {plantAcres} the most you could sell is {mostCanSellAcres} of the {acres} you have." },
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
    "Welcome": {
      say: "Welcome to your kingdom."
    },
    "Report": {
      ask: "{kingdomStatus}\n"
    },
    "FinalReport": {
      tell: "{finalKingdomStatus}\n"
    },
    "Ok": {
      ask: "Ok. Next action?"
    },
  };
}();
module.exports = responses;
