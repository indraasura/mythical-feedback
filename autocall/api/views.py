from django.http import HttpResponse
from rest_framework import status, generics
from urllib import request as urllib_request
from rest_framework.response import Response as framework_response
from rest_framework.views import APIView
from backend.settings import ACCOUNT_SID, AUTH_TOKEN, WEBSITE_URL, MEDIA_ROOT
from twilio.rest import Client
from autocall.models import Survey, SurveyResponse, Response
from twilio.twiml.voice_response import VoiceResponse
import speech_recognition as sr
from django.core.files import File
from .serializers import SurveyResponseSerializer


media_root = MEDIA_ROOT + '/'


class SurveyResponseAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    """
    lookup_field = 'pk'
    permission_classes = ()
    serializer_class = SurveyResponseSerializer

    def get_queryset(self):
        return SurveyResponse.objects.all()


class UpdateStatusCallAPIView(APIView):

    def post(self, request, *args, **kwargs):
        survey_response = request.GET.get('response')
        survey_response_model = SurveyResponse.objects.get(id=survey_response)
        survey_response_model.call_status = request.POST['CallStatus']
        survey_response_model.save()

        return framework_response({'message': 'Done'})


class MakeCallAPIView(APIView):
    # client = Client(ACCOUNT_SID, AUTH_TOKEN)

    def post(self, request, *args, **kwargs):
        print(request.data)
        to_phonenumber = request.data['to_phonenumber']
        survey_script = request.data['survey']
        temp_account_sid = request.data['account_sid']
        temp_auth_token = request.data['auth_token']
        temp_from_phonenumber = request.data['from_phonenumber']

        survey_model = Survey.objects.get(script_id=survey_script)
        survey = survey_model.id

        survey_response = SurveyResponse.objects.create(survey=survey_model, phone_number=to_phonenumber,
                                                        call_status='queued')
        survey_response.save()

        if (temp_account_sid and temp_auth_token and temp_from_phonenumber):
            client = Client(temp_account_sid, temp_auth_token)
            from_phonenumber = temp_from_phonenumber
        else:
            client = Client(ACCOUNT_SID, AUTH_TOKEN)
            from_phonenumber = '+12019044102'


        call = client.calls.create(
            to=to_phonenumber,
            from_=from_phonenumber,
            status_callback=WEBSITE_URL + '/status/?response=' + str(survey_response.id),
            status_callback_event=['queued', 'initiated', 'ringing', 'answered', 'completed', 'busy', 'canceled', 'failed'],
            status_callback_method='POST',
            url=WEBSITE_URL + "/answer/?survey=" + str(survey) + '&phone=' + str(to_phonenumber) + '&response=' + str(survey_response.id)
        )

        return framework_response({'id': survey_response.id})


class AnswerCallAPIView(APIView):

    def post(self, request, *args, **kwargs):
        survey_id = request.GET.get('survey')
        survey_phone = request.GET.get('phone')
        survey_model = Survey.objects.get(id=survey_id)
        survey_script_flow = survey_model.script_flow['data']
        survey_response = request.GET.get('response')
        print('Answer CallSid', request.data['CallSid'])

        # Quickly creating the response field just to let react knows that we are working on this response
        response_model = Response.objects.create(question_id=str(survey_script_flow[0]['id']))
        response_model.save()
        survey_model = SurveyResponse.objects.get(id=survey_response)
        survey_model.responses.add(response_model.id)

        response = VoiceResponse()
        response.say(survey_script_flow[0]['question'], voice=survey_script_flow[0]['voice_gender'])

        response.record(timeout=3,
                        max_length=survey_script_flow[0]['record_time'],
                        action=WEBSITE_URL + '/next/?counter=1&survey=' + str(survey_id) + '&response=' + str(survey_response),
                        # maxLength
                        recordingStatusCallback=WEBSITE_URL + '/save/?survey=' + str(survey_id) + '&question=' +
                                                str(survey_script_flow[0]['id']) + '&response=' + str(survey_response),
                        trim="trim-silence")

        response.say('I did not receive a recording')
        response.hangup()
        print(str(response))
        return HttpResponse(str(response), content_type='text/xml')


class NextCallAPIView(APIView):

    def post(self, request, *args, **kwargs):
        survey_id = request.GET.get('survey')
        survey_response = request.GET.get('response')
        survey_counter = int(request.GET.get('counter'))
        survey_model = Survey.objects.get(id=survey_id)
        survey_script_flow = survey_model.script_flow['data']
        print('Next Call CallSid', request.data['CallSid'])

        response = VoiceResponse()
        if len(survey_script_flow) > survey_counter:

            # Quickly creating the response field just to let react knows that we are working on this response
            response_model = Response.objects.create(question_id=str(survey_script_flow[survey_counter]['id']))
            response_model.save()
            survey_model = SurveyResponse.objects.get(id=survey_response)
            survey_model.responses.add(response_model.id)
            response.say(survey_script_flow[survey_counter]['question'], voice=survey_script_flow[survey_counter]['voice_gender'])

            response.record(timeout=3,
                            max_length=survey_script_flow[survey_counter]['record_time'],
                            action=WEBSITE_URL + '/next/?counter=' + str(survey_counter + 1) + '&survey=' + survey_id + '&response=' + str(survey_response),
                            recordingStatusCallback=WEBSITE_URL + '/save/?survey=' + str(survey_id) + '&question=' +
                                                    str(survey_script_flow[survey_counter]['id']) + '&response=' + str(survey_response),
                            trim="trim-silence")

            response.say('I did not receive a recording')
            response.hangup()
            return HttpResponse(str(response), content_type='text/xml')
        else:
            response.say('Thank you for contacting us')
            return HttpResponse(str(response), content_type='text/xml')


class SaveCallAPIView(APIView):
    """
    Save Call recordings as wav
    """

    def post(self, request, *args, **kwargs):
        survey_response = request.GET.get('response')
        question_id = request.GET.get('question')
        recording_sid = request.data['RecordingSid']
        recording_url = request.data['RecordingUrl']
        print('Saving CallSid', request.data['CallSid'])

        input_file = urllib_request.urlopen(recording_url)
        output_file = open(media_root + recording_url.split('/')[-1] + '.wav', 'wb')
        output_file.write(input_file.read())
        output_file.close()
        input_file.close()

        transcript = get_text(media_root + recording_url.split('/')[-1] + '.wav')

        print('file=', media_root + recording_url.split('/')[-1] + '.wav')
        open_file = File(open(media_root + recording_url.split('/')[-1] + '.wav', 'wb+'))
        # Add Call Sid to have unique response for each questionID
        response_model = Response.objects.get(question_id=question_id)
        response_model.audio_file = open_file
        response_model.transcript = transcript
        response_model.save()

        survey_model = SurveyResponse.objects.get(id=survey_response)
        survey_model.responses.add(response_model.id)
        # call = client.calls(active_call_id).update(status='completed')
        return HttpResponse({'status': 'OK'}, content_type='text/xml')


def get_text(filename, call_sid=None):
    AUDIO_FILE = (filename)
    # use the audio file as the audio source
    r = sr.Recognizer()
    with sr.AudioFile(AUDIO_FILE) as source:
        audio = r.record(source)
    try:
        return r.recognize_google(audio)
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
        return 'None'
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
        return 'None'
