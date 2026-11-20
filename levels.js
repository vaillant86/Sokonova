/**
 * SOKONOVA LEVELS
 *
 * This file only contains the level list.
 * It is loaded before game.js.
 * The block between the markers is managed by generate_levels.py; do not edit it manually.
 */

const levels = [
    // <LEVELS>

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
        // Level 3 (score: 69, challenge: traffic, minimum 10 pushes)
        {
            score: 69,
            challenge: "traffic",
            minPushes: 10,
            map: [
                "#########",
                "#      .#",
                "# .     #",
                "# @   $$#",
                "#   .   #",
                "#     $ #",
                "#      ##",
                "#########"
            ]
        },
        // Level 4 (score: 69, challenge: traffic, minimum 12 pushes)
        {
            score: 69,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "##########",
                "#.      .#",
                "#        #",
                "#   ##  $#",
                "#   ##$  #",
                "#   $   @#",
                "#      . #",
                "##########"
            ]
        },
        // Level 5 (score: 72, challenge: traffic, minimum 11 pushes)
        {
            score: 72,
            challenge: "traffic",
            minPushes: 11,
            map: [
                "########",
                "#  #   #",
                "# @  $ #",
                "#      #",
                "#    $ #",
                "# .    #",
                "# .#   #",
                "########"
            ]
        },
        // Level 6 (score: 72, challenge: traffic, minimum 14 pushes)
        {
            score: 72,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "#########",
                "#       #",
                "#@      #",
                "#$     ##",
                "#      ##",
                "#.    $##",
                "#.     ##",
                "#########"
            ]
        },
        // Level 7 (score: 72, challenge: traffic, minimum 16 pushes)
        {
            score: 72,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "########",
                "#  #   #",
                "#  #   #",
                "#.  $ $#",
                "# $#  .#",
                "#. #  @#",
                "########"
            ]
        },
        // Level 8 (score: 74, challenge: traffic, minimum 12 pushes)
        {
            score: 74,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "########",
                "#      #",
                "#   $$ #",
                "#     ##",
                "#.  @ ##",
                "#.    ##",
                "#     ##",
                "########"
            ]
        },
        // Level 9 (score: 76, challenge: traffic, minimum 10 pushes)
        {
            score: 76,
            challenge: "traffic",
            minPushes: 10,
            map: [
                "#########",
                "# .     #",
                "#  ##$  #",
                "#.$##  .#",
                "#  $  @ #",
                "#       #",
                "#########"
            ]
        },
        // Level 10 [BOSS] (score: 93, challenge: traffic, minimum 14 pushes)
        {
            score: 93,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "###########",
                "#   #   . #",
                "#      .  #",
                "# * #$$   #",
                "#   # @$  #",
                "#  .#     #",
                "#   #     #",
                "###########"
            ]
        },
        // Level 11 (score: 76, challenge: traffic, minimum 12 pushes)
        {
            score: 76,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "##########",
                "##      ##",
                "#    $ $ #",
                "#@       #",
                "#.  .    #",
                "#  $.    #",
                "##      ##",
                "##########"
            ]
        },
        // Level 12 (score: 76, challenge: traffic, minimum 13 pushes)
        {
            score: 76,
            challenge: "traffic",
            minPushes: 13,
            map: [
                "########",
                "#    ###",
                "#$  .###",
                "#      #",
                "# @    #",
                "# $    #",
                "#.$   .#",
                "########"
            ]
        },
        // Level 13 (score: 78, challenge: traffic, minimum 12 pushes)
        {
            score: 78,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "##########",
                "#        #",
                "#   ##.  #",
                "# $ ##.$.#",
                "#  $  @  #",
                "#        #",
                "##########"
            ]
        },
        // Level 14 (score: 78, challenge: traffic, minimum 12 pushes)
        {
            score: 78,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "#########",
                "#   #   #",
                "#.  #   #",
                "#   #@$ #",
                "#.  #   #",
                "# $     #",
                "#   #   #",
                "#########"
            ]
        },
        // Level 15 (score: 79, challenge: traffic, minimum 12 pushes)
        {
            score: 79,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "##########",
                "#      . #",
                "#     $  #",
                "#  @## . #",
                "#  $##   #",
                "# $  .   #",
                "#        #",
                "##########"
            ]
        },
        // Level 16 (score: 79, challenge: traffic, minimum 14 pushes)
        {
            score: 79,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "##########",
                "#    #  @#",
                "#  $ #$$$#",
                "# .  #.  #",
                "#    #   #",
                "#        #",
                "#    #   #",
                "#    #. .#",
                "##########"
            ]
        },
        // Level 17 (score: 79, challenge: traffic, minimum 16 pushes)
        {
            score: 79,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "##########",
                "#   #    #",
                "#   #    #",
                "#@  #    #",
                "#        #",
                "#..$# $  #",
                "#   #    #",
                "##########"
            ]
        },
        // Level 18 (score: 82, challenge: traffic, minimum 12 pushes)
        {
            score: 82,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "############",
                "#          #",
                "#      .   #",
                "#.  $##    #",
                "#    ## $  #",
                "#          #",
                "#   .@$  $ #",
                "#         .#",
                "############"
            ]
        },
        // Level 19 (score: 82, challenge: traffic, minimum 15 pushes)
        {
            score: 82,
            challenge: "traffic",
            minPushes: 15,
            map: [
                "##########",
                "#   #    #",
                "#   #    #",
                "#    @   #",
                "# $$#    #",
                "#   # .  #",
                "#   #.   #",
                "##########"
            ]
        },
        // Level 20 [BOSS] (score: 98, challenge: traffic, minimum 15 pushes)
        {
            score: 98,
            challenge: "traffic",
            minPushes: 15,
            map: [
                "##########",
                "#        #",
                "# $   @* #",
                "#    $$. #",
                "## $  ..##",
                "##     .##",
                "##########"
            ]
        },
        // Level 21 (score: 82, challenge: endurance, minimum 12 pushes)
        {
            score: 82,
            challenge: "endurance",
            minPushes: 12,
            map: [
                "############",
                "#      # $.#",
                "#  .    .. #",
                "# $    # $ #",
                "#      #   #",
                "#      # * #",
                "#  @$  #   #",
                "#      #   #",
                "############"
            ]
        },
        // Level 22 (score: 84, challenge: traffic, minimum 12 pushes)
        {
            score: 84,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "###########",
                "#         #",
                "# $.##  @ #",
                "#.  ##  $ #",
                "# $   .$  #",
                "# .       #",
                "###########"
            ]
        },
        // Level 23 (score: 85, challenge: traffic, minimum 12 pushes)
        {
            score: 85,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "##########",
                "#       ##",
                "# $ $    #",
                "#    .   #",
                "#        #",
                "# $   @. #",
                "#  .    ##",
                "##########"
            ]
        },
        // Level 24 (score: 86, challenge: traffic, minimum 11 pushes)
        {
            score: 86,
            challenge: "traffic",
            minPushes: 11,
            map: [
                "############",
                "#      #   #",
                "#   *. #  .#",
                "#   .  $   #",
                "# $$$  #   #",
                "# @.   #   #",
                "############"
            ]
        },
        // Level 25 (score: 86, challenge: traffic, minimum 14 pushes)
        {
            score: 86,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "#########",
                "#    # .#",
                "# $  #  #",
                "#@ $ #$ #",
                "#.   #  #",
                "#       #",
                "#   .   #",
                "#########"
            ]
        },
        // Level 26 (score: 88, challenge: traffic, minimum 12 pushes)
        {
            score: 88,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "###########",
                "#    #    #",
                "# $$ #  $ #",
                "# .  #@$  #",
                "#.       .#",
                "#    #   .#",
                "###########"
            ]
        },
        // Level 27 (score: 88, challenge: traffic, minimum 16 pushes)
        {
            score: 88,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "##########",
                "####@  ..#",
                "####     #",
                "#        #",
                "# $$     #",
                "#        #",
                "##########"
            ]
        },
        // Level 28 (score: 89, challenge: traffic, minimum 12 pushes)
        {
            score: 89,
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
        // Level 29 (score: 90, challenge: traffic, minimum 14 pushes)
        {
            score: 90,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "#########",
                "#   #.  #",
                "# . #   #",
                "#     $ #",
                "#     $@#",
                "#   #$  #",
                "#  .#   #",
                "#########"
            ]
        },
        // Level 30 [BOSS] (score: 100, challenge: endurance, minimum 12 pushes)
        {
            score: 100,
            challenge: "endurance",
            minPushes: 12,
            map: [
                "############",
                "####       #",
                "####   $   #",
                "#          #",
                "#    . $   #",
                "# $ **     #",
                "#  .*+*    #",
                "############"
            ]
        },
        // Level 31 (score: 94, challenge: traffic, minimum 13 pushes)
        {
            score: 94,
            challenge: "traffic",
            minPushes: 13,
            map: [
                "###########",
                "#         #",
                "#  $$     #",
                "#   $     #",
                "# .    .  #",
                "#      @  #",
                "###   . ###",
                "###########"
            ]
        },
        // Level 32 (score: 94, challenge: traffic, minimum 14 pushes)
        {
            score: 94,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "##########",
                "#  #     #",
                "#     $  #",
                "#        #",
                "#$. $    #",
                "#@*      #",
                "#..# #   #",
                "##########"
            ]
        },
        // Level 33 (score: 94, challenge: traffic, minimum 16 pushes)
        {
            score: 94,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "##########",
                "#    #   #",
                "#        #",
                "#    # $@#",
                "#.   #   #",
                "#$ $ #  .#",
                "#    #.  #",
                "##########"
            ]
        },
        // Level 34 (score: 95, challenge: traffic, minimum 12 pushes)
        {
            score: 95,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "#########",
                "#  ..@ ##",
                "# $  $  #",
                "#    . .#",
                "# $ $   #",
                "#      ##",
                "#########"
            ]
        },
        // Level 35 (score: 95, challenge: traffic, minimum 12 pushes)
        {
            score: 95,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "############",
                "####  .    #",
                "####    $*.#",
                "#      $ ..#",
                "#    $   $@#",
                "#          #",
                "############"
            ]
        },
        // Level 36 (score: 95, challenge: traffic, minimum 18 pushes)
        {
            score: 95,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "##########",
                "#   #    #",
                "#   #$   #",
                "#   #    #",
                "#  $.   .#",
                "# $ #    #",
                "#   # @. #",
                "##########"
            ]
        },
        // Level 37 (score: 95, challenge: traffic, minimum 18 pushes)
        {
            score: 95,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "##########",
                "#  .#    #",
                "#   #  $ #",
                "#        #",
                "#   #  $ #",
                "#  .#    #",
                "#   # @  #",
                "##########"
            ]
        },
        // Level 38 (score: 96, challenge: traffic, minimum 12 pushes)
        {
            score: 96,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "##########",
                "#        #",
                "# @      #",
                "#.$$##   #",
                "#.  ## $ #",
                "#  ..$   #",
                "#        #",
                "##########"
            ]
        },
        // Level 39 (score: 96, challenge: traffic, minimum 23 pushes)
        {
            score: 96,
            challenge: "traffic",
            minPushes: 23,
            map: [
                "##########",
                "#.   @# .#",
                "#$       #",
                "#     #  #",
                "#     #$ #",
                "# $   # .#",
                "#     #  #",
                "##########"
            ]
        },
        // Level 40 [BOSS] (score: 107, challenge: traffic, minimum 14 pushes)
        {
            score: 107,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "###########",
                "#    #    #",
                "#    #    #",
                "#  .. .   #",
                "#@$  #    #",
                "#.$  #    #",
                "# $ $#    #",
                "#    #.$  #",
                "###########"
            ]
        },
        // Level 41 (score: 98, challenge: traffic, minimum 19 pushes)
        {
            score: 98,
            challenge: "traffic",
            minPushes: 19,
            map: [
                "###########",
                "#  $     .#",
                "#         #",
                "#@  ##.   #",
                "#   ##$ $ #",
                "#         #",
                "#.   .  $ #",
                "###########"
            ]
        },
        // Level 42 (score: 98, challenge: traffic, minimum 20 pushes)
        {
            score: 98,
            challenge: "traffic",
            minPushes: 20,
            map: [
                "##########",
                "#    #@  #",
                "#  $ #$  #",
                "#    # . #",
                "#$       #",
                "#.   # . #",
                "##########"
            ]
        },
        // Level 43 (score: 99, challenge: traffic, minimum 12 pushes)
        {
            score: 99,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "###########",
                "#     #   #",
                "#     #   #",
                "#     $   #",
                "#   . #   #",
                "#  $  #. .#",
                "#.* $ # $ #",
                "# @   #   #",
                "###########"
            ]
        },
        // Level 44 (score: 99, challenge: traffic, minimum 14 pushes)
        {
            score: 99,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "##########",
                "# .  #.$.#",
                "#        #",
                "#@$  #$  #",
                "#   .# $ #",
                "#    #   #",
                "##########"
            ]
        },
        // Level 45 (score: 99, challenge: traffic, minimum 14 pushes)
        {
            score: 99,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "############",
                "#      #  .#",
                "#      #   #",
                "#.     #   #",
                "#   .@ #   #",
                "#  . $ $   #",
                "# $$   #   #",
                "#      #   #",
                "############"
            ]
        },
        // Level 46 (score: 99, challenge: traffic, minimum 22 pushes)
        {
            score: 99,
            challenge: "traffic",
            minPushes: 22,
            map: [
                "###########",
                "#  $   ...#",
                "#     $ . #",
                "# $   @   #",
                "##  $    ##",
                "##       ##",
                "###########"
            ]
        },
        // Level 47 (score: 100, challenge: traffic, minimum 12 pushes)
        {
            score: 100,
            challenge: "traffic",
            minPushes: 12,
            map: [
                "###########",
                "#   .   . #",
                "#   ##@$  #",
                "# $ ## $  #",
                "#    $. $ #",
                "#.      . #",
                "###########"
            ]
        },
        // Level 48 (score: 100, challenge: traffic, minimum 14 pushes)
        {
            score: 100,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "##########",
                "#  # #   #",
                "# @    $ #",
                "# $   $ .#",
                "#      $.#",
                "#      ..#",
                "##########"
            ]
        },
        // Level 49 (score: 100, challenge: traffic, minimum 15 pushes)
        {
            score: 100,
            challenge: "traffic",
            minPushes: 15,
            map: [
                "#########",
                "#      @#",
                "# $  $  #",
                "#     $.#",
                "#    ...#",
                "# $   ###",
                "#     ###",
                "#########"
            ]
        },
        // Level 50 [BOSS] (score: 112, challenge: traffic, minimum 13 pushes)
        {
            score: 112,
            challenge: "traffic",
            minPushes: 13,
            map: [
                "############",
                "#     #    #",
                "#    . ..  #",
                "#     $ $@ #",
                "#  $  #  $ #",
                "#  $  #    #",
                "# .  .#    #",
                "############"
            ]
        },
        // Level 51 (score: 100, challenge: traffic, minimum 16 pushes)
        {
            score: 100,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "#########",
                "#    #  #",
                "#@$. # .#",
                "#    #  #",
                "#    .  #",
                "# $$.#$ #",
                "#    #  #",
                "#########"
            ]
        },
        // Level 52 (score: 100, challenge: traffic, minimum 16 pushes)
        {
            score: 100,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "##########",
                "####   ..#",
                "#### $   #",
                "#    $@. #",
                "# $      #",
                "#. $     #",
                "##########"
            ]
        },
        // Level 53 (score: 100, challenge: traffic, minimum 18 pushes)
        {
            score: 100,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "##########",
                "#.     $ #",
                "# $@$    #",
                "###    . #",
                "###     .#",
                "##########"
            ]
        },
        // Level 54 (score: 101, challenge: traffic, minimum 16 pushes)
        {
            score: 101,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "##########",
                "# ...    #",
                "#  . $   #",
                "#  $@    #",
                "#    $ $ #",
                "#    #   #",
                "##########"
            ]
        },
        // Level 55 (score: 101, challenge: traffic, minimum 17 pushes)
        {
            score: 101,
            challenge: "traffic",
            minPushes: 17,
            map: [
                "##########",
                "# ..  @  #",
                "#  .  $  #",
                "##     $##",
                "##      ##",
                "##    $ ##",
                "##      ##",
                "##########"
            ]
        },
        // Level 56 (score: 102, challenge: traffic, minimum 15 pushes)
        {
            score: 102,
            challenge: "traffic",
            minPushes: 15,
            map: [
                "###########",
                "#  #@# #  #",
                "#   $     #",
                "#         #",
                "#      $$ #",
                "#      $..#",
                "#  #   #..#",
                "###########"
            ]
        },
        // Level 57 (score: 103, challenge: traffic, minimum 14 pushes)
        {
            score: 103,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "############",
                "# .        #",
                "# $  .     #",
                "# .  ##$ . #",
                "#  $ ##    #",
                "#          #",
                "#  @$   $  #",
                "#        . #",
                "############"
            ]
        },
        // Level 58 (score: 105, challenge: traffic, minimum 17 pushes)
        {
            score: 105,
            challenge: "traffic",
            minPushes: 17,
            map: [
                "###########",
                "#  @.     #",
                "#   ## $$ #",
                "# . ## $  #",
                "#      .  #",
                "# $  .    #",
                "###########"
            ]
        },
        // Level 59 (score: 106, challenge: traffic, minimum 18 pushes)
        {
            score: 106,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "############",
                "#  # #     #",
                "#  ..*.    #",
                "#    .. $@ #",
                "# $        #",
                "#     $    #",
                "# $ $      #",
                "#    #     #",
                "############"
            ]
        },
        // Level 60 [BOSS] (score: 115, challenge: traffic, minimum 18 pushes)
        {
            score: 115,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "############",
                "#     .#.. #",
                "#     $ .  #",
                "# $   $ @  #",
                "#     $    #",
                "#          #",
                "#    # #   #",
                "############"
            ]
        },
        // Level 61 (score: 107, challenge: traffic, minimum 16 pushes)
        {
            score: 107,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "##########",
                "# .      #",
                "#.*      #",
                "##.$    ##",
                "##      ##",
                "##   $$ ##",
                "##   @  ##",
                "##########"
            ]
        },
        // Level 62 (score: 107, challenge: traffic, minimum 18 pushes)
        {
            score: 107,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "###########",
                "#       . #",
                "#     $ ..#",
                "##   $  .##",
                "##  $    ##",
                "##    $  ##",
                "##    @  ##",
                "###########"
            ]
        },
        // Level 63 (score: 108, challenge: traffic, minimum 14 pushes)
        {
            score: 108,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "############",
                "#     #    #",
                "# $   # .$ #",
                "#     # $  #",
                "#    . @$  #",
                "#    .#   .#",
                "############"
            ]
        },
        // Level 64 (score: 110, challenge: traffic, minimum 13 pushes)
        {
            score: 110,
            challenge: "traffic",
            minPushes: 13,
            map: [
                "##########",
                "#  # #   #",
                "# $      #",
                "#  $     #",
                "# $+*. $ #",
                "#  #.#.  #",
                "##########"
            ]
        },
        // Level 65 (score: 110, challenge: traffic, minimum 15 pushes)
        {
            score: 110,
            challenge: "traffic",
            minPushes: 15,
            map: [
                "###########",
                "#    #.#  #",
                "#    ..   #",
                "# $  $    #",
                "#   $     #",
                "#@ # # #  #",
                "###########"
            ]
        },
        // Level 66 (score: 110, challenge: traffic, minimum 18 pushes)
        {
            score: 110,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "##########",
                "#   #    #",
                "#   #$$ .#",
                "#  .#.   #",
                "#    $ $ #",
                "# .@#    #",
                "##########"
            ]
        },
        // Level 67 (score: 110, challenge: traffic, minimum 19 pushes)
        {
            score: 110,
            challenge: "traffic",
            minPushes: 19,
            map: [
                "###########",
                "#   #     #",
                "#.  #     #",
                "#$. #     #",
                "#  .#     #",
                "#  $@$  $ #",
                "#.  #     #",
                "###########"
            ]
        },
        // Level 68 (score: 110, challenge: traffic, minimum 22 pushes)
        {
            score: 110,
            challenge: "traffic",
            minPushes: 22,
            map: [
                "#########",
                "#  @#   #",
                "#  .$   #",
                "#  $#   #",
                "#   #   #",
                "#.  #$  #",
                "#.  #   #",
                "#########"
            ]
        },
        // Level 69 (score: 111, challenge: traffic, minimum 18 pushes)
        {
            score: 111,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "############",
                "#  #@# #   #",
                "#   $      #",
                "#          #",
                "#          #",
                "#     $ $ .#",
                "#         .#",
                "#  # # # *.#",
                "############"
            ]
        },
        // Level 70 [BOSS] (score: 129, challenge: traffic, minimum 28 pushes)
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
        // Level 71 (score: 112, challenge: traffic, minimum 17 pushes)
        {
            score: 112,
            challenge: "traffic",
            minPushes: 17,
            map: [
                "###########",
                "# $.      #",
                "#     $   #",
                "#  $##$   #",
                "#   ##    #",
                "#...      #",
                "#         #",
                "#@        #",
                "###########"
            ]
        },
        // Level 72 (score: 112, challenge: traffic, minimum 18 pushes)
        {
            score: 112,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "###########",
                "#    #    #",
                "#  $ $    #",
                "#    # $  #",
                "#.   #    #",
                "# .$@#    #",
                "#  . # .  #",
                "###########"
            ]
        },
        // Level 73 (score: 112, challenge: traffic, minimum 19 pushes)
        {
            score: 112,
            challenge: "traffic",
            minPushes: 19,
            map: [
                "############",
                "#          #",
                "# $   $ $.*#",
                "#       ...#",
                "###      ###",
                "###      ###",
                "###   $  ###",
                "###   @  ###",
                "############"
            ]
        },
        // Level 74 (score: 112, challenge: traffic, minimum 20 pushes)
        {
            score: 112,
            challenge: "traffic",
            minPushes: 20,
            map: [
                "###########",
                "#         #",
                "#   ##.   #",
                "#  $##.  .#",
                "# $$      #",
                "#        @#",
                "###########"
            ]
        },
        // Level 75 (score: 112, challenge: traffic, minimum 20 pushes)
        {
            score: 112,
            challenge: "traffic",
            minPushes: 20,
            map: [
                "##########",
                "#     .+.#",
                "#     $$.#",
                "#    $  .#",
                "##     ###",
                "## $ $ ###",
                "##     ###",
                "##########"
            ]
        },
        // Level 76 (score: 112, challenge: traffic, minimum 20 pushes)
        {
            score: 112,
            challenge: "traffic",
            minPushes: 20,
            map: [
                "###########",
                "#   ...   #",
                "#    ..   #",
                "# $ $     #",
                "#         #",
                "#    $  $ #",
                "#    @$   #",
                "#  # #    #",
                "###########"
            ]
        },
        // Level 77 (score: 113, challenge: traffic, minimum 14 pushes)
        {
            score: 113,
            challenge: "traffic",
            minPushes: 14,
            map: [
                "###########",
                "#    @.   #",
                "#.  ##    #",
                "#  $##$   #",
                "#     $ $ #",
                "#    ..   #",
                "###########"
            ]
        },
        // Level 78 (score: 113, challenge: traffic, minimum 18 pushes)
        {
            score: 113,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "###########",
                "#.  . #   #",
                "#    $#   #",
                "#     # $ #",
                "# $ $   . #",
                "#   + #   #",
                "###########"
            ]
        },
        // Level 79 (score: 114, challenge: traffic, minimum 17 pushes)
        {
            score: 114,
            challenge: "traffic",
            minPushes: 17,
            map: [
                "##########",
                "#  #   @ #",
                "#        #",
                "#        #",
                "# $  $  .#",
                "#  $  $..#",
                "#  # #  .#",
                "##########"
            ]
        },
        // Level 80 [BOSS] (score: 155, challenge: traffic, minimum 31 pushes)
        {
            score: 155,
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
        // Level 81 (score: 117, challenge: traffic, minimum 16 pushes)
        {
            score: 117,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "###########",
                "#    #    #",
                "#    $.$. #",
                "# .  #  $ #",
                "# $..#@$  #",
                "#    #    #",
                "###########"
            ]
        },
        // Level 82 (score: 119, challenge: traffic, minimum 20 pushes)
        {
            score: 119,
            challenge: "traffic",
            minPushes: 20,
            map: [
                "###########",
                "#    #. $ #",
                "#    ...  #",
                "# $   .  @#",
                "#    $    #",
                "#         #",
                "#      $$ #",
                "#    # #  #",
                "###########"
            ]
        },
        // Level 83 (score: 120, challenge: traffic, minimum 16 pushes)
        {
            score: 120,
            challenge: "traffic",
            minPushes: 16,
            map: [
                "###########",
                "#         #",
                "#     @   #",
                "#  $ $$$. #",
                "#        .#",
                "####      #",
                "####  ..  #",
                "###########"
            ]
        },
        // Level 84 (score: 120, challenge: traffic, minimum 18 pushes)
        {
            score: 120,
            challenge: "traffic",
            minPushes: 18,
            map: [
                "##########",
                "#      @ #",
                "#  $$    #",
                "#     $  #",
                "###     .#",
                "###  $...#",
                "##########"
            ]
        },
        // Level 85 (score: 121, challenge: traffic, minimum 23 pushes)
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
        // Level 86 (score: 122, challenge: traffic, minimum 18 pushes)
        {
            score: 122,
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
        // Level 87 (score: 122, challenge: traffic, minimum 18 pushes)
        {
            score: 122,
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
        // Level 88 (score: 124, challenge: traffic, minimum 20 pushes)
        {
            score: 124,
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
        // Level 89 (score: 124, challenge: traffic, minimum 21 pushes)
        {
            score: 124,
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
        // Level 90 [BOSS] (score: 155, challenge: traffic, minimum 36 pushes)
        {
            score: 155,
            challenge: "traffic",
            minPushes: 36,
            map: [
                "############",
                "####       #",
                "####       #",
                "#  $       #",
                "#    $     #",
                "#         .#",
                "# $      ..#",
                "#@$   $  ..#",
                "############"
            ]
        },
        // Level 91 (score: 130, challenge: traffic, minimum 28 pushes)
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
        // Level 92 (score: 132, challenge: traffic, minimum 20 pushes)
        {
            score: 132,
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
        // Level 93 (score: 135, challenge: traffic, minimum 29 pushes)
        {
            score: 135,
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
        // Level 94 (score: 137, challenge: traffic, minimum 21 pushes)
        {
            score: 137,
            challenge: "traffic",
            minPushes: 21,
            map: [
                "##########",
                "#.  # @  #",
                "#$$  $   #",
                "#  .# $$ #",
                "# . #    #",
                "# . # .  #",
                "##########"
            ]
        },
        // Level 95 (score: 137, challenge: traffic, minimum 22 pushes)
        {
            score: 137,
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
        // Level 96 (score: 139, challenge: traffic, minimum 21 pushes)
        {
            score: 139,
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
        // Level 97 (score: 140, challenge: traffic, minimum 21 pushes)
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
        // Level 98 (score: 147, challenge: traffic, minimum 26 pushes)
        {
            score: 147,
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
        // Level 99 (score: 152, challenge: traffic, minimum 28 pushes)
        {
            score: 152,
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
        // Level 100 [BOSS] (score: 156, challenge: traffic, minimum 25 pushes)
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
        }
    // </LEVELS>
];

