from rest_framework import serializers
from autocall.models import SurveyResponse


class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResponse
        fields = ('id', 'survey', 'phone_number', 'call_status', 'timestamp', 'responses')
