from django.conf.urls import url
from .api.views import MakeCallAPIView,\
    AnswerCallAPIView, NextCallAPIView, SaveCallAPIView, UpdateStatusCallAPIView, SurveyResponseAPIView

urlpatterns = [
    url(r'^call/$', MakeCallAPIView.as_view(), name='autocall-call'),
    url(r'^answer/', AnswerCallAPIView.as_view(), name='autocall-answer'),
    url(r'^next/$', NextCallAPIView.as_view(), name='autocall-next'),
    url(r'^save/', SaveCallAPIView.as_view(), name='autocall-save'),
    url(r'^status/', UpdateStatusCallAPIView.as_view(), name='autocall-status'),
    url(r'^survey/responses/(?P<pk>\d+)', SurveyResponseAPIView.as_view(), name='autocall-survey-response'),
]