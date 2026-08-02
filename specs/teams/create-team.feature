# Create team

Description:
A user can add a football team to the catalog. The team name is required and must
be unique. Nickname and address are optional. The user is informed when creation
succeeds or fails.

Background:
  Given the user is viewing the teams catalog

## Scenario: Create a team with a valid name
  When the user adds a team with a valid unique name
  Then the team is available in the teams catalog
  And the user is informed that the team was created

## Scenario Outline: Invalid team name is rejected
  When the user tries to add a team with <invalid_name>
  Then the team is not created
  And the user is told <message>

  Examples:
    | invalid_name   | message                  |
    | empty name     | name is required         |
    | duplicate name | name is already in use   |

## Scenario: Failed creation can be retried with a clean state
  When adding a team fails with an error
  And the user cancels and starts adding a team again
  Then no previous team details or error message remain
