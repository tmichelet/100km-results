(function () {
    "use strict";

    exports.getAllPersons = function() {
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
    };

}());