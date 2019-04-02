## Introduction

Django-React Webapp giving normal users a super-power to create call flow with just drag and drop feature and linking them to decide how the call should flow and then recording user feedback with transcript based on their response.

<img src="https://imgur.com/ITSaL2r.jpg" />

### Why call ?

1. Because it is fun talking to a robot
2. No need of internet, just speak out loud
3. It's automatic and much secure

### How it works ?

// TODO

## Technology Used

1. Django with Django REST Framework
2. ReactJS
3. React Storm for flow generation
4. Twilio for call

## Installation

### Django

1. Clone the repository by:<br />
`git clone https://github.com/shashank-sharma/mythical-feedback`

2. Create Virtual Environment named as `env` by doing<br />
`python3 -m venv env`

Now activate it by:<br />
`source env/bin/activate` (Linux)<br>
`myvenv\Scripts\activate` (Windows)

3. Install dependencies<br />
`pip install -r requirements.txt`

4. Database configuration

Using psql:<br />
`CREATE ROLE admin WITH LOGIN PASSWORD 'password';`<br />
`create database feedback;`<br />
`GRANT ALL PRIVILEGES ON DATABASE feedback TO admin;`

`databaseurl: postgresql://admin:password@localhost/feedback`

5. Set up Virtual Environment values (As mentioned in .env.example)<br />
a. Secret Key: `SECRET_KEY=RANDOMTEXT`<br />
b. Database Url: `DATABASE_URL=<databaseurl>`

6. Migration: <br />
`python manage.py makemigrations`<br />
`python manage.py migrate`

7. Run your server by:<br />
`python manage.py runserver`

### React

1. Move to frontend directory:<br />
`cd frontend/`

2. Install necessadry dependencies by:<br />
`npm install`

3. Run by doing:<br />
`npm run start`

Make sure you run both of the things in-order to make it run in your local machine.

### Twilio

Not that important but if you want to test the calling feature then follow the steps<br />
Make sure you get the callable number from twilio.<br />
Now since making a call to your number requires twilio to have some callback url so we will use ngrok to make it work.

Link: https://ngrok.com/download

Once downloaded use:

`./ngrok http 8000`

Now this will generate one public URL. Copy the given url and paste it in settings.py in:

1. ALLOWED_HOSTS
2. WEBSITE_URL

Once that is done, you are ready for calling feature too.<br />
<b>Note: Currently calling feature is not stable so don't use it right now</b>

