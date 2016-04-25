using System;
using System.Collections.Generic;
using System.Text;

namespace Hammurabi
{
    public class Hammurabi
    {
        public static Random random = new Random();
        public static string INPUT = String.Empty;

        public static int year = 0; // Year
        public static int peopleDied = 0; // People died
        public static int immigrants = 0; // Immigrants
        public static int population = 0; // Population
        public static int acres = 0; // Acres
        public static int yield = 0; // Yield
        public static int eaten = 0; // Eaten
        public static int stored = 0; // In store
        public static int randomYearlyModifier = 0; // Random yearly yield modifier
        public static int input = 0; // Input
        public static int died = 0; // Died
        public static float percentPopDied;
        public static int harvest;

        public static int acresBought;
        public static int bushelsFed;
        public static int acresPlanted;

        public class InputModel
        {
            public int Year { get; set; }
            public int AcresBought { get; set; }
            public int BushelsFed { get; set; }
            public int AcresPlanted { get; set; }

            public OutputModel LastYear { get; set; }
        }

        public class OutputModel
        {
            public int Year { get; set; }
            public int PeopleDied { get; set; } // Diff between this and Died?
            public int Immigrants { get; set; }
            public int Population { get; set; }
            public int Acres { get; set; }
            public int Yield { get; set; }
            public int Eaten { get; set; }
            public int Stored { get; set; }
            public int RandState { get; set; }
            public int Died { get; set; }
            public int Harvest { get; set; }
            public float PercentDied { get; set; }
            public float AcresPerPerson { get; set; }

            public bool HadPlague { get; set; }
            public int WillHavePlagueFlag { get; set; }

            public OutputModel Clone()
            {
                return (OutputModel)this.MemberwiseClone();
            }

            public string Report
            {
                get
                {
                    var sb = new StringBuilder();
                    sb.AppendLine("HAMURABI:  I BEG TO REPORT TO YOU,");
                    sb.AppendLine("IN YEAR " + year.ToString() + ", " + peopleDied.ToString() + " PEOPLE STARVED, " + immigrants.ToString() + " CAME TO THE CITY.");
                    if (HadPlague) sb.AppendLine("A HORRIBLE PLAGUE STRUCK!  HALF THE PEOPLE DIED.");
                    sb.AppendLine("POPULATION IS NOW " + population.ToString());
                    sb.AppendLine("THE CITY NOW OWNS " + acres.ToString() + " ACRES.");
                    sb.AppendLine("YOU HARVESTED " + yield.ToString() + " BUSHELS PER ACRE.");
                    sb.AppendLine("RATS ATE " + eaten.ToString() + " BUSHELS.");
                    sb.AppendLine("YOU NOW HAVE " + stored.ToString() + " BUSHELS IN STORE.");
                    sb.AppendLine();
                    return sb.ToString();
                }
            }
        }

        public static OutputModel Initial()
        {
            return new OutputModel()
            {
                Year = 1,
                Died = 0,
                PercentDied = 0,
                Population = 95,
                Stored = 2800,
                Harvest = 3000,
                Eaten = 200,
                Yield = 3,
                Acres = 100,
                Immigrants = 5,
                PeopleDied = 0,

                WillHavePlagueFlag = 1
            };
        }

