# ROUTES

## GLOBALS

E : Everyone, M : Me, A : Admin, R : Recruteur

### USERS
- /users/userlist [A]
- /users/current [M, A]
- /users/current/candidatures [M, A]
- /users/{id} [A]
- /users/{id}/candidatures [A]

### ORGANISATIONS
- /organizations/organizationlist [E]
- /organizations/{id} [E]

### OFFRES
- /offers/offerlist [E]
- /offers/{id} [E]
- /offers/{id}/candidatures [R, A]

### FICHES
- /jobs/joblist [E]
- /jobs/{id} [E]

### CANDIDATURES
- /candidatures/candidaturelist [A]
- /candidatures/{id} [R, A]
- /candidatures/{id}/pieces [R, A]

### PIECES
- /pieces/{id} [R, A]

## ADMINS
### ADMIN
- /admin [A]