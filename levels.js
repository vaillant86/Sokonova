/**
 * SOKONOVA LEVELS
 *
 * This file only contains the level list.
 * It is loaded before game.js.
 * The block between the markers is managed by generate_levels.py; do not edit it manually.
 */

const levels = [
    // Level 1 - Tutorial T0 (fixed, score: 5)
    {
        score: 5,
        minPushes: 4,
        map: [
            "######",
            "#   .#",
            "# $$.#",
            "# @  #",
            "######"
        ]
    },
    // Level 2 - Tutorial T1 (fixed, score: 5)
    {
        score: 5,
        minPushes: 10,
        map: [
            "##########",
            "# $+*    #",
            "#  *.* $ #",
            "# ###    #",
            "#        #",
            "#        #",
            "#        #",
            "##########"
        ]
    },
    // Level 3 (score: 79, challenge: traffic, minimum 12 pushes)
    {
        score: 79,
        challenge: "traffic",
        minPushes: 12,
        map: [
            "#########",
            "#  #    #",
            "#  @$   #",
            "# $#   .#",
            "#  #   .#",
            "#########"
        ]
    },
    // Level 4 (score: 84, challenge: traffic, minimum 12 pushes)
    {
        score: 84,
        challenge: "traffic",
        minPushes: 12,
        map: [
            "########",
            "###  ###",
            "# $    #",
            "#.   $@#",
            "#. $   #",
            "#.     #",
            "###  ###",
            "########"
        ]
    },
    // Level 5 (score: 88, challenge: traffic, minimum 12 pushes)
    {
        score: 88,
        challenge: "traffic",
        minPushes: 12,
        map: [
            "##########",
            "#. @.$   #",
            "# $$## $ #",
            "#   ##   #",
            "# .      #",
            "#   .    #",
            "##########"
        ]
    },
    // Level 6 (score: 92, challenge: traffic, minimum 13 pushes)
    {
        score: 92,
        challenge: "traffic",
        minPushes: 13,
        map: [
            "########",
            "###   .#",
            "###  ..#",
            "# $$ $ #",
            "#    @ #",
            "########"
        ]
    },
    // Level 7 (score: 92, challenge: traffic, minimum 15 pushes)
    {
        score: 92,
        challenge: "traffic",
        minPushes: 15,
        map: [
            "##########",
            "#     ####",
            "#  $ $####",
            "#   $@ $ #",
            "#....    #",
            "##########"
        ]
    },
    // Level 8 (score: 96, challenge: traffic, minimum 16 pushes)
    {
        score: 96,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "##########",
            "#      @ #",
            "# $    $ #",
            "####$   .#",
            "####   ..#",
            "##########"
        ]
    },
    // Level 9 (score: 96, challenge: traffic, minimum 18 pushes)
    {
        score: 96,
        challenge: "traffic",
        minPushes: 18,
        map: [
            "##########",
            "# ... # .#",
            "# $   #  #",
            "# $   #  #",
            "#  $  #  #",
            "# $@     #",
            "#     #  #",
            "##########"
        ]
    },
    // Level 10 [BOSS] (score: 109, challenge: traffic, minimum 20 pushes)
    {
        score: 109,
        challenge: "traffic",
        minPushes: 20,
        map: [
            "#########",
            "#   # # #",
            "#.  #   #",
            "#.  #   #",
            "#.$$ $  #",
            "# @ #   #",
            "#########"
        ]
    },
    // Level 11 (score: 97, challenge: traffic, minimum 14 pushes)
    {
        score: 97,
        challenge: "traffic",
        minPushes: 14,
        map: [
            "########",
            "#....$ #",
            "#   $  #",
            "#    $@#",
            "#   $  #",
            "###    #",
            "###    #",
            "########"
        ]
    },
    // Level 12 (score: 97, challenge: traffic, minimum 15 pushes)
    {
        score: 97,
        challenge: "traffic",
        minPushes: 15,
        map: [
            "##########",
            "#        #",
            "#   @$   #",
            "#   ##  .#",
            "#   ##  .#",
            "# # $ $ .#",
            "#      # #",
            "##########"
        ]
    },
    // Level 13 (score: 97, challenge: traffic, minimum 16 pushes)
    {
        score: 97,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "#########",
            "#  ##   #",
            "#@$ # # #",
            "##  # # #",
            "#.$.*   #",
            "#   #   #",
            "#########"
        ]
    },
    // Level 14 (score: 97, challenge: traffic, minimum 17 pushes)
    {
        score: 97,
        challenge: "traffic",
        minPushes: 17,
        map: [
            "#########",
            "#.      #",
            "#..   $@#",
            "#   # $ #",
            "#   #$  #",
            "#       #",
            "#       #",
            "#########"
        ]
    },
    // Level 15 (score: 98, challenge: traffic, minimum 12 pushes)
    {
        score: 98,
        challenge: "traffic",
        minPushes: 12,
        map: [
            "##########",
            "####    ##",
            "####$ ####",
            "#  @     #",
            "#. $$.   #",
            "#.  #    #",
            "#.$      #",
            "##########"
        ]
    },
    // Level 16 (score: 98, challenge: traffic, minimum 14 pushes)
    {
        score: 98,
        challenge: "traffic",
        minPushes: 14,
        map: [
            "########",
            "###..###",
            "###..###",
            "# $    #",
            "#   $$ #",
            "#   @$ #",
            "#      #",
            "########"
        ]
    },
    // Level 17 (score: 99, challenge: traffic, minimum 13 pushes)
    {
        score: 99,
        challenge: "traffic",
        minPushes: 13,
        map: [
            "#########",
            "##    ###",
            "#    ####",
            "#  $    #",
            "#   @$  #",
            "#  $    #",
            "#   #...#",
            "#########"
        ]
    },
    // Level 18 (score: 99, challenge: traffic, minimum 15 pushes)
    {
        score: 99,
        challenge: "traffic",
        minPushes: 15,
        map: [
            "#########",
            "#    ####",
            "# $  ####",
            "# $     #",
            "#   @$  #",
            "#  # ...#",
            "#########"
        ]
    },
    // Level 19 (score: 100, challenge: traffic, minimum 12 pushes)
    {
        score: 100,
        challenge: "traffic",
        minPushes: 12,
        map: [
            "#########",
            "###...###",
            "#@$     #",
            "#    #$ #",
            "# $     #",
            "###   ###",
            "#########"
        ]
    },
    // Level 20 [BOSS] (score: 115, challenge: traffic, minimum 22 pushes)
    {
        score: 115,
        challenge: "traffic",
        minPushes: 22,
        map: [
            "###########",
            "####   ####",
            "# $   #   #",
            "# $   $.  #",
            "#@$    ...#",
            "#### # ####",
            "###########"
        ]
    },
    // Level 21 (score: 100, challenge: traffic, minimum 14 pushes)
    {
        score: 100,
        challenge: "traffic",
        minPushes: 14,
        map: [
            "##########",
            "# .      #",
            "#   $  ..#",
            "#  $$@$  #",
            "#  #    .#",
            "##########"
        ]
    },
    // Level 22 (score: 100, challenge: traffic, minimum 16 pushes)
    {
        score: 100,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "########",
            "#      #",
            "# $    #",
            "# $#   #",
            "#@$   .#",
            "# #  ..#",
            "########"
        ]
    },
    // Level 23 (score: 101, challenge: traffic, minimum 12 pushes)
    {
        score: 101,
        challenge: "traffic",
        minPushes: 12,
        map: [
            "#########",
            "####@   #",
            "####$ $ #",
            "#     $##",
            "# . ..  #",
            "#########"
        ]
    },
    // Level 24 (score: 106, challenge: traffic, minimum 16 pushes)
    {
        score: 106,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "##########",
            "#   #    #",
            "#   ## $ #",
            "#      @##",
            "# $ #. $ #",
            "#   #.   #",
            "#   #.   #",
            "##########"
        ]
    },
    // Level 25 (score: 106, challenge: traffic, minimum 18 pushes)
    {
        score: 106,
        challenge: "traffic",
        minPushes: 18,
        map: [
            "#########",
            "#   #   #",
            "# $ #   #",
            "#  @$   #",
            "# $ #   #",
            "# $.#   #",
            "#...#   #",
            "#########"
        ]
    },
    // Level 26 (score: 107, challenge: traffic, minimum 17 pushes)
    {
        score: 107,
        challenge: "traffic",
        minPushes: 17,
        map: [
            "##########",
            "# #   #  #",
            "#  $   ..#",
            "#      *.#",
            "#@$      #",
            "###  $ ###",
            "###    ###",
            "##########"
        ]
    },
    // Level 27 (score: 108, challenge: traffic, minimum 15 pushes)
    {
        score: 108,
        challenge: "traffic",
        minPushes: 15,
        map: [
            "##########",
            "##  ..  ##",
            "#    .#$ #",
            "# $     ##",
            "#        #",
            "#   $@   #",
            "##      ##",
            "##########"
        ]
    },
    // Level 28 (score: 109, challenge: traffic, minimum 14 pushes)
    {
        score: 109,
        challenge: "traffic",
        minPushes: 14,
        map: [
            "##########",
            "####  ####",
            "####  ####",
            "#..      #",
            "#.*$   $##",
            "# @$     #",
            "#        #",
            "##########"
        ]
    },
    // Level 29 (score: 109, challenge: traffic, minimum 16 pushes)
    {
        score: 109,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "#########",
            "# ...#  #",
            "#     $@#",
            "#    #  #",
            "# $  #$ #",
            "# #  #  #",
            "#########"
        ]
    },
    // Level 30 [BOSS] (score: 122, challenge: traffic, minimum 17 pushes)
    {
        score: 122,
        challenge: "traffic",
        minPushes: 17,
        map: [
            "##########",
            "#        #",
            "#    #   #",
            "# $ ## ..#",
            "#  $@$*. #",
            "#        #",
            "##########"
        ]
    },
    // Level 31 (score: 110, challenge: traffic, minimum 16 pushes)
    {
        score: 110,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "########",
            "# ##   #",
            "#  #  .#",
            "#  #$..#",
            "# $$@$.#",
            "#      #",
            "########"
        ]
    },
    // Level 32 (score: 111, challenge: traffic, minimum 15 pushes)
    {
        score: 111,
        challenge: "traffic",
        minPushes: 15,
        map: [
            "##########",
            "###    ###",
            "###    ###",
            "#  $   $ #",
            "#   $  $@#",
            "###  ..###",
            "###  ..###",
            "##########"
        ]
    },
    // Level 33 (score: 111, challenge: traffic, minimum 16 pushes)
    {
        score: 111,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "##########",
            "#..      #",
            "#..$  $  #",
            "#  $ @$  #",
            "#  ##    #",
            "#  ###   #",
            "#    #   #",
            "##########"
        ]
    },
    // Level 34 (score: 111, challenge: traffic, minimum 18 pushes)
    {
        score: 111,
        challenge: "traffic",
        minPushes: 18,
        map: [
            "##########",
            "#  @     #",
            "#  $$  $ #",
            "#     #  #",
            "#    ##.*#",
            "#  #   ..#",
            "##########"
        ]
    },
    // Level 35 (score: 112, challenge: traffic, minimum 16 pushes)
    {
        score: 112,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "##########",
            "#  # #   #",
            "#   $ $  #",
            "#        #",
            "#   @$  .#",
            "#       .#",
            "#  #    .#",
            "##########"
        ]
    },
    // Level 36 (score: 114, challenge: traffic, minimum 15 pushes)
    {
        score: 114,
        challenge: "traffic",
        minPushes: 15,
        map: [
            "########",
            "#   @  #",
            "#  $$  #",
            "#  $   #",
            "#  $ . #",
            "#   ...#",
            "########"
        ]
    },
    // Level 37 (score: 114, challenge: traffic, minimum 17 pushes)
    {
        score: 114,
        challenge: "traffic",
        minPushes: 17,
        map: [
            "##########",
            "#.       #",
            "#.  $    #",
            "#. #     #",
            "#  @$ $  #",
            "###    ###",
            "###    ###",
            "##########"
        ]
    },
    // Level 38 (score: 114, challenge: traffic, minimum 20 pushes)
    {
        score: 114,
        challenge: "traffic",
        minPushes: 20,
        map: [
            "#########",
            "##  #   #",
            "#   $@  #",
            "#   #.$ #",
            "# $ #.  #",
            "#   #.  #",
            "#########"
        ]
    },
    // Level 39 (score: 114, challenge: traffic, minimum 22 pushes)
    {
        score: 114,
        challenge: "traffic",
        minPushes: 22,
        map: [
            "###########",
            "#         #",
            "#       $ #",
            "#   ### $ #",
            "#   ##  $##",
            "# $       #",
            "#        .#",
            "# @    ...#",
            "###########"
        ]
    },
    // Level 40 [BOSS] (score: 126, challenge: traffic, minimum 21 pushes)
    {
        score: 126,
        challenge: "traffic",
        minPushes: 21,
        map: [
            "##########",
            "#     .. #",
            "#   $ .. #",
            "# @$  #  #",
            "# $$  ## #",
            "#        #",
            "##########"
        ]
    },
    // Level 41 (score: 118, challenge: traffic, minimum 15 pushes)
    {
        score: 118,
        challenge: "traffic",
        minPushes: 15,
        map: [
            "#########",
            "#..# #  #",
            "#..$    #",
            "#@$   $ #",
            "# $     #",
            "#  # #  #",
            "#########"
        ]
    },
    // Level 42 (score: 118, challenge: traffic, minimum 17 pushes)
    {
        score: 118,
        challenge: "traffic",
        minPushes: 17,
        map: [
            "#########",
            "#...    #",
            "#*$     #",
            "#  #  $ #",
            "#  $    #",
            "###@  ###",
            "###   ###",
            "#########"
        ]
    },
    // Level 43 (score: 118, challenge: traffic, minimum 18 pushes)
    {
        score: 118,
        challenge: "traffic",
        minPushes: 18,
        map: [
            "#########",
            "#.      #",
            "#..$  $##",
            "#.###   #",
            "#@$   $ #",
            "#       #",
            "#########"
        ]
    },
    // Level 44 (score: 118, challenge: traffic, minimum 22 pushes)
    {
        score: 118,
        challenge: "traffic",
        minPushes: 22,
        map: [
            "#########",
            "#   #   #",
            "#       #",
            "#  ##  $#",
            "# $ # # #",
            "##  #$  #",
            "#   #+$.#",
            "#   #.*.#",
            "#########"
        ]
    },
    // Level 45 (score: 119, challenge: traffic, minimum 17 pushes)
    {
        score: 119,
        challenge: "traffic",
        minPushes: 17,
        map: [
            "#########",
            "#       #",
            "#.*   $ #",
            "#.. # $ #",
            "#   $@  #",
            "# #     #",
            "#########"
        ]
    },
    // Level 46 (score: 120, challenge: traffic, minimum 17 pushes)
    {
        score: 120,
        challenge: "traffic",
        minPushes: 17,
        map: [
            "##########",
            "#        #",
            "# $   $  #",
            "# $      #",
            "#   $    #",
            "####+.####",
            "####..####",
            "##########"
        ]
    },
    // Level 47 (score: 121, challenge: traffic, minimum 23 pushes)
    {
        score: 121,
        challenge: "traffic",
        minPushes: 23,
        map: [
            "###########",
            "#...      #",
            "# ..      #",
            "# $      ##",
            "#  $     ##",
            "#    $ $ ##",
            "#$  @    ##",
            "#        ##",
            "###########"
        ]
    },
    // Level 48 (score: 121, challenge: traffic, minimum 23 pushes)
    {
        score: 121,
        challenge: "traffic",
        minPushes: 23,
        map: [
            "#########",
            "#   #  ##",
            "# # #$ .#",
            "#   # **#",
            "#   @$. #",
            "#   #   #",
            "#########"
        ]
    },
    // Level 49 (score: 122, challenge: traffic, minimum 17 pushes)
    {
        score: 122,
        challenge: "traffic",
        minPushes: 17,
        map: [
            "#########",
            "#       #",
            "#* $$ $ #",
            "#+ #   ##",
            "#*.#    #",
            "#. #  # #",
            "#  #    #",
            "#########"
        ]
    },
    // Level 50 [BOSS] (score: 136, challenge: traffic, minimum 20 pushes)
    {
        score: 136,
        challenge: "traffic",
        minPushes: 20,
        map: [
            "#########",
            "#..#    #",
            "#.*#    #",
            "#       #",
            "#  #  $ #",
            "#  $@$  #",
            "#  #    #",
            "#########"
        ]
    },
    // Level 51 (score: 122, challenge: traffic, minimum 19 pushes)
    {
        score: 122,
        challenge: "traffic",
        minPushes: 19,
        map: [
            "###########",
            "#     #.* #",
            "#     #.  #",
            "#     #.$ #",
            "# #   #   #",
            "#   @$    #",
            "#  $  #   #",
            "#     #   #",
            "###########"
        ]
    },
    // Level 52 (score: 122, challenge: traffic, minimum 22 pushes)
    {
        score: 122,
        challenge: "traffic",
        minPushes: 22,
        map: [
            "#########",
            "#   #@*.#",
            "#   #$#.#",
            "#   #  .#",
            "#   # $ #",
            "#       #",
            "#   # $ #",
            "#   #   #",
            "#########"
        ]
    },
    // Level 53 (score: 123, challenge: traffic, minimum 16 pushes)
    {
        score: 123,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "##########",
            "#  #     #",
            "#   @$   #",
            "#    $   #",
            "#    $   #",
            "#      $.#",
            "#  # #...#",
            "##########"
        ]
    },
    // Level 54 (score: 123, challenge: traffic, minimum 16 pushes)
    {
        score: 123,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "#########",
            "#...#   #",
            "# *.#  ##",
            "#  $@ # #",
            "# $ $ $ #",
            "#       #",
            "#########"
        ]
    },
    // Level 55 (score: 123, challenge: traffic, minimum 18 pushes)
    {
        score: 123,
        challenge: "traffic",
        minPushes: 18,
        map: [
            "###########",
            "#     #   #",
            "#     # $$#",
            "#   @$    #",
            "# *   #  .#",
            "#.    #  .#",
            "###########"
        ]
    },
    // Level 56 (score: 123, challenge: traffic, minimum 18 pushes)
    {
        score: 123,
        challenge: "traffic",
        minPushes: 18,
        map: [
            "##########",
            "#  # #   #",
            "#      ..#",
            "#  $ $ ..#",
            "# @$  $$.#",
            "#        #",
            "##########"
        ]
    },
    // Level 57 (score: 124, challenge: traffic, minimum 16 pushes)
    {
        score: 124,
        challenge: "traffic",
        minPushes: 16,
        map: [
            "#########",
            "##      #",
            "# $@$ $ #",
            "#  $ .  #",
            "### *.###",
            "### ..###",
            "#########"
        ]
    },
    // Level 58 (score: 125, challenge: traffic, minimum 20 pushes)
    {
        score: 125,
        challenge: "traffic",
        minPushes: 20,
        map: [
            "###########",
            "#   @    .#",
            "#   $   .*#",
            "#    $  ..#",
            "###$  $ ###",
            "###     ###",
            "###########"
        ]
    },
    // Level 59 (score: 125, challenge: traffic, minimum 21 pushes)
    {
        score: 125,
        challenge: "traffic",
        minPushes: 21,
        map: [
            "############",
            "#.    #@   #",
            "#   $ #$   #",
            "# ..  #    #",
            "# .* $  $  #",
            "#     #    #",
            "############"
        ]
    },
    // Level 60 [BOSS] (score: 141, challenge: traffic, minimum 20 pushes)
    {
        score: 141,
        challenge: "traffic",
        minPushes: 20,
        map: [
            "#########",
            "#..     #",
            "#.      #",
            "#* $    #",
            "#     #@#",
            "### $ $ #",
            "### #   #",
            "#########"
        ]
    },
    // Level 61 (score: 127, challenge: traffic, minimum 18 pushes)
    {
        score: 127,
        challenge: "traffic",
        minPushes: 18,
        map: [
            "########",
            "# #    #",
            "# @$   #",
            "#. #   #",
            "#..# $ #",
            "#   $ ##",
            "#      #",
            "########"
        ]
    },
    // Level 62 (score: 129, challenge: traffic, minimum 25 pushes)
    {
        score: 129,
        challenge: "traffic",
        minPushes: 25,
        map: [
            "#########",
            "#@ #    #",
            "#$$     #",
            "#  #    #",
            "#.$#    #",
            "#..# #$ #",
            "#.*#    #",
            "#########"
        ]
    },
    // Level 63 (score: 129, challenge: traffic, minimum 25 pushes)
    {
        score: 129,
        challenge: "traffic",
        minPushes: 25,
        map: [
            "#########",
            "#       #",
            "#   @$$ #",
            "#     $ #",
            "#       #",
            "#.###   #",
            "#.*##   #",
            "#.*#    #",
            "#########"
        ]
    },
    // Level 64 (score: 129, challenge: traffic, minimum 28 pushes)
    {
        score: 129,
        challenge: "traffic",
        minPushes: 28,
        map: [
            "###########",
            "#    #    #",
            "#    #  $ #",
            "#. . #    #",
            "# @ $$    #",
            "# .  #    #",
            "#    #    #",
            "###########"
        ]
    },
    // Level 65 (score: 130, challenge: traffic, minimum 22 pushes)
    {
        score: 130,
        challenge: "traffic",
        minPushes: 22,
        map: [
            "###########",
            "#         #",
            "#       $ #",
            "#   ## $@ #",
            "# *    $  #",
            "#...  #   #",
            "###########"
        ]
    },
    // Level 66 (score: 130, challenge: traffic, minimum 28 pushes)
    {
        score: 130,
        challenge: "traffic",
        minPushes: 28,
        map: [
            "#########",
            "#.  # @ #",
            "#.  # $ #",
            "#  $# $ #",
            "#   #   #",
            "#       #",
            "#   # . #",
            "#########"
        ]
    },
    // Level 67 (score: 132, challenge: traffic, minimum 20 pushes)
    {
        score: 132,
        challenge: "traffic",
        minPushes: 20,
        map: [
            "##########",
            "#..      #",
            "#..  #   #",
            "#  # # $ #",
            "#  $ #   #",
            "#@$$ #   #",
            "#    #   #",
            "##########"
        ]
    },
    // Level 68 (score: 136, challenge: traffic, minimum 19 pushes)
    {
        score: 136,
        challenge: "traffic",
        minPushes: 19,
        map: [
            "########",
            "##.   ##",
            "##.  $##",
            "#.     #",
            "#.     #",
            "##$ $$##",
            "##@   ##",
            "########"
        ]
    },
    // Level 69 (score: 136, challenge: traffic, minimum 20 pushes)
    {
        score: 136,
        challenge: "traffic",
        minPushes: 20,
        map: [
            "#########",
            "# @     #",
            "#    $  #",
            "#  $    #",
            "# $ $  .#",
            "####  ..#",
            "####   .#",
            "#########"
        ]
    },
    // Level 70 [BOSS] (score: 148, challenge: traffic, minimum 24 pushes)
    {
        score: 148,
        challenge: "traffic",
        minPushes: 24,
        map: [
            "#########",
            "#...#   #",
            "#  .# $ #",
            "#  .#$  #",
            "#$$$    #",
            "#@  #   #",
            "#########"
        ]
    },
    // Level 71 (score: 137, challenge: traffic, minimum 22 pushes)
    {
        score: 137,
        challenge: "traffic",
        minPushes: 22,
        map: [
            "###########",
            "#   ## #  #",
            "#      #  #",
            "#     $# *#",
            "#   #  #..#",
            "#   #  # .#",
            "# $@$     #",
            "#   #     #",
            "###########"
        ]
    },
    // Level 72 (score: 137, challenge: traffic, minimum 24 pushes)
    {
        score: 137,
        challenge: "traffic",
        minPushes: 24,
        map: [
            "###########",
            "#         #",
            "#  $ $@$# #",
            "#   ##   .#",
            "# $ ##  ..#",
            "#        .#",
            "#      #  #",
            "###########"
        ]
    },
    // Level 73 (score: 137, challenge: traffic, minimum 25 pushes)
    {
        score: 137,
        challenge: "traffic",
        minPushes: 25,
        map: [
            "###########",
            "#   #   # #",
            "#$$ #. ## #",
            "#+$ #    .#",
            "#*  # #   #",
            "#        ##",
            "#   #     #",
            "#   #    ##",
            "###########"
        ]
    },
    // Level 74 (score: 138, challenge: traffic, minimum 29 pushes)
    {
        score: 138,
        challenge: "traffic",
        minPushes: 29,
        map: [
            "############",
            "#       ####",
            "#       ####",
            "#  @   $ $ #",
            "# .     $  #",
            "#...    $  #",
            "# .$       #",
            "############"
        ]
    },
    // Level 75 (score: 139, challenge: traffic, minimum 22 pushes)
    {
        score: 139,
        challenge: "traffic",
        minPushes: 22,
        map: [
            "###########",
            "#..       #",
            "#.  $     #",
            "#.        #",
            "#@$  $    #",
            "###   $ ###",
            "###     ###",
            "###########"
        ]
    },
    // Level 76 (score: 139, challenge: traffic, minimum 25 pushes)
    {
        score: 139,
        challenge: "traffic",
        minPushes: 25,
        map: [
            "#########",
            "#    #  #",
            "# $     #",
            "#  . #$ #",
            "#   .#@ #",
            "# $ .#$ #",
            "#    # .#",
            "#########"
        ]
    },
    // Level 77 (score: 140, challenge: traffic, minimum 21 pushes)
    {
        score: 140,
        challenge: "traffic",
        minPushes: 21,
        map: [
            "##########",
            "#  .  #  #",
            "# $ $ #. #",
            "#     #. #",
            "# $   # @#",
            "#    $ . #",
            "#        #",
            "##########"
        ]
    },
    // Level 78 (score: 140, challenge: traffic, minimum 24 pushes)
    {
        score: 140,
        challenge: "traffic",
        minPushes: 24,
        map: [
            "##########",
            "#*+#     #",
            "#.*#$#   #",
            "#. #   $ #",
            "#     $  #",
            "#        #",
            "##########"
        ]
    },
    // Level 79 (score: 140, challenge: traffic, minimum 25 pushes)
    {
        score: 140,
        challenge: "traffic",
        minPushes: 25,
        map: [
            "###########",
            "#         #",
            "# $   # $ #",
            "#@$  #### #",
            "##    # ..#",
            "#    $  ..#",
            "#  #      #",
            "###########"
        ]
    },
    // Level 80 [BOSS] (score: 159, challenge: traffic, minimum 28 pushes)
    {
        score: 159,
        challenge: "traffic",
        minPushes: 28,
        map: [
            "############",
            "#  # # #   #",
            "# $        #",
            "#          #",
            "#  $  $    #",
            "#          #",
            "#        $.#",
            "# @# #  ...#",
            "############"
        ]
    },
    // Level 81 (score: 141, challenge: traffic, minimum 21 pushes)
    {
        score: 141,
        challenge: "traffic",
        minPushes: 21,
        map: [
            "############",
            "#  #    @  #",
            "#   $ $  $ #",
            "#        $.#",
            "#      $  .#",
            "#    # #...#",
            "############"
        ]
    },
    // Level 82 (score: 141, challenge: traffic, minimum 23 pushes)
    {
        score: 141,
        challenge: "traffic",
        minPushes: 23,
        map: [
            "###########",
            "#        ##",
            "###    $..#",
            "# ## $# . #",
            "#@$ $ ##. #",
            "##    #   #",
            "###########"
        ]
    },
    // Level 83 (score: 142, challenge: traffic, minimum 22 pushes)
    {
        score: 142,
        challenge: "traffic",
        minPushes: 22,
        map: [
            "#########",
            "###@  ###",
            "###$$$###",
            "#   #  .#",
            "#    $.*#",
            "# #   ..#",
            "#########"
        ]
    },
    // Level 84 (score: 143, challenge: traffic, minimum 23 pushes)
    {
        score: 143,
        challenge: "traffic",
        minPushes: 23,
        map: [
            "##########",
            "#.. #    #",
            "#.$ #  # #",
            "#.$@# $  #",
            "#.$ $  # #",
            "#   #    #",
            "##########"
        ]
    },
    // Level 85 (score: 144, challenge: traffic, minimum 21 pushes)
    {
        score: 144,
        challenge: "traffic",
        minPushes: 21,
        map: [
            "##########",
            "#  .#... #",
            "#   . #* #",
            "#    $@$ #",
            "#   #$$$ #",
            "#   #    #",
            "##########"
        ]
    },
    // Level 86 (score: 144, challenge: traffic, minimum 26 pushes)
    {
        score: 144,
        challenge: "traffic",
        minPushes: 26,
        map: [
            "#########",
            "#    #. #",
            "#    #..#",
            "#    # .#",
            "#    #$.#",
            "# $ $#  #",
            "##    $$#",
            "##  ## @#",
            "#########"
        ]
    },
    // Level 87 (score: 146, challenge: traffic, minimum 27 pushes)
    {
        score: 146,
        challenge: "traffic",
        minPushes: 27,
        map: [
            "###########",
            "##        #",
            "###  $  $@#",
            "#.# ###   #",
            "#.* ##  # #",
            "#.      $ #",
            "#         #",
            "###########"
        ]
    },
    // Level 88 (score: 148, challenge: traffic, minimum 20 pushes)
    {
        score: 148,
        challenge: "traffic",
        minPushes: 20,
        map: [
            "#########",
            "#       #",
            "# #$ $  #",
            "#    #.*#",
            "#    #.@#",
            "#  $ #  #",
            "#    # .#",
            "#########"
        ]
    },
    // Level 89 (score: 148, challenge: traffic, minimum 23 pushes)
    {
        score: 148,
        challenge: "traffic",
        minPushes: 23,
        map: [
            "###########",
            "#  .....  #",
            "# $ #     #",
            "# $ #   $ #",
            "# $ #   @ #",
            "# $ # #   #",
            "#   #     #",
            "###########"
        ]
    },
    // Level 90 [BOSS] (score: 184, challenge: traffic, minimum 32 pushes)
    {
        score: 184,
        challenge: "traffic",
        minPushes: 32,
        map: [
            "#########",
            "#   #   #",
            "#.    $ #",
            "#.##$   #",
            "#. #  ###",
            "#. ##$$ #",
            "#* # @  #",
            "#########"
        ]
    },
    // Level 91 (score: 148, challenge: traffic, minimum 26 pushes)
    {
        score: 148,
        challenge: "traffic",
        minPushes: 26,
        map: [
            "###########",
            "#.   @    #",
            "#..       #",
            "#.    $$  #",
            "# $   $   #",
            "####      #",
            "####      #",
            "####      #",
            "###########"
        ]
    },
    // Level 92 (score: 150, challenge: traffic, minimum 24 pushes)
    {
        score: 150,
        challenge: "traffic",
        minPushes: 24,
        map: [
            "##########",
            "#   #    #",
            "#        #",
            "# $ #    #",
            "#   #  $@#",
            "#...#$   #",
            "# $.#    #",
            "##########"
        ]
    },
    // Level 93 (score: 151, challenge: traffic, minimum 25 pushes)
    {
        score: 151,
        challenge: "traffic",
        minPushes: 25,
        map: [
            "#########",
            "#  @#   #",
            "# $$#   #",
            "#       #",
            "#.$ #   #",
            "#.. # $ #",
            "#.* #   #",
            "#########"
        ]
    },
    // Level 94 (score: 152, challenge: traffic, minimum 23 pushes)
    {
        score: 152,
        challenge: "traffic",
        minPushes: 23,
        map: [
            "##########",
            "#   @    #",
            "# #.$  $ #",
            "#  . $#  #",
            "## .  #  #",
            "#  ##$#  #",
            "#   . # ##",
            "##########"
        ]
    },
    // Level 95 (score: 152, challenge: traffic, minimum 23 pushes)
    {
        score: 152,
        challenge: "traffic",
        minPushes: 23,
        map: [
            "##########",
            "#    #+$ #",
            "#    #$  #",
            "# #. # $ #",
            "#   ##   #",
            "#   .  $ #",
            "#. #     #",
            "#   ##   #",
            "##########"
        ]
    },
    // Level 96 (score: 155, challenge: traffic, minimum 23 pushes)
    {
        score: 155,
        challenge: "traffic",
        minPushes: 23,
        map: [
            "##########",
            "#  ...*  #",
            "#####.#  #",
            "# @#  #  #",
            "# $  $   #",
            "#   $ $  #",
            "#        #",
            "##########"
        ]
    },
    // Level 97 (score: 156, challenge: traffic, minimum 25 pushes)
    {
        score: 156,
        challenge: "traffic",
        minPushes: 25,
        map: [
            "############",
            "#        @ #",
            "#     $    #",
            "#   $$ $  .#",
            "####      .#",
            "####  $ ...#",
            "############"
        ]
    },
    // Level 98 (score: 156, challenge: traffic, minimum 31 pushes)
    {
        score: 156,
        challenge: "traffic",
        minPushes: 31,
        map: [
            "##########",
            "#   #  . #",
            "#    $   #",
            "#   #$   #",
            "#  $#   .#",
            "#   #@  .#",
            "##########"
        ]
    },
    // Level 99 (score: 158, challenge: traffic, minimum 23 pushes)
    {
        score: 158,
        challenge: "traffic",
        minPushes: 23,
        map: [
            "#########",
            "#.  #   #",
            "#.  # $ #",
            "#.*@#   #",
            "#  $#   #",
            "# $     #",
            "##      #",
            "#########"
        ]
    },
    // Level 100 [BOSS] (score: 202, challenge: traffic, minimum 32 pushes)
    {
        score: 202,
        challenge: "traffic",
        minPushes: 32,
        map: [
            "##########",
            "#   ##   #",
            "#   $@$  #",
            "# $#.#   #",
            "#  *.# $ #",
            "#  ..#   #",
            "##########"
        ]
    },
    // Level 101 (score: 163, challenge: traffic, minimum 24 pushes)
    {
        score: 163,
        challenge: "traffic",
        minPushes: 24,
        map: [
            "###########",
            "#         #",
            "# ...     #",
            "# ..## $  #",
            "# #$ $$@$ #",
            "#      #  #",
            "###########"
        ]
    },
    // Level 102 (score: 164, challenge: traffic, minimum 31 pushes)
    {
        score: 164,
        challenge: "traffic",
        minPushes: 31,
        map: [
            "##########",
            "#   #..  #",
            "# $ #. @.#",
            "#  $     #",
            "# $$# #  #",
            "#   #    #",
            "##########"
        ]
    },
    // Level 103 (score: 165, challenge: traffic, minimum 25 pushes)
    {
        score: 165,
        challenge: "traffic",
        minPushes: 25,
        map: [
            "#########",
            "# .     #",
            "#..     #",
            "#    $  #",
            "# .#$   #",
            "### $$###",
            "###  @###",
            "#########"
        ]
    },
    // Level 104 (score: 166, challenge: traffic, minimum 30 pushes)
    {
        score: 166,
        challenge: "traffic",
        minPushes: 30,
        map: [
            "#########",
            "#    # .#",
            "# $  #$@#",
            "#.  . $ #",
            "#$   #$.#",
            "#.   #  #",
            "#########"
        ]
    },
    // Level 105 (score: 166, challenge: traffic, minimum 33 pushes)
    {
        score: 166,
        challenge: "traffic",
        minPushes: 33,
        map: [
            "##########",
            "#     #..#",
            "# $ $@#..#",
            "# $# $#  #",
            "#        #",
            "#        #",
            "##########"
        ]
    },
    // Level 106 (score: 168, challenge: traffic, minimum 26 pushes)
    {
        score: 168,
        challenge: "traffic",
        minPushes: 26,
        map: [
            "##########",
            "# @      #",
            "# $$   $ #",
            "# ..##   #",
            "# ...#$  #",
            "# ###  $ #",
            "#       ##",
            "##########"
        ]
    },
    // Level 107 (score: 175, challenge: traffic, minimum 30 pushes)
    {
        score: 175,
        challenge: "traffic",
        minPushes: 30,
        map: [
            "###########",
            "#  ....   #",
            "# $##  @  #",
            "#  #   $# #",
            "# $#    $ #",
            "#  #      #",
            "###########"
        ]
    },
    // Level 108 (score: 178, challenge: traffic, minimum 25 pushes)
    {
        score: 178,
        challenge: "traffic",
        minPushes: 25,
        map: [
            "#########",
            "#..* #  #",
            "#..  ## #",
            "###     #",
            "#   $## #",
            "# $ $@$ #",
            "#       #",
            "#########"
        ]
    },
    // Level 109 (score: 181, challenge: traffic, minimum 29 pushes)
    {
        score: 181,
        challenge: "traffic",
        minPushes: 29,
        map: [
            "#########",
            "#   #   #",
            "#   # $ #",
            "##      #",
            "#   # #.#",
            "# $ #$*.#",
            "#   #@*.#",
            "#########"
        ]
    },
    // Level 110 [BOSS] (score: 203, challenge: traffic, minimum 31 pushes)
    {
        score: 203,
        challenge: "traffic",
        minPushes: 31,
        map: [
            "#########",
            "#.#   # #",
            "#.# $ $ #",
            "#.  # # #",
            "#.  $$#@#",
            "##  #   #",
            "#########"
        ]
    }
];