        private static object PlayHammurabi(InputModel cmd)
        {
            var last = cmd.LastYear;
            var next = new OutputModel()
                {
                    Year = last.Year + 1,
                    Population = last.Population + last.Immigrants
                };
            bool isValid;
        _227: if (last.WillHavePlagueFlag <= 0)
            {
                next.Population = next.Population / 2;
                next.HadPlague = true;
            }
        _270: if (year >= 11) EndGame();
        _310: randomYearlyModifier = random.Next(0, 11);
            yield = randomYearlyModifier + 17;
        _312: Console.WriteLine("LAND IS TRADING AT " + yield.ToString() + " BUSHELS PER ACRE.");
            do
            {
                Console.Write("HOW MANY ACRES DO YOU WISH TO BUY? ");
                INPUT = Console.ReadLine();
                input = Convert.ToInt32(INPUT);
                if (input < 0) return LoseOnStewardQuite();
                isValid = (yield * input <= stored);
                if (!isValid) _710();
            } while (!isValid);
        _330: if (input != 0)
            {
            _331:
                acres = acres + input;
                stored = stored - yield * input;
                randomYearlyModifier = 0;
            }
            else
            {
                do
                {
                _340:
                    Console.Write("HOW MANY ACRES DO YOU WISH TO SELL? ");
                _341:
                    INPUT = Console.ReadLine();
                    input = Convert.ToInt32(INPUT);
                    if (input < 0) return LoseOnStewardQuite();
                    isValid = input >= acres;
                    if (!isValid) _720();
                } while (!isValid);
            _350: acres = acres - input;
                stored = stored + yield * input;
                randomYearlyModifier = 0;
            }
            do
            {
                Console.Write("HOW MANY BUSHELS DO YOU WISH TO FEED YOUR PEOPLE? ");
                INPUT = Console.ReadLine();
                input = Convert.ToInt32(INPUT);
                if (input < 0) return LoseOnStewardQuite();
                isValid = input <= stored;
                if (!isValid) _710();
            } while (!isValid);
        _430: stored = stored - input;
            randomYearlyModifier = 1;
            Console.WriteLine();
            do
            {

            _440:
                Console.Write("HOW MANY ACRES DO YOU WISH TO PLANT WITH SEED? ");
            _441:
                INPUT = Console.ReadLine();
                peopleDied = Convert.ToInt32(INPUT);
                if (peopleDied == 0) goto _511;
            _442:
                if (peopleDied < 0) return LoseOnStewardQuite();
                isValid = peopleDied <= acres; //Plant more than own
                if (!isValid) { _720(); continue; }
                isValid = (((int)(peopleDied / 2)) < stored); //Enought grain for seed
                if (!isValid) { _710(); continue; }
                isValid = peopleDied < 10 * population; //Enough people to tend crops?
                if (!isValid)
                {
                    Console.WriteLine("BUT YOU HAVE ONLY " + population.ToString() +
                                      " PEOPLE TO TEND THE FIELDS. NOW THEN,");
                }
            } while (!isValid);
        _510: stored = stored - (int)(peopleDied / 2);
        _511: rerand();
        _512: ; // REM *** A BOUNTYFULL HARVEST!!
        _515: yield = randomYearlyModifier;
            harvest = peopleDied * yield;
            eaten = 0;
        _521: rerand();
        _522: if (((int)(randomYearlyModifier / 2)) == (randomYearlyModifier / 2))
            {
            _523: ; // REM *** THE RATS ARE RUNNING WILD!!
            _525: eaten = (int)(stored / randomYearlyModifier);
            }
        _530: stored = stored - eaten + harvest;
        _531: rerand();
        _532: ; // REM *** LET'S HAVE SOME BABIES
        _533: immigrants = (int)(randomYearlyModifier * (20 * acres + stored) / population / 100 + 1);
        _539: ; // REM *** HOW MANY PEOPLE HAD FULL TUMMIES?
        _540: randomYearlyModifier = (int)(input / 20);
        _541: ; // REM *** HORRORS, A 15% CHANCE OF PLAGUE
        _542: input = (int)(10 * (2 * random.NextDouble() - .3));
        _550: if (population < randomYearlyModifier) goto _210;
        _551: ; // REM *** STARVE ENOUGH FOR IMPEACHMENT?
        _552: peopleDied = population - randomYearlyModifier;
            if (peopleDied > .45 * population) return Lose("YOU STARVED " + peopleDied.ToString() + " PEOPLE IN ONE YEAR!!!");
        _553: percentPopDied = ((year - 1) * percentPopDied + peopleDied * 100 / population) / year;
        _555: population = randomYearlyModifier;
            died = died + peopleDied;
            return null; //Next year
        }

