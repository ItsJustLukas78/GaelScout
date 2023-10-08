import {createSwaggerSpec} from 'next-swagger-doc';

export const getApiDocs = async () => {
  return createSwaggerSpec({
    definition: {
      "openapi": "3.0.0",
      "info": {
        "title": "GaelScout API",
        "version": "0.1"
      },
      "paths": {
        "/api/predict": {
          "get": {
            "tags": [
              "Predict"
            ],
            "description": "Returns the predicted outcome of a match",
            "responses": {
              "200": {
                "description": "Predicted outcome of a match"
              },
              "400": {
                "description": "Team ID or Season ID not provided"
              },
              "404": {
                "description": "Team not found"
              },
              "500": {
                "description": "Internal server error"
              }
            },
            "parameters": [
              {
                "name": "r1Team",
                "in": "query",
                "description": "Red 1 Team Number",
                "required": true,
                "type": "string"
              },
              {
                "name": "r2Team",
                "in": "query",
                "description": "Red 2 Team Number",
                "required": true,
                "type": "string"
              },
              {
                "name": "b1Team",
                "in": "query",
                "description": "Blue 1 Team Number",
                "required": true,
                "type": "string"
              },
              {
                "name": "b2Team",
                "in": "query",
                "description": "Blue 2 Team Number",
                "required": true,
                "type": "string"
              },
              {
                "name": "seasonId",
                "in": "query",
                "description": "Season ID",
                "required": true,
                "type": "integer"
              }
            ]
          }
        },
        "/api/seasons/{seasonId}/seasonProfile/{teamNumber}": {
          "get": {
            "tags": [
              "Seasons"
            ],
            "description": "Returns the team season profile with the given team number in the given season",
            "parameters": [
              {
                "in": "path",
                "name": "seasonId",
                "required": true,
                "description": "The season ID",
                "type": "integer"
              },
              {
                "in": "path",
                "name": "teamNumber",
                "required": true,
                "description": "The team number",
                "type": "string"
              }
            ],
            "responses": {
              "200": {
                "description": "The team season profile with the given team number in the given season"
              },
              "400": {
                "description": "Team number or Season ID not provided"
              },
              "404": {
                "description": "Team not found"
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        },
        "/api/seasons/{seasonId}/seasonProfiles": {
          "get": {
            "tags": [
              "Seasons"
            ],
            "description": "Returns team season profiles in the given season",
            "parameters": [
              {
                "in": "path",
                "name": "seasonId",
                "required": true,
                "description": "The season ID",
                "type": "integer"
              },
              {
                "in": "query",
                "name": "page",
                "required": false,
                "description": "The page number",
                "type": "integer",
                "default": 1,
                "minimum": 1
              }
            ],
            "responses": {
              "200": {
                "description": "The team with the given team number in the given season"
              },
              "400": {
                "description": "Page is not a positive integer or Season ID not provided"
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        },
        "/api/teams/number/{teamNumber}": {
          "get": {
            "tags": [
              "Teams"
            ],
            "description": "Returns the team with the given team number",
            "parameters": [
              {
                "in": "path",
                "name": "teamNumber",
                "required": true,
                "description": "The team number",
                "type": "string"
              }
            ],
            "responses": {
              "200": {
                "description": "The team with the given team number in the given season"
              },
              "400": {
                "description": "Team number not provided"
              },
              "404": {
                "description": "Team not found"
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        },
        "/api/teams": {
          "get": {
            "tags": [
              "Teams"
            ],
            "description": "Returns teams",
            "parameters": [
              {
                "in": "query",
                "name": "teamNumber",
                "required": false,
                "description": "The team number",
                "type": "string"
              },
              {
                "in": "query",
                "name": "region",
                "required": false,
                "description": "The team region",
                "type": "string"
              },
              {
                "in": "query",
                "name": "country",
                "required": false,
                "description": "The team country",
                "type": "string"
              },
              {
                "in": "query",
                "name": "grade",
                "required": false,
                "description": "The team grade",
                "type": "string"
              },
              {
                "in": "query",
                "name": "page",
                "required": false,
                "description": "The page number for pagination",
                "type": "integer",
                "example": 1,
                "default": 1,
                "minimum": 1
              }
            ],
            "responses": {
              "200": {
                "description": "The team with the given team number in the given season"
              },
              "400": {
                "description": "Team number not provided"
              },
              "404": {
                "description": "Team not found"
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        }
      },
      tags: [
        {
          name: 'Seasons',
          description: 'Seasons API',
        },
        {
          name: 'Teams',
          description: 'Teams API',
        },
        {
          name: 'Predict',
          description: 'Predict API',
        }
      ]
    }
  });
};