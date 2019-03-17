from django.db import models
from accounts.models import User
from scriptbuilder.models import ScriptBuilder
from django.contrib.postgres.fields import JSONField


class Survey(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    script = models.OneToOneField(ScriptBuilder, on_delete=models.CASCADE)
    script_flow = JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)


class Response(models.Model):
    audio_file = models.FileField()
    transcript = models.TextField(blank=True)
    question_id = models.CharField(max_length=80)
    timestamp = models.DateTimeField(auto_now_add=True)


class SurveyResponse(models.Model):
    survey = models.ForeignKey(Survey)
    phone_number = models.CharField(max_length=15)
    call_status = models.CharField(max_length=20, default='NOT')
    responses = models.ManyToManyField(Response)
    timestamp = models.DateTimeField(auto_now_add=True)
