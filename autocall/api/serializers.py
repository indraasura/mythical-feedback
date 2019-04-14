from rest_framework import serializers
from autocall.models import SurveyResponse, Response


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ('id', 'transcript', 'question_id', 'timestamp')


class SurveyResponseSerializer(serializers.ModelSerializer):
    responses = ResponseSerializer(read_only=True, many=True)

    class Meta:
        model = SurveyResponse
        fields = ('id', 'survey', 'phone_number', 'call_status', 'timestamp', 'responses')
