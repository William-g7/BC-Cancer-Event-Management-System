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
- Fix small bugs in the project to ensure smoother functionality
- Develop additional features, such as a calendar, to enhance usability
- Conduct thorough code reviews for the entire team to maintain quality and consistency

---

## Action Items
Identify actionable steps that can be taken to improve future projects.
1. Implement robust error handling and comprehensive testing procedures
2. Encourage all team members to write cleaner, more organized code
3. Dedicate time to practicing presentations for clearer and more confident delivery

---

## Individual Self-Assessments
### [Shiyuan Chen]
- **Achievements and Contributions:**
  - clean up the codes for all features and prepare for deployment
  - clean up the database and delete the test data
  - prepare for the presentation
  
- **Challenges Faced:**
  - some sql queries are slow to run
- **Areas for Improvement:**
  - better communication with the team members to keep git history clean
- **Feedback and Suggestions:**
  - be careful about the git history - do not mix the codes from different features and change other people's codes

### [Yan Wang]
- **Achievements and Contributions:**
  - Improved the frontend layout by modifying the code for a better user experience
  - Practiced team presentations to ensure a smooth delivery
- **Challenges Faced:**
  - Encountered persistent bugs when merging code
  - Faced difficulties in optimizing data fetching for better performance
- **Areas for Improvement:**
  - Enhance proficiency in Git 
  - Develop a clearer and more organized code structure
- **Feedback and Suggestions:**
  - Task distribution was effective, and all team members completed their tasks on time
  - Recommend holding some meetings to update everyone on team progress

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

### Zhenziye Lin
- **Achievements and Contributions:**
  - Assisted in refining the donor selection functionality by providing feedback on user flow and interface design.
  - Contributed to the improvement of database schema by suggesting optimizations for the `Selections` table.
  - Participated actively in debugging SQL queries to ensure accurate donor status updates.
  - Played a key role in team meetings by facilitating discussions on feature prioritization and timelines.
  
- **Challenges Faced:**
  - Faced difficulties in coordinating front-end and back-end integration due to different approaches in state management.
  - Encountered challenges while working with React components, particularly in managing real-time updates for `DataGrid`.
  
- **Areas for Improvement:**
  - Improve proficiency in advanced React features, such as custom hooks and state management libraries, to streamline front-end development.
  - Enhance debugging techniques for front-end integration issues, especially in identifying the root cause of data inconsistencies.
  
- **Feedback and Suggestions:**
  - Allocate more time for collaborative debugging sessions to address integration challenges efficiently.
  - Introduce regular code reviews to maintain consistency and adherence to best practices across the team.

---

### Overall Team Assessment

- **Team Strengths:**
  - The team consistently held regular meetings, ensuring open communication and alignment on project goals.
  - Team members actively contributed to their respective areas and were proactive in addressing challenges.
  - Prompt collaboration with each other and the TA/instructor helped resolve technical issues efficiently.

- **Areas for Improvement:**
  - While technical challenges were resolved, some integration issues between front-end and back-end components could have been addressed earlier.
  - There was limited time allocated for thorough code reviews, leading to minor inconsistencies in coding styles and structure.
  - Testing was often delayed to the later stages of development, making debugging more challenging.

- **Suggestions for Future Projects:**
  - Incorporate a structured code review process to ensure consistency and adherence to best practices across the team.
  - Allocate more time for error handling and testing at every stage of development to minimize late-stage debugging efforts.
  - Schedule additional team sync-ups to discuss integration progress and potential roadblocks earlier in the process.
  - Enhance the use of project management tools to track task progress and dependencies effectively.

## Additional Comments
Add any additional comments or notes that may be relevant.
-
