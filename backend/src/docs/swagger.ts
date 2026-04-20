export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Football Teams API",
    version: "1.0.0"
  },
  tags: [
    {
      name: "Teams",
      description: "Operations related to football teams"
    }
  ],
  paths: {
    "/api/v1/teams": {
      get: {
        tags: ["Teams"],
        summary: "List all teams",
        responses: {
          "200": {
            description: "List of teams",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Team"
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Teams"],
        summary: "Create a new team",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTeamRequest"
              },
              examples: {
                withAllFields: {
                  value: {
                    name: "Flamengo",
                    address: "Rio de Janeiro, Brazil",
                    nickname: "Fla",
                    titles: [
                      {
                        competition: "Copa Libertadores",
                        year: 2022
                      }
                    ]
                  }
                },
                withRequiredOnly: {
                  value: {
                    name: "Santos"
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Team created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Team"
                }
              }
            }
          },
          "400": {
            description: "Invalid request data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Name is not informed."
                    }
                  }
                }
              }
            }
          },
          "500": {
            description: "Internal server error"
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Title: {
        type: "object",
        properties: {
          competition: { type: "string" },
          year: { type: "number" }
        },
        required: ["competition", "year"]
      },
      Team: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          address: { type: "string", nullable: true },
          nickname: { type: "string", nullable: true },
          titles: {
            type: "array",
            nullable: true,
            items: { $ref: "#/components/schemas/Title" }
          }
        },
        required: ["id", "name", "address", "nickname", "titles"]
      },
      CreateTeamRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          address: { type: "string", nullable: true },
          nickname: { type: "string", nullable: true },
          titles: {
            type: "array",
            nullable: true,
            items: { $ref: "#/components/schemas/Title" }
          }
        },
        required: ["name"]
      }
    }
  }
};
