<h1 align="center">
	<img width="343" src="https://imgur.com/wOOWWqm.png" alt="MythFeed">
	<br>
	<br>
</h1>

Django-React Webapp giving normal users a super-power to create call flow with just drag and drop feature and linking them to decide how the call should flow and then recording user feedback with transcript based on their response.

[![Build Status](https://travis-ci.com/shashank-sharma/mythical-feedback.svg?branch=master)](https://travis-ci.com/shashank-sharma/mythical-feedback)
![Heroku](http://heroku-badge.herokuapp.com/?app=mythfeed&style=flat&svg=1)
![versions](https://img.shields.io/pypi/pyversions/pybadges.svg)

<b>Usable, testing required</b>

<img src="https://imgur.com/ITSaL2r.jpg" />

### Why call ?

1. Because it is fun talking to a robot
2. No need of internet, just speak out loud
3. It's automatic and much secure

### How it works ?

There are 2 main problems which you will face while working on this idea:
1. Creating flow chart with better user experience
2. Able to use Twilio TwiML markup language

To solve the first issue, I used react-storm library which is perfect for this scenario. I searched for many libraries available to create flow charts but this one was the best with customizable UI and able to generate json with serialize and deserialize ability. There are many great features which you can check out.

Second issue is to make calls and have custom programmable voice. For this I have used Django + Postgresql with twilio. Now whenever user creates his flow, we will save his JSON in database. Now coming for call, right now twilio works with twiML markup language, which means that before we let robot say anything, we need to specify what needs to be done by returning all instruction first, so with django we track which questions needs to be asked and fetch those information from database. So it will be one function with same logic calling itself with different parameter so that we can get different question text from it and then save the response as wav.
Example

```
response.record(timeout=2,
                action=WEBSITE_URL + '/next/?counter=1&survey=' + str(survey_id) + '&response=' + str(survey_response),
                recordingStatusCallback=WEBSITE_URL + '/save/?survey=' + str(survey_id) + '&question=' +
                str(survey_script_flow[0]['id']) + '&response=' + str(survey_response), trim="trim-silence")
```

Here Twilio webhook will access that link, means one function and only thing we are changing is which survey id needs to be accessed, which response we are doing (question number), where to save the recording and more. A bit complicated to explain but I hope it makes sense.

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
Using Postgresql for database and make sure you are using postgresql >=9.4

Using psql:<br />
`CREATE ROLE admin WITH LOGIN PASSWORD 'password';`<br />
`create database feedback;`<br />
`GRANT ALL PRIVILEGES ON DATABASE feedback TO admin;`

`databaseurl: postgresql://admin:password@localhost/feedback`

5. Set up Virtual Environment values (As mentioned in .env.example)<br />
a. Secret Key: `SECRET_KEY=RANDOMTEXT`<br />
b. Database Url: `DATABASE_URL=<databaseurl>`
c. Twilio credentials: `ACCOUNT_SID=<accound_sid_id>`
d. Twilio token: `AUTH_TOKEN=<auth_token>`

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

Not that important but if you want to test the calling feature locally then follow the steps<br />
Make sure you get the callable number from twilio.<br />
Now since making a call to your number requires twilio to have some callback url so we will use ngrok to make it work.

Link: https://ngrok.com/download

Once downloaded use:

`./ngrok http 8000`

Now this will generate one public URL. Copy the given url and paste it in settings.py in:

1. ALLOWED_HOSTS
2. WEBSITE_URL

Once that is done, you are ready for calling feature too.<br />