        private static EndGameMessage LoseOnStewardQuite()
        {
            var sb = new StringBuilder();
            sb.AppendLine("HAMURABI:  I CANNOT DO WHAT YOU WISH.");
            sb.AppendLine("GET YOURSELF ANOTHER STEWARD!!!!!");
            sb.AppendLine("SO LONG FOR NOW.");
            return new EndGameMessage
                {
                    Message = sb.ToString(),
                    Ranking = EndGameRanking.Lost
                };
        }
        private static EndGameMessage Lose(string message = "")
        {
            var sb = new StringBuilder(message);
            sb.AppendLine("DUE TO THIS EXTREME MISMANAGEMENT YOU HAVE NOT ONLY");
            sb.AppendLine("BEEN IMPEACHED AND THROWN OUT OF OFFICE BUT YOU HAVE");
            sb.AppendLine("ALSO BEEN DECLARED 'NATIONAL FINK' !!");
            sb.AppendLine("SO LONG FOR NOW.");
            return new EndGameMessage
                {
                    Message = sb.ToString(),
                    Ranking = EndGameRanking.Lost
                };
        }

        private static EndGameMessage EndGame()
        {
            var sb = new StringBuilder();
            sb.AppendLine("IN YOUR 10-YEAR TERM OF OFFICE, " + percentPopDied.ToString() + " PERCENT OF THE");
            sb.AppendLine("POPULATION STARVED PER YEAR ON AVERAGE, I.E., A TOTAL OF");
            sb.AppendLine(died.ToString() + " PEOPLE DIED!!");
            var acresPerPerson = acres / population;
            sb.AppendLine("YOU STARTED WITH 10 ACRES PER PERSON AND ENDED WITH");
            sb.AppendLine(acresPerPerson.ToString() + " ACRES PER PERSON.");
            sb.AppendLine();

            if (percentPopDied > 33 || acresPerPerson < 7) return Lose(sb.ToString());
            EndGameRanking ranking;
            if (percentPopDied > 10 || acresPerPerson < 9)
            {
                sb.AppendLine("YOUR HEAVY-HANDED PERFORMANCE SMACKS OF NERO AND IVAN IV.");
                sb.AppendLine("THE PEOPLE (REMAINING) FIND YOU AN UNPLEASANT RULER, AND,");
                sb.AppendLine("FRANKLY, HATE YOUR GUTS!");
                ranking = EndGameRanking.Nero;
            }
            else if (percentPopDied > 3 || acresPerPerson < 10)
            {
                sb.AppendLine("YOUR PERFORMANCE COULD HAVE BEEN SOMEWHAT BETTER, BUT");
                sb.Append("REALLY WASN'T TOO BAD AT ALL. ");
                sb.Append(((int)(population * .8 * random.NextDouble())).ToString() + " PEOPLE WOULD");
                sb.AppendLine("DEARLY LIKE TO SEE YOU ASSASSINATED BUT WE ALL HAVE OUR");
                sb.AppendLine("TRIVIAL PROBLEMS.");
                ranking = EndGameRanking.Ok;
            }
            else
            {
                sb.AppendLine("A FANTASTIC PERFORMANCE!!!  CHARLEMANGE, DISRAELI, AND");
                sb.AppendLine("JEFFERSON COMBINED COULD NOT HAVE DONE BETTER!");
                ranking = EndGameRanking.Jefferson;
            }
            sb.AppendLine("SO LONG FOR NOW.");
            return new EndGameMessage
                {
                    Message = sb.ToString(),
                    Ranking = ranking
                };
        }

        public class EndGameMessage
        {
            public EndGameRanking Ranking { get; set; }
            public string Message { get; set; }
        }

        public enum EndGameRanking
        {
            Lost,
            Nero,
            Ok,
            Jefferson,
        }

        private static void rerand()
        {
        _800:
            randomYearlyModifier = (int)(random.NextDouble() * 5) + 1;
        _801: return;
        }

        private static void _720()
        {
        _720:
            Console.WriteLine("HAMURABI:  THINK AGAIN. YOU OWN ONLY " + acres.ToString() + " ACRES.  NOW THEN,");
        _730: return;
        }

        private static void _710()
        {
            Console.WriteLine("HAMURABI:  THINK AGAIN. YOU HAVE ONLY");
            Console.WriteLine(stored.ToString() + " BUSHELS OF GRAIN.  NOW THEN,");
        }
    }
}

