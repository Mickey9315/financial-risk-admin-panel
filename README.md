# TRAD admin panel

### Web App for Credit Risk Assessment

##Introduction:
The TRAD is a financial services company who provides credit assessments for large businesses to protect financial health of the business.

- Purpose of this project:

  - Decrease the financial risk for large businesses with the system that allow to send information to the customers about their clients.
  - Automations on the credit limit.
  - Good user interface (UI).

- What we have archived with this project:
  - A dynamic system with integration of different services like ABR Lookup, New Zealand Lookup, RSS, Illion.

##Module:

- TRAD Risk Portal

###1. Purpose of the module:

- TRAD Risk Portal is an admin panel which will manage the flow of the business. It connects backend & third-party services.
- Clients will be managed by using TRAD Risk Portal.

###2. Features of the module:

- All modules are managed here like Dashboard, Users, Insurer, Clients, Debtors, Applications, Tasks, Overdues, Claims, Reports.
- Access management is there for different modules and users.
- Logging of all the activities is here.

###3. Technical stack of module:

- Front-end Framework: ReactJS

###4. Configure Module:

- Configure back-end point
  - In **source/admin-panel/. env-cmdrc** (environment file) replace the ‘REACT_APP_BASE_URL’ with the generated Api URL pointing to your backend according to environments.

###5. Get up and running:

- Install Requirements
- Go to source/admin-panel directory and open terminal for that directory
  - Run **“npm I”** to install dependencies.
  - Run **“npm run <environment name>”** to run project and admin-panel loads on port available with your system default is port: 3000, **ex: npm run dev**.
  - Login into panel from browser at **“localhost:<port number>”** by providing credentials.
  - Dashboard will load once authentication done.
