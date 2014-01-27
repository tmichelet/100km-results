(function () {
    "use strict";


// mocked data
    exports.getTeam = function(teamname) {
        if(teamname === "_testteam") {
            return {
                    "persons": [
                    {
                        "bib": 4,
                        "name": "Emeline Landemaine"
                    },
                    {
                        "bib": 100,
                        "name": "Emeline Parizel"
                    }
                ]
            };
        }
        else if(teamname === "_testalone") {
            return {
                    "persons": [
                    {
                        "bib": 4,
                        "name": "Emeline Landemaine"
                    }
                ]
            };
        }
        else return {"persons": []};
    };

    exports.getPerson = function(bib) {
        if(bib === 4) return all.persons[0].checkpoints;
        if(bib === 100) return all.persons[1].checkpoints;
    };


    var all = {
            "persons": [
                {
                    "bib": 4,
                    "name": "Emeline Landemaine",
                    "checkpoints": [
                        {
                        "time": "21:17:32",
                        "distance": "15.00",
                        "name": "La croix du Bac",
                        "lap": 1
                        },
                        {
                        "time": "04:17:32",
                        "distance": "15.00",
                        "name": "La croix du Bac",
                        "lap": 2
                        }
                    ]
                },
                {
                    "bib": 100,
                    "name": "Emeline Parizel",
                    "checkpoints": [
                        {
                        "time": "21:17:32",
                        "distance": "15.00",
                        "name": "La croix du Bac",
                        "lap": 1
                        },
                        {
                        "time": "04:17:32",
                        "distance": "55.00",
                        "name": "La croix du Bac",
                        "lap": 2
                        },
                        {
                        "time": "14:17:32",
                        "distance": "75.00",
                        "name": "La croix du Bac",
                        "lap": 3
                        }
                    ]
                }
            ]
        };


// for tests
    exports.getAllPersons = function(bib) {
        return all;
    };
    exports.getEmelineL = function(bib) {
        return {
            "persons": [
                {
                    "bib": 4,
                    "name": "Emeline Landemaine",
                    "checkpoints": [
                        {
                        "time": "21:17:32",
                        "distance": "15.00",
                        "name": "La croix du Bac",
                        "lap": 1
                        },
                        {
                        "time": "04:17:32",
                        "distance": "15.00",
                        "name": "La croix du Bac",
                        "lap": 2
                        }
                    ]
                }
            ]
        };
    };
}());