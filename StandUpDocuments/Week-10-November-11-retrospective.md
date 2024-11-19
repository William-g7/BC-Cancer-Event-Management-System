# Retrospective Document Template

## Team Name
PuppyLover

## Date
Week 10 November 11

## Participants
- Shiyuan Chen
- Yan Wang
- Xing Gao
- Zhenziye Lin

---

## Overview
Briefly describe the purpose of this retrospective and what you aim to achieve.

- have a very primary understanding of the client's requirements
- find questions to ask

## What Went Well
List the things that went well during the project.
- have meetings regularly
- all the members finished the work step by step
- all the members communicate with each other promptly

---

## What Could Be Improved
List the areas where there is room for improvement.
- small bugs fixed for the project
- Develop other features such as calendar feature 
- code reviews for the whole team

---

## Action Items
Identify actionable steps that can be taken to improve future projects.
1. Error handling and testing
2. every member make their codes cleaner and organized
3. presentation practices

---

## Individual Self-Assessments
### [Team Member 1]
- **Achievements and Contributions:**
  - finish the full-stack codes for the 'create event' feature
  - enrich the database with 5000 donors from the outside API
  - finish the high-fidelity mockup for the whole application
  - optimize the layout of the frontend pages based on the latest design
  
- **Challenges Faced:**
  - It is hard to test some backend codes and delete the test date from the database
- **Areas for Improvement:**
  - the frontend codes need to be cleaner and more organized to follow the best practices
- **Feedback and Suggestions:**
  - do some unit testing for the backend codes at the early stage of development

### [Team Member 2]
- **Achievements and Contributions:**
  -
- **Challenges Faced:**
  -
- **Areas for Improvement:**
  -
- **Feedback and Suggestions:**
  -

### [Xing Gao]
- **Achievements and Contributions:**
  - Successfully implemented donor selection functionality for fundraisers, allowing users to save selected donors with a "selected" status and confirm selections with a "confirmed" status.
  - Enabled the persistence of donor selection states across page reloads, ensuring selected and confirmed donors remain highlighted and display the correct status.
  - Enhanced user experience by integrating real-time synchronization with the database, ensuring consistency between the front-end display and back-end data.
  - Overcame technical challenges related to SQL queries to accurately fetch donor states based on the `Selections` table, ensuring the correct state is displayed in the UI.

- **Challenges Faced:**
  - Encountered issues with SQL query logic when retrieving donor states, leading to incorrect or missing state updates in the UI.
  - Debugging and resolving an issue where the API returned correct data, but the front-end failed to reflect the updated states due to mishandled mapping or integration.
  - Experienced difficulties in ensuring the front-end `DataGrid` component dynamically updated selected donors based on back-end data during page refresh.

- **Areas for Improvement:**
  - Improve understanding of SQL joins and query optimization to handle complex data retrieval scenarios more effectively.
  - Enhance testing practices to validate end-to-end functionality, particularly ensuring consistency between front-end state and back-end data.
  - Collaborate more closely with team members to identify and address potential integration issues earlier in the development process.

- **Feedback and Suggestions:**
  - The `DataGrid` implementation was an effective solution for displaying and managing donor data, but the handling of state updates could be streamlined further to reduce redundancy in the code.
  - Consider creating utility functions or hooks for common data transformation tasks, such as mapping database states to front-end components.
  - Document the logic and flow of donor selection and confirmation processes to make it easier for other team members to maintain and enhance this feature in the future.

### [Team Member 4]
- **Achievements and Contributions:**
  -
- **Challenges Faced:**
  -
- **Areas for Improvement:**
  -
- **Feedback and Suggestions:**
  -

### [Team Member 5]
- **Achievements and Contributions:**
  -
- **Challenges Faced:**
  -
- **Areas for Improvement:**
  -
- **Feedback and Suggestions:**
  -

---

## Overall Team Assessment
Reflect on the team’s performance as a whole.
- **Team Strengths:**
  -
- **Areas for Improvement:**
  -
- **Suggestions for Future Projects:**
  -

---

## Additional Comments
Add any additional comments or notes that may be relevant.
-
