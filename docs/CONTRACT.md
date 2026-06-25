# CarbonTrust Protocol - Contract Reference

## Methods

### Write Methods
- `create_project(...)` - Create a new assessment case
- `add_evidence(...)` - Submit evidence to a project
- `request_review(project_id)` - Trigger AI consensus review

### Read Methods
- `get_project(project_id)` - Get project details
- `get_project_evidence(project_id)` - Get all evidence for a project
- `get_project_assessment(project_id)` - Get latest assessment
- `get_assessment_history(project_id)` - Get all assessments
- `get_project_count()` - Get total project count
- `get_projects_by_owner(owner)` - Get projects by owner address
