# Retrospective Document Template

## Team Name
Puppy Lover

## Date
Week 9 November 04

## Participants
- Shiyuan Chen
- Yan Wang
- Xing Gao
- Zhenziye Lin

---

## Overview
This retrospective outlines our achievements and challenges from the past week, providing insights on areas for improvement for the next phase of the project.

---

## What Went Well
List the things that went well during the project.
- Successfully fetched data from the provided API and stored it in the database
- Developed proficiency in connecting the client side and server side using REST APIs
- Made adjustments to the webpage layout

---

## What Could Be Improved
List the areas where there is room for improvement.
- Improving the responsiveness of the webpage layout 
- Enhancing skills in TypeScript and React
- Strengthening database management practices

---

## Action Items
Identify actionable steps that can be taken to improve future projects.
1. Continue developing skills in TypeScript and React
2. Focus on achieving user-centered features
3. Implement unit testing 

---

## Individual Self-Assessments
### [Shiyuan chen]
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

### [Yan Wang]
- **Achievements and Contributions:**
  - Enhanced the robustness of the login feature
  - Updated project routes to improve security
  - Refined the webpage layout
- **Challenges Faced:**
  - Webpage layout adjustments are time-consuming and require significant patience
  - Lack of familiarity with database syntax
- **Areas for Improvement:**
  - Strengthen database skills
  - Continue practicing frontend development skills
- **Feedback and Suggestions:**
  - Our group is very supportive, and we actively help each other when facing bugs—let’s keep this up!
  - Set clear objectives for the next sprint to ensure focused progress

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


---

## Overall Team Assessment
Reflect on the team’s performance as a whole.
- **Team Strengths:**
  - Team members consistently support each other, especially when tackling technical challenges. This collaborative approach has fostered a productive and positive working environment.
  - Each member has contributed unique skills, allowing us to cover a wide range of tasks, from database management and backend development to frontend layout and design.
  - The team demonstrates resilience and resourcefulness, actively seeking solutions for complex problems in both frontend and backend functionalities.
- **Areas for Improvement:**
  - Although we achieved many goals, better planning at the beginning of each sprint could help streamline our workflow and prevent last-minute rushes.
  - Comprehensive documentation of core features and workflows, such as donor selection logic, would improve project maintainability and help onboard team members more efficiently.
- **Suggestions for Future Projects:**
  - Implement code reviews to ensure code quality, maintain best practices, and promote knowledge sharing among team members.
  - Define specific, measurable goals at the beginning of each sprint to guide the team and help track progress effectively.
  - Encourage continuous learning in areas like TypeScript, React, and SQL, which are essential for the project’s success and the team's overall growth.

---

## Additional Comments
Add any additional comments or notes that may be relevant.
-
